FROM ghcr.io/openwrt/rootfs:aarch64_generic-openwrt-25.12

# Ensure runtime directories exist
RUN mkdir -p /var/lock /var/run

# OpenWrt 25.12 uses 'apk' instead of 'opkg'
RUN apk update && \
    apk add --no-cache luci luci-compat && \
    rm -rf /var/cache/apk/*

EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]