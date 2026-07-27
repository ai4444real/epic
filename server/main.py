from __future__ import annotations

import os
import json
import secrets
import sqlite3
import time
import uuid
from hashlib import sha256
from pathlib import Path
from typing import Callable
from urllib.parse import quote

from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, PlainTextResponse, RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware


APP_ROOT = Path(__file__).resolve().parents[1]
SERVER_ROOT = Path(__file__).resolve().parent
load_dotenv(APP_ROOT / ".env")
DEFAULT_DB_PATH = SERVER_ROOT / "var" / "access_log.sqlite3"
DB_PATH = Path(os.getenv("EPIC_ACCESS_DB", str(DEFAULT_DB_PATH))).resolve()
AUTH_DB_PATH = Path(os.getenv("EPIC_AUTH_DB", str(SERVER_ROOT / "var" / "auth.sqlite3"))).resolve()
CONTENT_DB_PATH = Path(os.getenv("EPIC_CONTENT_DB", str(SERVER_ROOT / "var" / "content.sqlite3"))).resolve()
SCENARIOS_SEED_PATH = SERVER_ROOT / "seeds" / "scenarios.json"
SERVICE_NAME = os.getenv("EPIC_SERVICE_NAME", "epic-web")
SESSION_COOKIE_NAME = "epic_auth"
SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30
SESSION_SECRET = os.getenv("SESSION_SECRET", "")
COOKIE_SECURE = os.getenv("EPIC_COOKIE_SECURE", "true").lower() != "false"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "")
BOOTSTRAP_ADMIN_EMAILS = {
    email.strip().lower()
    for email in os.getenv("EPIC_ADMIN_EMAILS", "genini@gmail.com").split(",")
    if email.strip()
}

PAGE_ALIASES = {
    "/": APP_ROOT / "index.html",
    "/epic": APP_ROOT / "epic.html",
    "/epic/mazzo": APP_ROOT / "ordina-mazzo.html",
}

TOOL_ALIASES = {
    "/epic/simulator": {
        "free": APP_ROOT / "epic-simulator-free.html",
        "unlocked": APP_ROOT / "epic-simulator-locked.html",
    },
    "/epic/explorer": {
        "free": APP_ROOT / "epic-explorer-free.html",
        "unlocked": APP_ROOT / "epic-explorer-locked.html",
    },
    "/epic/cards": {
        "free": APP_ROOT / "epic-all-cards-free.html",
        "unlocked": APP_ROOT / "epic-all-cards-locked.html",
    },
}

PROTECTED_PAGES = {
    "/epic-all-cards.html",
    "/epic-all-cards-locked.html",
    "/epic-cross.html",
    "/epic-explorer.html",
    "/epic-explorer-locked.html",
    "/epic-live-table.html",
    "/epic-simulator.html",
    "/epic-simulator-locked.html",
    "/tools-index.html",
}

PROTECTED_ALIASES = {
    "/epic/cross": APP_ROOT / "epic-cross.html",
    "/epic/live-table": APP_ROOT / "epic-live-table.html",
    "/epic/simulator/full": APP_ROOT / "epic-simulator-locked.html",
    "/epic/explorer/full": APP_ROOT / "epic-explorer-locked.html",
    "/epic/cards/full": APP_ROOT / "epic-all-cards-locked.html",
}

ADMIN_PAGES = {
    "/admin-users.html",
    "/admin-logs.html",
}

ADMIN_ALIASES = {
    "/admin/users": APP_ROOT / "admin-users.html",
    "/admin/logs": APP_ROOT / "admin-logs.html",
}

ASSET_EXTENSIONS = {
    ".css",
    ".js",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
    ".map",
}

oauth = OAuth()
if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
    oauth.register(
        name="google",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )


