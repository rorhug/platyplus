#!/bin/sh
set -euo pipefail

mv /opt/app/package*.json* /opt/
cd /opt
npm config set '@bit:registry' https://node.bit.dev
npm install --no-optional . @godaddy/terminus
npm cache clean --force
chown -R node .
