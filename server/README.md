# EPiC Python server

Small FastAPI server for the EPiC website and tools.

It serves the existing static pages in `app/`, exposes clean public routes, and logs page accesses to SQLite.

## Routes

- `/` -> `index.html`
- `/epic` -> `epic.html`
- `/epic/simulator` -> `epic-simulator-free.html`
- `/epic/explorer` -> `epic-explorer-free.html`
- `/epic/cards` -> `epic-all-cards-free.html`
- `/health` -> JSON health check

Direct `.html` URLs still work for compatibility while the static Cloudflare setup is being replaced.

## Local run

From `app/`:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install --upgrade pip
.\.venv\Scripts\python -m pip install -r server\requirements.txt
.\.venv\Scripts\python -m uvicorn server.main:app --host 127.0.0.1 --port 8080 --reload
```

Then open:

```text
http://127.0.0.1:8080/
http://127.0.0.1:8080/epic
http://127.0.0.1:8080/health
```

## Access logging

The server logs page requests, not static assets, to SQLite.

Default local database:

```text
server/var/access_log.sqlite3
```

Production database path is configured in `server/infra/epic.service.example`:

```text
/opt/epic/app/var/access_log.sqlite3
```

Logged fields include timestamp, path, status code, duration, IP from `X-Forwarded-For`, user agent, referer, and an anonymous `epic_session` cookie.

`server/var/` is ignored by Git.

## Production shape

Target server layout:

```text
/opt/epic/app
```

Runtime:

- Caddy terminates HTTP/HTTPS and proxies to `127.0.0.1:8080`.
- systemd runs `uvicorn server.main:app`.
- `deploy.sh` pulls `main`, installs requirements, restarts the service, and runs health checks.

Reference files:

- `server/infra/epic.service.example`
- `server/infra/Caddyfile.example`
- `server/deploy.sh`
- `server/healthcheck.sh`
