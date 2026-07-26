#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/epic/app}"
VENV_DIR="${VENV_DIR:-$APP_DIR/.venv}"
SERVICE_NAME="${SERVICE_NAME:-epic-web}"
LOCAL_HEALTH_URL="${LOCAL_HEALTH_URL:-http://127.0.0.1:8080/health}"
PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-}"

cd "$APP_DIR"

git pull --ff-only origin main

if [ ! -d "$VENV_DIR" ]; then
  python3 -m venv "$VENV_DIR"
fi

"$VENV_DIR/bin/pip" install --upgrade pip
"$VENV_DIR/bin/pip" install -r server/requirements.txt

sudo systemctl restart "$SERVICE_NAME"

echo "Waiting for local health check: $LOCAL_HEALTH_URL"
for attempt in $(seq 1 20); do
  if curl -fsS "$LOCAL_HEALTH_URL" >/dev/null; then
    echo "Local health check OK"
    break
  fi

  if [ "$attempt" -eq 20 ]; then
    echo "Local health check failed"
    sudo systemctl status "$SERVICE_NAME" --no-pager || true
    journalctl -u "$SERVICE_NAME" -n 80 --no-pager || true
    exit 1
  fi

  sleep 1
done

if [ -n "$PUBLIC_HEALTH_URL" ]; then
  echo "Checking public health: $PUBLIC_HEALTH_URL"
  curl -fsS "$PUBLIC_HEALTH_URL" >/dev/null
fi

sudo systemctl --no-pager --full status "$SERVICE_NAME"