def create_app() -> FastAPI:
    app = FastAPI(title="EPiC Web", docs_url=None, redoc_url=None)
    init_access_db()
    init_auth_db()
    init_content_db()
    app.add_middleware(
        SessionMiddleware,
        secret_key=SESSION_SECRET or secrets.token_urlsafe(32),
        same_site="lax",
        https_only=COOKIE_SECURE,
    )
    app.add_middleware(AccessLogMiddleware)

    @app.get("/health")
    async def health() -> JSONResponse:
        return JSONResponse({"status": "healthy", "service": SERVICE_NAME})

    @app.get("/login")
    async def login() -> Response:
        return page_response(APP_ROOT / "login.html")

    @app.get("/auth/google/start")
    async def auth_google_start(request: Request) -> Response:
        if not google_oauth_configured():
            return PlainTextResponse("Google OAuth non configurato sul server.", status_code=503)

        next_path = sanitize_next(request.query_params.get("next") or "/")
        request.session["post_login_next"] = next_path
        redirect_uri = GOOGLE_REDIRECT_URI or str(request.url_for("auth_google_callback"))
        return await oauth.google.authorize_redirect(request, redirect_uri)

    @app.get("/auth/google/callback", name="auth_google_callback")
    async def auth_google_callback(request: Request) -> Response:
        if not google_oauth_configured():
            return PlainTextResponse("Google OAuth non configurato sul server.", status_code=503)

        token = await oauth.google.authorize_access_token(request)
        userinfo = token.get("userinfo")
        if not userinfo:
            userinfo = await oauth.google.userinfo(token=token)

        email = (userinfo.get("email") or "").strip().lower()
        google_sub = userinfo.get("sub") or ""
        if not email or not google_sub:
            return PlainTextResponse("Google non ha restituito email/sub validi.", status_code=400)

        role = upsert_user(
            google_sub=google_sub,
            email=email,
            name=userinfo.get("name") or "",
            picture=userinfo.get("picture") or "",
        )
        session_token = create_auth_session(email=email, google_sub=google_sub)
        next_path = sanitize_next(request.session.pop("post_login_next", "/"))

        response = RedirectResponse(next_path, status_code=303)
        response.set_cookie(
            SESSION_COOKIE_NAME,
            session_token,
            max_age=SESSION_MAX_AGE_SECONDS,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite="lax",
        )
        return response

    @app.get("/logout")
    async def logout(request: Request) -> Response:
        token = request.cookies.get(SESSION_COOKIE_NAME)
        if token:
            delete_auth_session(token)
        response = RedirectResponse("/epic", status_code=303)
        response.delete_cookie(SESSION_COOKIE_NAME, secure=COOKIE_SECURE, samesite="lax")
        return response

    @app.get("/me")
    async def me(request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"authenticated": False}, status_code=401)
        return JSONResponse({"authenticated": True, "user": user})

    @app.get("/api/scenarios")
    async def api_scenarios(request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_protected(user):
            return JSONResponse({"error": "unlocked_required"}, status_code=403)
        return JSONResponse(list_scenarios())

    @app.get("/api/scenarios/random")
    async def api_scenarios_random(request: Request, limit: int | None = None) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_protected(user):
            return JSONResponse({"error": "unlocked_required"}, status_code=403)
        safe_limit = limit if limit and limit > 0 else None
        return JSONResponse(list_scenarios(random_order=True, limit=safe_limit))

    @app.get("/api/live/rooms")
    async def api_live_rooms(request: Request, limit: int = 30) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_protected(user):
            return JSONResponse({"error": "unlocked_required"}, status_code=403)
        return JSONResponse(list_live_rooms(limit=limit))

    @app.get("/api/live/rooms/{room_id}")
    async def api_live_room(room_id: str) -> JSONResponse:
        room = get_live_room(room_id)
        if not room:
            return JSONResponse({"error": "not_found"}, status_code=404)
        return JSONResponse(room)

    @app.put("/api/live/rooms/{room_id}")
    async def api_save_live_room(room_id: str, request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_protected(user):
            return JSONResponse({"error": "unlocked_required"}, status_code=403)
        try:
            payload = await request.json()
            saved = save_live_room(room_id, payload, user)
        except ValueError as error:
            return JSONResponse({"error": str(error)}, status_code=400)
        return JSONResponse(saved)

    @app.delete("/api/live/rooms/{room_id}")
    async def api_delete_live_room(room_id: str, request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_protected(user):
            return JSONResponse({"error": "unlocked_required"}, status_code=403)
        deleted = delete_live_room(room_id)
        return JSONResponse({"deleted": deleted})

    @app.get("/api/admin/users")
    async def api_admin_users(request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_admin(user):
            return JSONResponse({"error": "admin_required"}, status_code=403)
        return JSONResponse(list_users())

    @app.post("/api/admin/users")
    async def api_admin_create_user(request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_admin(user):
            return JSONResponse({"error": "admin_required"}, status_code=403)
        try:
            payload = await request.json()
            created = create_pending_user(
                email=payload.get("email") if isinstance(payload, dict) else "",
                role=payload.get("role") if isinstance(payload, dict) else "",
            )
        except ValueError as error:
            return JSONResponse({"error": str(error)}, status_code=400)
        return JSONResponse(created, status_code=201)

    @app.put("/api/admin/users/{email:path}")
    async def api_admin_update_user(email: str, request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_admin(user):
            return JSONResponse({"error": "admin_required"}, status_code=403)
        try:
            payload = await request.json()
            updated = update_user_role(
                email=email,
                role=payload.get("role") if isinstance(payload, dict) else "",
                current_admin_email=user.get("email") or "",
            )
        except ValueError as error:
            return JSONResponse({"error": str(error)}, status_code=400)
        if not updated:
            return JSONResponse({"error": "not_found"}, status_code=404)
        return JSONResponse(updated)

    @app.delete("/api/admin/users/{email:path}")
    async def api_admin_delete_user(email: str, request: Request) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_admin(user):
            return JSONResponse({"error": "admin_required"}, status_code=403)
        try:
            deleted = delete_user(email=email, current_admin_email=user.get("email") or "")
        except ValueError as error:
            return JSONResponse({"error": str(error)}, status_code=400)
        return JSONResponse({"deleted": deleted})

    @app.get("/api/admin/logs")
    async def api_admin_logs(
        request: Request,
        limit: int = 200,
        path: str = "",
        session_id: str = "",
        status: int | None = None,
    ) -> JSONResponse:
        user = get_current_user(request)
        if not user:
            return JSONResponse({"error": "login_required"}, status_code=401)
        if not can_access_admin(user):
            return JSONResponse({"error": "admin_required"}, status_code=403)
        return JSONResponse(get_access_log_report(limit=limit, path=path, session_id=session_id, status=status))

    @app.post("/api/deck-orders")
    async def api_deck_orders(request: Request) -> JSONResponse:
        try:
            payload = await request.json()
            result = create_deck_order(payload, request)
        except ValueError as error:
            return JSONResponse({"error": str(error)}, status_code=400)
        return JSONResponse(result, status_code=201)

    @app.get("/{path:path}")
    async def serve(path: str, request: Request) -> Response:
        request_path = "/" + path
        if request_path in ADMIN_ALIASES:
            user = get_current_user(request)
            if not user:
                return redirect_to_login(request_path)
            if not can_access_admin(user):
                return PlainTextResponse("Accesso admin richiesto.", status_code=403)
            return page_response(ADMIN_ALIASES[request_path], with_root_base=True)

        if request_path in ADMIN_PAGES:
            user = get_current_user(request)
            if not user:
                return redirect_to_login(request_path)
            if not can_access_admin(user):
                return PlainTextResponse("Accesso admin richiesto.", status_code=403)

        if request_path in PROTECTED_ALIASES:
            user = get_current_user(request)
            if not user:
                return redirect_to_login(request_path)
            if not can_access_protected(user):
                return PlainTextResponse("Accesso non autorizzato.", status_code=403)
            return page_response(PROTECTED_ALIASES[request_path], with_root_base=True)

        if request_path in TOOL_ALIASES:
            user = get_current_user(request)
            tool_pages = TOOL_ALIASES[request_path]
            if user and can_access_protected(user):
                return page_response(tool_pages["unlocked"], with_root_base=True)
            return page_response(tool_pages["free"], with_root_base=True)

        if request_path in PAGE_ALIASES:
            return page_response(PAGE_ALIASES[request_path], with_root_base=True)

        if is_protected_page(request_path):
            user = get_current_user(request)
            if not user:
                return redirect_to_login(request_path)
            if not can_access_protected(user):
                return PlainTextResponse("Accesso non autorizzato.", status_code=403)

        static_response = static_file_response(request_path)
        if static_response:
            return static_response

        return PlainTextResponse("Not found", status_code=404)

    return app


def google_oauth_configured() -> bool:
    return bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and SESSION_SECRET and hasattr(oauth, "google"))


def sanitize_next(next_path: str) -> str:
    value = (next_path or "/").strip()
    if not value.startswith("/"):
        value = "/" + value
    if value.startswith("//") or "://" in value:
        return "/"
    if value.startswith("/auth/") or value in {"/login", "/logout"}:
        return "/"
    return value


def redirect_to_login(next_path: str) -> RedirectResponse:
    return RedirectResponse(f"/login?next={quote(sanitize_next(next_path))}", status_code=303)


def is_protected_page(request_path: str) -> bool:
    if request_path in PROTECTED_PAGES:
        return True
    return False


def can_access_protected(user: dict) -> bool:
    return user.get("role") in {"unlocked", "admin"}


def can_access_admin(user: dict) -> bool:
    return user.get("role") == "admin"


class AccessLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        started_at = time.perf_counter()
        response = await call_next(request)
        duration_ms = int((time.perf_counter() - started_at) * 1000)

        if should_log_access(request.url.path, request.method):
            session_id = request.cookies.get("epic_session")
            set_cookie = False
            if not session_id:
                session_id = uuid.uuid4().hex
                set_cookie = True

            write_access_log(request, response.status_code, duration_ms, session_id)

            if set_cookie:
                response.set_cookie(
                    "epic_session",
                    session_id,
                    max_age=60 * 60 * 24 * 365,
                    httponly=True,
                    secure=COOKIE_SECURE,
                    samesite="lax",
                )

        return response


def should_log_access(path: str, method: str) -> bool:
    if method.upper() != "GET":
        return False
    if path == "/health":
        return False
    if path.startswith("/api/"):
        return False
    suffix = Path(path).suffix.lower()
    return not suffix or suffix == ".html"


def init_access_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS access_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                method TEXT NOT NULL,
                path TEXT NOT NULL,
                query_string TEXT NOT NULL,
                status_code INTEGER NOT NULL,
                duration_ms INTEGER NOT NULL,
                client_ip TEXT NOT NULL,
                forwarded_for TEXT NOT NULL,
                user_agent TEXT NOT NULL,
                referer TEXT NOT NULL,
                session_id TEXT NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_access_log_created_at ON access_log(created_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_access_log_path ON access_log(path)")


def init_auth_db() -> None:
    AUTH_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                google_sub TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL DEFAULT '',
                picture TEXT NOT NULL DEFAULT '',
                role TEXT NOT NULL DEFAULT 'public',
                created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                last_login_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS auth_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token_hash TEXT NOT NULL UNIQUE,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                expires_at TEXT NOT NULL
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at)")
    seed_bootstrap_admins()


def init_content_db() -> None:
    CONTENT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scenarios (
                scenario_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                difficulty TEXT NOT NULL DEFAULT '',
                payload TEXT NOT NULL,
                seed_hash TEXT NOT NULL DEFAULT '',
                updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON scenarios(difficulty)")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS live_rooms (
                room_id TEXT PRIMARY KEY,
                owner_email TEXT NOT NULL DEFAULT '',
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                deleted_at TEXT NOT NULL DEFAULT ''
            )
            """
        )
        conn.execute("CREATE INDEX IF NOT EXISTS idx_live_rooms_updated_at ON live_rooms(updated_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_live_rooms_deleted_at ON live_rooms(deleted_at)")
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS deck_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                public_id TEXT NOT NULL DEFAULT '',
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                location TEXT NOT NULL DEFAULT '',
                quantity INTEGER NOT NULL DEFAULT 1,
                note TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'nuovo',
                client_ip TEXT NOT NULL DEFAULT '',
                user_agent TEXT NOT NULL DEFAULT '',
                created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
                updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            )
            """
        )
        deck_order_columns = {row[1] for row in conn.execute("PRAGMA table_info(deck_orders)").fetchall()}
        if "public_id" not in deck_order_columns:
            conn.execute("ALTER TABLE deck_orders ADD COLUMN public_id TEXT NOT NULL DEFAULT ''")
        for row in conn.execute("SELECT id FROM deck_orders WHERE public_id = ''").fetchall():
            conn.execute("UPDATE deck_orders SET public_id = ? WHERE id = ?", (secrets.token_hex(8), row[0]))
        conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_deck_orders_public_id ON deck_orders(public_id)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_deck_orders_created_at ON deck_orders(created_at)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_deck_orders_email ON deck_orders(email)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_deck_orders_status ON deck_orders(status)")
    seed_scenarios_from_file()


def seed_scenarios_from_file() -> None:
    if not SCENARIOS_SEED_PATH.is_file():
        return
    scenarios = json.loads(SCENARIOS_SEED_PATH.read_text(encoding="utf-8"))
    if not isinstance(scenarios, list):
        raise RuntimeError(f"Invalid scenarios seed: {SCENARIOS_SEED_PATH}")
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        for scenario in scenarios:
            if not isinstance(scenario, dict) or not scenario.get("id"):
                continue
            payload = json.dumps(scenario, ensure_ascii=False, sort_keys=True)
            seed_hash = sha256(payload.encode("utf-8")).hexdigest()
            conn.execute(
                """
                INSERT INTO scenarios (scenario_id, title, difficulty, payload, seed_hash, updated_at)
                VALUES (?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
                ON CONFLICT(scenario_id) DO UPDATE SET
                    title = excluded.title,
                    difficulty = excluded.difficulty,
                    payload = excluded.payload,
                    seed_hash = excluded.seed_hash,
                    updated_at = CASE
                        WHEN scenarios.seed_hash <> excluded.seed_hash
                        THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                        ELSE scenarios.updated_at
                    END
                """,
                (
                    scenario["id"],
                    scenario.get("title") or scenario["id"],
                    scenario.get("difficulty") or "",
                    payload,
                    seed_hash,
                ),
            )


def list_scenarios(random_order: bool = False, limit: int | None = None) -> list[dict]:
    sql = "SELECT payload FROM scenarios"
    if random_order:
        sql += " ORDER BY random()"
    else:
        sql += " ORDER BY scenario_id"
    params: tuple = ()
    if limit:
        sql += " LIMIT ?"
        params = (limit,)
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        rows = conn.execute(sql, params).fetchall()
    return [json.loads(row[0]) for row in rows]


def normalize_room_id(room_id: str) -> str:
    return "".join(ch for ch in (room_id or "").strip().upper() if ch.isalnum())[:32]


def list_live_rooms(limit: int = 30) -> list[dict]:
    safe_limit = min(max(limit or 30, 1), 100)
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        rows = conn.execute(
            """
            SELECT room_id, payload, updated_at
            FROM live_rooms
            WHERE deleted_at = ''
            ORDER BY updated_at DESC
            LIMIT ?
            """,
            (safe_limit,),
        ).fetchall()
    return [{"room_id": row[0], "payload": json.loads(row[1]), "updated_at": row[2]} for row in rows]


def get_live_room(room_id: str) -> dict | None:
    normalized = normalize_room_id(room_id)
    if not normalized:
        return None
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        row = conn.execute(
            """
            SELECT room_id, payload, updated_at
            FROM live_rooms
            WHERE room_id = ? AND deleted_at = ''
            """,
            (normalized,),
        ).fetchone()
    if not row:
        return None
    return {"room_id": row[0], "payload": json.loads(row[1]), "updated_at": row[2]}


def save_live_room(room_id: str, payload: dict, user: dict) -> dict:
    normalized = normalize_room_id(room_id)
    if not normalized:
        raise ValueError("Invalid room id")
    if not isinstance(payload, dict):
        raise ValueError("Invalid room payload")
    payload["room_id"] = normalized
    updated_at = payload.get("updated_at") or time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    payload["updated_at"] = updated_at
    payload_text = json.dumps(payload, ensure_ascii=False, sort_keys=True)
    owner_email = user.get("email") or ""
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO live_rooms (room_id, owner_email, payload, updated_at, deleted_at)
            VALUES (?, ?, ?, ?, '')
            ON CONFLICT(room_id) DO UPDATE SET
                owner_email = CASE
                    WHEN live_rooms.owner_email = '' THEN excluded.owner_email
                    ELSE live_rooms.owner_email
                END,
                payload = excluded.payload,
                updated_at = excluded.updated_at,
                deleted_at = ''
            """,
            (normalized, owner_email, payload_text, updated_at),
        )
    return {"room_id": normalized, "payload": payload, "updated_at": updated_at}


def delete_live_room(room_id: str) -> bool:
    normalized = normalize_room_id(room_id)
    if not normalized:
        return False
    deleted_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        cur = conn.execute(
            """
            UPDATE live_rooms
            SET deleted_at = ?, updated_at = ?
            WHERE room_id = ? AND deleted_at = ''
            """,
            (deleted_at, deleted_at, normalized),
        )
    return cur.rowcount > 0


def create_deck_order(payload: dict, request: Request) -> dict:
    if not isinstance(payload, dict):
        raise ValueError("Richiesta non valida")

    # Invisible antispam field. Humans do not see it; bots often fill every input.
    if str(payload.get("company_website") or "").strip():
        return {"ok": True, "saved": False, "message": "Richiesta ricevuta."}

    name = normalize_text(payload.get("name"), max_length=120)
    email = normalize_email(str(payload.get("email") or ""))
    location = normalize_text(payload.get("location"), max_length=180)
    note = normalize_text(payload.get("note"), max_length=1200)
    try:
        quantity = int(payload.get("quantity") or 1)
    except (TypeError, ValueError):
        raise ValueError("Quantità non valida")
    quantity = min(max(quantity, 1), 20)

    if len(name) < 2:
        raise ValueError("Nome richiesto")
    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        raise ValueError("Email non valida")
    if not location:
        raise ValueError("Località richiesta")
    if not payload.get("privacy_accepted") or not payload.get("terms_accepted"):
        raise ValueError("Privacy e condizioni devono essere accettate")

    client_ip = get_client_ip(request)
    user_agent = normalize_text(request.headers.get("user-agent", ""), max_length=500)
    order_id = secrets.token_hex(8)

    with sqlite3.connect(CONTENT_DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO deck_orders (
                public_id, name, email, location, quantity, note, status,
                client_ip, user_agent, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, 'nuovo', ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
            """,
            (order_id, name, email, location, quantity, note, client_ip, user_agent),
        )

    return {
        "ok": True,
        "saved": True,
        "order_id": order_id,
        "message": "Richiesta ricevuta. Ti ricontatteremo per disponibilità, pagamento e spedizione.",
    }


def normalize_text(value: object, max_length: int) -> str:
    return " ".join(str(value or "").strip().split())[:max_length]


def get_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded_for.split(",", 1)[0].strip()
    if not client_ip and request.client:
        client_ip = request.client.host
    return client_ip or ""


def upsert_user(google_sub: str, email: str, name: str, picture: str) -> str:
    role_override = "admin" if email in BOOTSTRAP_ADMIN_EMAILS else None
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        existing = conn.execute("SELECT role FROM users WHERE google_sub = ? OR email = ?", (google_sub, email)).fetchone()
        if existing:
            role = role_override or existing[0]
            conn.execute(
                """
                UPDATE users
                SET google_sub = ?, email = ?, name = ?, picture = ?, role = ?,
                    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
                    last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                WHERE google_sub = ? OR email = ?
                """,
                (google_sub, email, name, picture, role, google_sub, email),
            )
            return role

        conn.execute(
            """
            INSERT INTO users (google_sub, email, name, picture, role)
            VALUES (?, ?, ?, ?, ?)
            """,
            (google_sub, email, name, picture, role_override or "public"),
        )
        return role_override or "public"


VALID_ROLES = {"public", "unlocked", "admin"}


def normalize_email(email: str) -> str:
    return (email or "").strip().lower()


def normalize_role(role: str) -> str:
    value = (role or "").strip().lower()
    if value not in VALID_ROLES:
        raise ValueError("Invalid role")
    return value


def list_users() -> list[dict]:
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            """
            SELECT email, name, picture, role, created_at, updated_at, last_login_at,
                   CASE WHEN google_sub LIKE 'pending:%' THEN 1 ELSE 0 END AS pending
            FROM users
            ORDER BY
                CASE role WHEN 'admin' THEN 0 WHEN 'unlocked' THEN 1 ELSE 2 END,
                last_login_at DESC,
                email ASC
            """
        ).fetchall()
    return [dict(row) for row in rows]


def get_user_by_email(email: str) -> dict | None:
    normalized = normalize_email(email)
    if not normalized:
        return None
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            """
            SELECT email, name, picture, role, created_at, updated_at, last_login_at,
                   CASE WHEN google_sub LIKE 'pending:%' THEN 1 ELSE 0 END AS pending
            FROM users
            WHERE email = ?
            """,
            (normalized,),
        ).fetchone()
    return dict(row) if row else None


def create_pending_user(email: str, role: str) -> dict:
    normalized_email = normalize_email(email)
    if "@" not in normalized_email:
        raise ValueError("Invalid email")
    normalized_role = normalize_role(role or "public")
    google_sub = "pending:" + normalized_email
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        try:
            conn.execute(
                """
                INSERT INTO users (google_sub, email, name, picture, role)
                VALUES (?, ?, '', '', ?)
                """,
                (google_sub, normalized_email, normalized_role),
            )
        except sqlite3.IntegrityError as error:
            raise ValueError("User already exists") from error
    user = get_user_by_email(normalized_email)
    if not user:
        raise RuntimeError("User not found after create")
    return user


def seed_bootstrap_admins() -> None:
    if not BOOTSTRAP_ADMIN_EMAILS:
        return
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        for email in sorted(BOOTSTRAP_ADMIN_EMAILS):
            google_sub = "pending:" + email
            conn.execute(
                """
                INSERT INTO users (google_sub, email, name, picture, role)
                VALUES (?, ?, '', '', 'admin')
                ON CONFLICT(email) DO UPDATE SET
                    role = 'admin',
                    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                """,
                (google_sub, email),
            )


def update_user_role(email: str, role: str, current_admin_email: str) -> dict | None:
    normalized_email = normalize_email(email)
    normalized_role = normalize_role(role)
    existing = get_user_by_email(normalized_email)
    if not existing:
        return None
    if existing["role"] == "admin" and normalized_role != "admin":
        ensure_not_last_admin(normalized_email)
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.execute(
            """
            UPDATE users
            SET role = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
            WHERE email = ?
            """,
            (normalized_role, normalized_email),
        )
        if normalized_email == normalize_email(current_admin_email) and normalized_role != "admin":
            conn.execute(
                """
                DELETE FROM auth_sessions
                WHERE user_id = (SELECT id FROM users WHERE email = ?)
                """,
                (normalized_email,),
            )
    return get_user_by_email(normalized_email)


def delete_user(email: str, current_admin_email: str) -> bool:
    normalized_email = normalize_email(email)
    if not normalized_email:
        return False
    existing = get_user_by_email(normalized_email)
    if not existing:
        return False
    if existing["role"] == "admin":
        ensure_not_last_admin(normalized_email)
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.execute(
            """
            DELETE FROM auth_sessions
            WHERE user_id = (SELECT id FROM users WHERE email = ?)
            """,
            (normalized_email,),
        )
        cur = conn.execute("DELETE FROM users WHERE email = ?", (normalized_email,))
    return cur.rowcount > 0


def ensure_not_last_admin(email_to_change: str) -> None:
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        row = conn.execute(
            "SELECT COUNT(*) FROM users WHERE role = 'admin' AND email <> ?",
            (normalize_email(email_to_change),),
        ).fetchone()
    if not row or row[0] < 1:
        raise ValueError("Cannot remove the last admin")


def get_access_log_report(limit: int = 200, path: str = "", session_id: str = "", status: int | None = None) -> dict:
    safe_limit = min(max(limit or 200, 1), 1000)
    where_sql, params = build_access_log_filters(path=path, session_id=session_id, status=status)
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            f"""
            SELECT id, created_at, method, path, query_string, status_code, duration_ms,
                   client_ip, forwarded_for, user_agent, referer, session_id
            FROM access_log
            {where_sql}
            ORDER BY id DESC
            LIMIT ?
            """,
            (*params, safe_limit),
        ).fetchall()
        summary = conn.execute(
            f"""
            SELECT COUNT(*) AS total,
                   COUNT(DISTINCT session_id) AS sessions,
                   MIN(created_at) AS first_seen,
                   MAX(created_at) AS last_seen,
                   ROUND(AVG(duration_ms), 1) AS avg_duration_ms,
                   SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) AS errors
            FROM access_log
            {where_sql}
            """,
            params,
        ).fetchone()
        top_paths = conn.execute(
            f"""
            SELECT path, COUNT(*) AS hits, COUNT(DISTINCT session_id) AS sessions
            FROM access_log
            {where_sql}
            GROUP BY path
            ORDER BY hits DESC, path ASC
            LIMIT 12
            """,
            params,
        ).fetchall()
        recent_sessions = conn.execute(
            f"""
            SELECT session_id, COUNT(*) AS hits, MAX(created_at) AS last_seen
            FROM access_log
            {where_sql}
            GROUP BY session_id
            ORDER BY last_seen DESC
            LIMIT 12
            """,
            params,
        ).fetchall()
    return {
        "filters": {
            "limit": safe_limit,
            "path": path or "",
            "session_id": session_id or "",
            "status": status,
        },
        "summary": dict(summary) if summary else {},
        "top_paths": [dict(row) for row in top_paths],
        "recent_sessions": [dict(row) for row in recent_sessions],
        "logs": [dict(row) for row in rows],
    }


