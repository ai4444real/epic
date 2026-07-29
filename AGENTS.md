# EPiC repository context

This file is the stable starting context for Codex sessions working in this
repository. Keep it concise and update it when the architecture or deployment
workflow changes.

## Purpose

EPiC is Simone Genini's web application and set of coaching tools. The
repository contains the public site, authenticated tools, card data and
renderers, simulations, Live Table, administration pages, and the FastAPI
runtime that serves them.

Start with `docs/README.md` and follow only the documents relevant to the task.
Useful operational references:

- `docs/VPS_INFOMANIAK_ACCESS.md`: VPS, services, production and deployment;
- `docs/AUTH_ACCESS.md`: Google OAuth, access rules and runtime databases;
- `docs/SCENARIOS_LOCAL_DB.md`: scenario persistence;
- `docs/LIVE_TABLE_LOCAL_DB.md`: Live Table persistence;
- `docs/CARD_UPDATE_PROCEDURE.md`: card update workflow;
- `server/README.md`: FastAPI runtime and primary routes.

## Fixed environments

- Development repository and Codex working directory:
  `/home/ubuntu/src/epic`
- Production checkout:
  `/opt/epic/app`
- Public site:
  `https://simonegenini.com`
- Production service:
  `epic-web`
- Production FastAPI listener:
  `127.0.0.1:8080`

Always edit and validate the development repository. Never edit files directly
inside `/opt/epic/app`.

## Runtime architecture

- `server/main.py` is the FastAPI application.
- Caddy terminates public HTTPS and proxies to FastAPI.
- Static HTML, CSS, JavaScript, images and card assets live in the repository.
- Runtime data uses separate SQLite databases under `/opt/epic/app/var/`:
  `access_log.sqlite3`, `auth.sqlite3`, and `content.sqlite3`.
- Private production configuration is `/opt/epic/app/.env`; never print,
  copy, or commit its secrets.
- Authentication is handled by FastAPI with Google OAuth. Supabase is not the
  runtime authentication or persistence layer.

Important routes include:

- `/` and `/epic`: public entry pages;
- `/epic/simulator`, `/epic/explorer`, `/epic/cards`: public demos;
- `/epic/cross`, `/epic/live-table` and `/epic/*/full`: protected tools;
- `/login`, `/auth/google/start`, `/auth/google/callback`, `/logout`, `/me`;
- `/health`: production health check.

Read the current route tables in `server/main.py` before assuming that an HTML
filename is also the canonical public URL.

## Working rules

1. Inspect `git status --short --branch` before and after changes.
2. Preserve unrelated or pre-existing modifications.
3. Make the smallest change that satisfies the request.
4. Search existing styles, components and patterns before adding new ones.
5. Do not expose secrets, private keys, OAuth values, cookies, or database
   contents.
6. Do not change production, commit, push, or deploy unless the user asks
   explicitly.
7. For a requested commit, review the diff and commit only task-related files.
8. For a requested push, push the development branch to GitHub and verify that
   it matches its upstream.

## Validation and deployment

Choose checks proportional to the change. At minimum inspect the diff and run
relevant syntax or application checks. For server changes, verify imports and
the `/health` behavior when practical. Do not claim browser behavior was tested
unless it was actually tested.

The release flow is:

```text
edit in /home/ubuntu/src/epic
-> inspect and validate
-> commit
-> push GitHub
-> explicit deploy
-> production pulls main
```

Deployment is never an automatic consequence of a normal request. In the
private EPiC Agent chat it requires `/deploy` followed by `/deploy confirm`.
The production script is `/opt/epic/app/server/deploy.sh`; it pulls `main`,
updates dependencies, restarts `epic-web`, and performs health checks.
