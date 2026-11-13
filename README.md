# luci-theme-minimal

A clean theme for OpenWrt LuCI: slate neutrals with a vivid blue accent on the things
you interact with (active navigation, tabs, progress, primary actions, focus), and
emerald / amber / red status colours only where something needs attention. Sidebar
navigation, card sections, pill/underline tabs, and automatic + manual dark mode.

Type and spacing follow a small set of rules: system font, size-specific tracking
(tight on headings, slightly open on small text), a 20px body line box on a 4px grid,
tabular numerals in tables and indicators, a 65ch measure on descriptions, and motion
that is explicit, ease-out and under 200ms (buttons scale to 97% on press).

### Installing on the Router

- **OpenWrt 25+ (`.apk`):**
  ```sh
  apk add --allow-untrusted luci-theme-minimal-*.apk
  ```

- **OpenWrt 23.05 (`.ipk`):**
  ```sh
  opkg install luci-theme-minimal_*.ipk
  ```