def build_access_log_filters(path: str = "", session_id: str = "", status: int | None = None) -> tuple[str, tuple]:
    clauses = []
    params: list = []
    path_filter = (path or "").strip()
    if path_filter:
        clauses.append("path LIKE ? ESCAPE '\\'")
        params.append("%" + escape_like(path_filter) + "%")
    session_filter = (session_id or "").strip()
    if session_filter:
        clauses.append("session_id LIKE ? ESCAPE '\\'")
        params.append("%" + escape_like(session_filter) + "%")
    if status:
        clauses.append("status_code = ?")
        params.append(status)
    if not clauses:
        return "", tuple()
    return "WHERE " + " AND ".join(clauses), tuple(params)


def escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def create_auth_session(email: str, google_sub: str) -> str:
    token = secrets.token_urlsafe(48)
    token_hash = hash_token(token)
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        user = conn.execute(
            "SELECT id FROM users WHERE google_sub = ? AND email = ?",
            (google_sub, email),
        ).fetchone()
        if not user:
            raise RuntimeError("User not found after OAuth login")
        conn.execute(
            """
            INSERT INTO auth_sessions (token_hash, user_id, expires_at)
            VALUES (?, ?, datetime('now', '+30 days'))
            """,
            (token_hash, user[0]),
        )
    return token


