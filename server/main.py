from __future__ import annotations

import os
import sqlite3
import time
import uuid
from pathlib import Path
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from starlette.middleware.base import BaseHTTPMiddleware


APP_ROOT = Path(__file__).resolve().parents[1]
SERVER_ROOT = Path(__file__).resolve().parent
DEFAULT_DB_PATH = SERVER_ROOT / "var" / "access_log.sqlite3"
DB_PATH = Path(os.getenv("EPIC_ACCESS_DB", str(DEFAULT_DB_PATH))).resolve()
SERVICE_NAME = os.getenv("EPIC_SERVICE_NAME", "epic-web")

PAGE_ALIASES = {
    "/": APP_ROOT / "index.html",
    "/epic": APP_ROOT / "epic.html",
    "/epic/simulator": APP_ROOT / "epic-simulator-free.html",
    "/epic/explorer": APP_ROOT / "epic-explorer-free.html",
    "/epic/cards": APP_ROOT / "epic-all-cards-free.html",
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


def create_app() -> FastAPI:
    app = FastAPI(title="EPiC Web", docs_url=None, redoc_url=None)
    init_access_db()
    app.add_middleware(AccessLogMiddleware)

    @app.get("/health")
    async def health() -> JSONResponse:
        return JSONResponse({"status": "healthy", "service": SERVICE_NAME})

    @app.get("/{path:path}")
    async def serve(path: str) -> Response:
        request_path = "/" + path
        if request_path in PAGE_ALIASES:
            return page_response(PAGE_ALIASES[request_path])

        static_response = static_file_response(request_path)
        if static_response:
            return static_response

        return PlainTextResponse("Not found", status_code=404)

    return app

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
