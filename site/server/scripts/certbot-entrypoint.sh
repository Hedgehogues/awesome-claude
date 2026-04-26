#!/bin/sh
set -e

CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

if [ ! -f "$CERT" ]; then
    echo "No cert found, waiting for nginx on port 80..."
    python3 -c "
import socket, time, sys
for i in range(30):
    try:
        s = socket.create_connection(('nginx', 80), timeout=2)
        s.close()
        sys.exit(0)
    except Exception:
        time.sleep(2)
sys.exit(1)
"
    echo "Requesting certificate for ${DOMAIN}..."
    certbot certonly \
        --webroot -w /var/www/certbot \
        -d "${DOMAIN}" -d "www.${DOMAIN}" \
        --email "${CERTBOT_EMAIL}" \
        --agree-tos --no-eff-email --non-interactive
    echo "Certificate obtained!"
fi

trap exit TERM
while :; do
    certbot renew --quiet
    sleep 12h & wait ${!}
done
