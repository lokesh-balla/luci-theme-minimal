FROM ghcr.io/openwrt/rootfs:aarch64_generic-openwrt-25.12

# Ensure runtime directories exist
RUN mkdir -p /var/lock /var/run

# OpenWrt 25.12 uses 'apk' instead of 'opkg'.
# Besides LuCI itself, pull in popular apps so the theme can be tested against
# a realistic menu and a wide range of page layouts.
RUN apk update && \
    apk add --no-cache \
        luci luci-compat \
        luci-app-firewall luci-app-package-manager luci-app-attendedsysupgrade \
        luci-app-ddns luci-app-upnp luci-app-sqm luci-app-adblock luci-app-banip \
        luci-app-statistics luci-app-nlbwmon luci-app-vnstat2 \
        luci-proto-wireguard luci-app-openvpn luci-app-pbr luci-app-mwan3 \
        luci-app-https-dns-proxy luci-app-acme luci-app-samba4 \
        luci-app-ttyd luci-app-wol luci-app-watchcat luci-app-commands luci-app-acl && \
    rm -rf /var/cache/apk/*

EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
