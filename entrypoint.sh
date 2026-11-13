#!/bin/sh

link_theme() {
    THEME_DIR="$1"
    [ ! -d "$THEME_DIR" ] && return

    echo "Scanning theme directory: $THEME_DIR"

    # 1. If the repo puts everything inside root/www or root/usr (Overlay style)
    if [ -d "$THEME_DIR/root/www/luci-static" ]; then
        for d in "$THEME_DIR/root/www/luci-static/"*; do
            [ -d "$d" ] && [ "$(basename "$d")" != "resources" ] && \
                ln -sfn "$d" "/www/luci-static/$(basename "$d")"
        done
    fi
    if [ -d "$THEME_DIR/root/usr/share/ucode/luci/template/themes" ]; then
        mkdir -p /usr/share/ucode/luci/template/themes
        for d in "$THEME_DIR/root/usr/share/ucode/luci/template/themes/"*; do
            [ -d "$d" ] && ln -sfn "$d" "/usr/share/ucode/luci/template/themes/$(basename "$d")"
        done
    fi

    # 2. Standard luci.mk structure: htdocs/luci-static/*
    if [ -d "$THEME_DIR/htdocs/luci-static" ]; then
        for item in "$THEME_DIR/htdocs/luci-static/"*; do
            name="$(basename "$item")"
            if [ "$name" = "resources" ] && [ -d "$item" ]; then
                for res in "$item/"*; do
                    [ -e "$res" ] && ln -sfn "$res" "/www/luci-static/resources/$(basename "$res")"
                done
            elif [ -d "$item" ]; then
                ln -sfn "$item" "/www/luci-static/$name"
                # Auto-register in UCI so it shows up in System -> Language & Style
                uci set "luci.themes.${name}=/luci-static/${name}"
            fi
        done
    fi

    # 3. Standard ucode templates: ucode/template/themes/*
    if [ -d "$THEME_DIR/ucode/template/themes" ]; then
        mkdir -p /usr/share/ucode/luci/template/themes
        for d in "$THEME_DIR/ucode/template/themes/"*; do
            [ -d "$d" ] && ln -sfn "$d" "/usr/share/ucode/luci/template/themes/$(basename "$d")"
        done
    fi

    # 4. Standard Legacy Lua templates: luasrc/view/themes/*
    if [ -d "$THEME_DIR/luasrc/view/themes" ]; then
        mkdir -p /usr/lib/lua/luci/view/themes
        for d in "$THEME_DIR/luasrc/view/themes/"*; do
            [ -d "$d" ] && ln -sfn "$d" "/usr/lib/lua/luci/view/themes/$(basename "$d")"
        done
    fi

    # 5. Execute uci-defaults registration scripts if present
    if [ -d "$THEME_DIR/root/etc/uci-defaults" ]; then
        for script in "$THEME_DIR/root/etc/uci-defaults/"*; do
            [ -f "$script" ] && sh "$script" 2>/dev/null
        done
    fi
}

# Seed dummy router data so LuCI pages have something to render
seed_testdata() {
    SRC=/opt/luci-testdata
    MARK=/etc/.luci-testdata-seeded
    [ "${SEED_TESTDATA:-1}" = "1" ] && [ -d "$SRC" ] || return 0

    # Fake switch ports for the LAN bridge plus guest/IoT segments (needs NET_ADMIN)
    for l in lan1 lan2 lan3 lan4 guest0 iot0; do
        ip link show "$l" >/dev/null 2>&1 || ip link add "$l" type dummy 2>/dev/null
    done

    # UCI config: copy once so edits made in LuCI survive container restarts
    if [ ! -f "$MARK" ]; then
        echo "Seeding test config from $SRC/config"
        cp "$SRC"/config/* /etc/config/

        # Keep WAN on the container's real address so port mapping keeps working
        cidr="$(ip -4 -o addr show eth0 | awk '{print $4}' | head -n1)"
        gw="$(ip -4 route show default | awk '{print $3}' | head -n1)"
        eval "$(/bin/ipcalc.sh "$cidr")"
        sed -i -e "s#__WAN_IP__#${cidr%/*}#" -e "s#__WAN_MASK__#${NETMASK}#" -e "s#__WAN_GW__#${gw}#" /etc/config/network
        touch "$MARK"
    fi

    # DHCP leases live in /tmp, so rebuild them every start with fresh expiry times
    now="$(date +%s)"
    grep -v '^#' "$SRC/dhcp.leases" | awk -v now="$now" 'NF { $1 = ($1 == 0 ? 0 : now + $1); print }' > /tmp/dhcp.leases
}

# Replay sample log lines once logd is running
seed_syslog() {
    [ "${SEED_TESTDATA:-1}" = "1" ] && [ -f /opt/luci-testdata/syslog.txt ] || return 0
    while IFS='|' read -r prio tag msg; do
        [ -n "$prio" ] && logger -p "$prio" -t "$tag" "$msg"
    done < /opt/luci-testdata/syslog.txt
}

# Scan all mounted theme folders under /themes
for dir in /themes/*; do
    [ -d "$dir" ] && link_theme "$dir"
done

# Activate the requested theme if ACTIVE_THEME is set
if [ -n "$ACTIVE_THEME" ] && [ -d "/www/luci-static/$ACTIVE_THEME" ]; then
    uci set "luci.themes.${ACTIVE_THEME}=/luci-static/${ACTIVE_THEME}"
    uci set "luci.main.mediaurlbase=/luci-static/${ACTIVE_THEME}"
fi
uci commit luci

# Disable HTTPS redirect for local development
uci set uhttpd.main.redirect_https='0'
uci commit uhttpd

seed_testdata

# Clear LuCI template/module caches and start services
rm -rf /tmp/luci-indexcache* /tmp/luci-modulecache*

/sbin/procd &
sleep 1
/sbin/ubusd &
sleep 1
/sbin/logd -S 64 &
/sbin/netifd &
sleep 1
seed_syslog
/sbin/rpcd -s /var/run/ubus/ubus.sock &
/etc/init.d/uhttpd start

echo "LuCI is live at http://localhost:8080 (Active theme: ${ACTIVE_THEME:-default})"
tail -f /dev/null