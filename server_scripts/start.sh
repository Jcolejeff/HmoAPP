#!/bin/bash
cd /var/www/timbu/staging/travel.app
# pnpm start -- -p 3000

PORT=3200 /usr/local/bin/node build/standalone/server.js >> output.log 2>&1

