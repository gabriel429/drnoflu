#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/drnoflu"
BRANCH="main"
APP_NAME="drnoflu"
REQUIRED_ENV_VARS=(
	"NEXT_PUBLIC_SUPABASE_URL"
	"NEXT_PUBLIC_SUPABASE_ANON_KEY"
	"NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
	"NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"
	"NEXT_PUBLIC_SITE_URL"
	"NEXT_PUBLIC_MAPBOX_TOKEN"
)

cd "$APP_DIR"

if [ ! -f ".env" ]; then
	echo "ERROR: Missing .env file in $APP_DIR"
	echo "Create it from .env.example before deploying."
	exit 1
fi

# Export variables from .env so script can validate required values.
set -a
. ./.env
set +a

for var_name in "${REQUIRED_ENV_VARS[@]}"; do
	if [ -z "${!var_name:-}" ]; then
		echo "ERROR: Required environment variable is missing: $var_name"
		exit 1
	fi
done

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