def delete_auth_session(token: str) -> None:
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.execute("DELETE FROM auth_sessions WHERE token_hash = ?", (hash_token(token),))


def get_current_user(request: Request) -> dict | None:
    token = request.cookies.get(SESSION_COOKIE_NAME)
    if not token:
        return None
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            """
            SELECT u.email, u.name, u.picture, u.role
            FROM auth_sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.token_hash = ?
              AND s.expires_at > datetime('now')
            """,
            (hash_token(token),),
        ).fetchone()
    if not row:
        return None
    return dict(row)


def hash_token(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def write_access_log(request: Request, status_code: int, duration_ms: int, session_id: str) -> None:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    client_ip = forwarded_for.split(",", 1)[0].strip()
    if not client_ip and request.client:
        client_ip = request.client.host

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            INSERT INTO access_log (
                method, path, query_string, status_code, duration_ms, client_ip,
                forwarded_for, user_agent, referer, session_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request.method,
                request.url.path,
                request.url.query,
                status_code,
                duration_ms,
                client_ip or "",
                forwarded_for,
                request.headers.get("user-agent", ""),
                request.headers.get("referer", ""),
                session_id,
            ),
        )


def page_response(file_path: Path, with_root_base: bool = False) -> Response:
    if not is_safe_app_path(file_path) or not file_path.is_file():
        return PlainTextResponse("Not found", status_code=404)

    if with_root_base and file_path.suffix.lower() == ".html":
        html = file_path.read_text(encoding="utf-8")
        if "<base " not in html.lower():
            html = html.replace("<head>", '<head>\n  <base href="/">', 1)
        return HTMLResponse(html)

    return FileResponse(file_path)


def static_file_response(request_path: str) -> Response | None:
    normalized = request_path.lstrip("/")
    if not normalized:
        return None
    normalized_lower = normalized.replace("\\", "/").lower()
    if normalized_lower.startswith("server/"):
        return None
    if normalized_lower == "data/scenarios.js":
        return None

    candidate = (APP_ROOT / normalized).resolve()
    if not is_safe_app_path(candidate) or not candidate.is_file():
        return None

    if candidate.name.startswith("."):
        return None

    return FileResponse(candidate)


def is_safe_app_path(path: Path) -> bool:
    try:
        path.relative_to(APP_ROOT)
    except ValueError:
        return False
    return True


app = create_app()
