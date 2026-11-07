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

## Try it on a running router (Instant — No build needed)

Since themes are purely templates and static web files, you don't even need to build or install a package to test:

```sh
# Run the deployment script (replace wr3000s with your router IP if needed)
./scripts/deploy.sh root@wr3000s
```

Or manually:

```sh
scp -r htdocs/luci-static/minimal root@wr3000s:/www/luci-static/
scp htdocs/luci-static/resources/menu-minimal.js root@wr3000s:/www/luci-static/resources/
scp -r ucode/template/themes/minimal root@wr3000s:/usr/share/ucode/luci/template/themes/
ssh root@wr3000s 'uci set luci.themes.Minimal=/luci-static/minimal; \
  uci set luci.main.mediaurlbase=/luci-static/minimal; uci commit luci'
```

You can switch back under System → System → Language and Style.

## Build Packages via GitHub Actions

This repository includes a GitHub Actions workflow (`.github/workflows/package.yml`) using the official `openwrt/gh-action-sdk`:

- **OpenWrt 25+**: Compiles using official `apk mkpkg` into a valid `.apk` package.
- **OpenWrt 23.05 / 24.10**: Compiles using `opkg-build` into a valid `.ipk` package.

Once built, artifacts are available for download under the repository's GitHub Actions tab, or published as releases on git tags (`v*`).

### Installing on the Router

- **OpenWrt 25+ (`.apk`):**
  ```sh
  apk add --allow-untrusted luci-theme-minimal-*.apk
  ```

- **OpenWrt 23.05 (`.ipk`):**
  ```sh
  opkg install luci-theme-minimal_*.ipk
  ```

You can switch back under System → System → Language and Style.

## Dark mode

Follows the OS preference by default. The sun/moon button in the top bar overrides it,
and the choice is stored per browser in `localStorage` (`luci-minimal-theme`).
