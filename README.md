# luci-theme-minimal

A quiet, shadcn-inspired theme for OpenWrt LuCI: neutral zinc palette, left sidebar
navigation, card sections, pill/underline tabs, and automatic + manual dark mode.

Targets the ucode-based LuCI (OpenWrt 23.05 and newer). Only templates, one stylesheet
and a small menu script — no web fonts or external assets, so it works offline.

## Layout

```
htdocs/luci-static/minimal/cascade.css          all styles (light + dark tokens)
htdocs/luci-static/minimal/logo.svg             brand mark / favicon
htdocs/luci-static/resources/menu-minimal.js    sidebar, breadcrumbs, page tabs, toggles
ucode/template/themes/minimal/header.ut         app shell (sidebar + top bar)
ucode/template/themes/minimal/footer.ut
ucode/template/themes/minimal/sysauth.ut        login page
root/etc/uci-defaults/30_luci-theme-minimal     registers + activates the theme
```

## Build

Put this directory in your OpenWrt buildroot as `package/luci-theme-minimal`
(the directory name matters; `luci.mk` derives the package name from it), then:

```sh
./scripts/feeds update luci && ./scripts/feeds install -a
make menuconfig   # LuCI -> Themes -> luci-theme-minimal
make package/luci-theme-minimal/compile
```

## Try it on a running router (no build)

```sh
scp -r htdocs/luci-static/minimal root@192.168.1.1:/www/luci-static/
scp htdocs/luci-static/resources/menu-minimal.js root@192.168.1.1:/www/luci-static/resources/
scp -r ucode/template/themes/minimal root@192.168.1.1:/usr/share/ucode/luci/template/themes/
ssh root@192.168.1.1 'uci set luci.themes.Minimal=/luci-static/minimal; \
  uci set luci.main.mediaurlbase=/luci-static/minimal; uci commit luci'
```

You can switch back under System → System → Language and Style.

## Dark mode

Follows the OS preference by default. The sun/moon button in the top bar overrides it,
and the choice is stored per browser in `localStorage` (`luci-minimal-theme`).
