#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/drnoflu"
BRANCH="main"
APP_NAME="drnoflu"

cd "$APP_DIR"

echo "[1/5] Fetch latest code"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "[2/5] Install dependencies"
npm ci

echo "[3/5] Build app"
npm run build

echo "[4/5] Restart PM2 app"
pm2 start ecosystem.config.cjs --only "$APP_NAME" --update-env || pm2 restart "$APP_NAME" --update-env

echo "[5/5] Save PM2 process list"
pm2 save

echo "Deployment complete."
