#!/bin/sh
# Run once on a new server to get the initial certificate.
# Requires DOMAIN and CERTBOT_EMAIL env vars (from .env file).

set -e

if [ -z "$DOMAIN" ] || [ -z "$CERTBOT_EMAIL" ]; then
  echo "DOMAIN and CERTBOT_EMAIL must be set"
  exit 1
fi

docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --no-eff-email

docker compose restart nginx
