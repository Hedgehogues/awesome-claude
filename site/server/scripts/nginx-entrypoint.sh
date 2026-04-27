#!/bin/sh
set -e

CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
CONF="/etc/nginx/conf.d/default.conf"
HTTPS_TMPL="/etc/nginx/templates/https.conf.template"
HTTP_TMPL="/etc/nginx/templates/http-only.conf"

if [ -f "$CERT" ]; then
    DOMAIN="$DOMAIN" SERVER_IP="$SERVER_IP" envsubst '${DOMAIN} ${SERVER_IP}' < "$HTTPS_TMPL" > "$CONF"
else
    cp "$HTTP_TMPL" "$CONF"
fi

nginx -g 'daemon off;' &
NGINX_PID=$!

while kill -0 $NGINX_PID 2>/dev/null; do
    sleep 60
    if [ -f "$CERT" ] && ! grep -q "ssl_certificate" "$CONF" 2>/dev/null; then
        DOMAIN="$DOMAIN" SERVER_IP="$SERVER_IP" envsubst '${DOMAIN} ${SERVER_IP}' < "$HTTPS_TMPL" > "$CONF"
        nginx -s reload
        echo "nginx reloaded with HTTPS config"
    fi
done
