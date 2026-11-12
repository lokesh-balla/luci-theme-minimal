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

# Clear LuCI template/module caches and start services
rm -rf /tmp/luci-indexcache* /tmp/luci-modulecache*

/sbin/procd &
sleep 1
/sbin/ubusd &
sleep 1
/sbin/rpcd -s /var/run/ubus/ubus.sock &
/etc/init.d/uhttpd start

echo "LuCI is live at http://localhost:8080 (Active theme: ${ACTIVE_THEME:-default})"
tail -f /dev/null