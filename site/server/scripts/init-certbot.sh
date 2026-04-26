#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/.."

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
  echo "DOMAIN and CERTBOT_EMAIL must be set"
  exit 1
fi

# Phase 1: start with HTTP-only nginx
cp "$SERVER_DIR/nginx/http-only.conf" "$SERVER_DIR/nginx/conf.d/default.conf"
docker compose -f "$SERVER_DIR/docker-compose.yml" up -d nginx presentation
sleep 5

# Phase 2: get certificate
docker compose -f "$SERVER_DIR/docker-compose.yml" run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$DOMAIN" -d "www.$DOMAIN" \
  --email "$CERTBOT_EMAIL" \
  --agree-tos --no-eff-email

# Phase 3: switch to HTTPS config
DOMAIN="$DOMAIN" envsubst '${DOMAIN}' \
  < "$SERVER_DIR/nginx/https.conf.template" \
  > "$SERVER_DIR/nginx/conf.d/default.conf"
docker compose -f "$SERVER_DIR/docker-compose.yml" restart nginx

echo "HTTPS is active at https://$DOMAIN"
