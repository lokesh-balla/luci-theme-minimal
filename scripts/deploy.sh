#!/usr/bin/env bash
set -e

ROUTER="${1:-root@wr3000s}"

echo "==> Deploying luci-theme-minimal to $ROUTER..."
scp -r htdocs/luci-static/minimal "$ROUTER":/www/luci-static/
scp htdocs/luci-static/resources/menu-minimal.js "$ROUTER":/www/luci-static/resources/
scp -r ucode/template/themes/minimal "$ROUTER":/usr/share/ucode/luci/template/themes/

echo "==> Activating theme..."
ssh "$ROUTER" 'uci set luci.themes.Minimal=/luci-static/minimal && \
  uci set luci.main.mediaurlbase=/luci-static/minimal && \
  uci commit luci'

echo "==> Done! Refresh LuCI in your browser."
