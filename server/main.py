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
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse, RedirectResponse
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

PAGE_ALIASES = {
    "/": APP_ROOT / "index.html",
    "/epic": APP_ROOT / "epic.html",
    "/epic/simulator": APP_ROOT / "epic-simulator-free.html",
    "/epic/explorer": APP_ROOT / "epic-explorer-free.html",
    "/epic/cards": APP_ROOT / "epic-all-cards-free.html",
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

    @app.get("/{path:path}")
    async def serve(path: str, request: Request) -> Response:
        request_path = "/" + path
        if request_path in PROTECTED_ALIASES:
            user = get_current_user(request)
            if not user:
                return redirect_to_login(request_path)
            if not can_access_protected(user):
                return PlainTextResponse("Accesso non autorizzato.", status_code=403)
            return page_response(PROTECTED_ALIASES[request_path])

        if request_path in PAGE_ALIASES:
            return page_response(PAGE_ALIASES[request_path])

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


def upsert_user(google_sub: str, email: str, name: str, picture: str) -> str:
    with sqlite3.connect(AUTH_DB_PATH) as conn:
        existing = conn.execute("SELECT role FROM users WHERE google_sub = ? OR email = ?", (google_sub, email)).fetchone()
        if existing:
            role = existing[0]
            conn.execute(
                """
                UPDATE users
                SET google_sub = ?, email = ?, name = ?, picture = ?,
                    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
                    last_login_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
                WHERE google_sub = ? OR email = ?
                """,
                (google_sub, email, name, picture, google_sub, email),
            )
            return role

        conn.execute(
            """
            INSERT INTO users (google_sub, email, name, picture, role)
            VALUES (?, ?, ?, ?, 'public')
            """,
            (google_sub, email, name, picture),
        )
        return "public"


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


def page_response(file_path: Path) -> Response:
    if not is_safe_app_path(file_path) or not file_path.is_file():
        return PlainTextResponse("Not found", status_code=404)

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
