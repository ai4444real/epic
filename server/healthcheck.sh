#!/usr/bin/env bash
set -euo pipefail

LOCAL_HEALTH_URL="${LOCAL_HEALTH_URL:-http://127.0.0.1:8080/health}"
PUBLIC_HEALTH_URL="${PUBLIC_HEALTH_URL:-}"

echo "Checking local health: $LOCAL_HEALTH_URL"
curl -fsS "$LOCAL_HEALTH_URL"
echo

if [ -n "$PUBLIC_HEALTH_URL" ]; then
  echo "Checking public health: $PUBLIC_HEALTH_URL"
  curl -fsS "$PUBLIC_HEALTH_URL"
  echo
fi
