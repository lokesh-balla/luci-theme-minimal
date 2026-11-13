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

### Local development

```sh
docker compose up -d --build
```

LuCI runs at http://localhost:8080 (user `root`, no password) with the theme mounted
live from this repo. Edit CSS or templates and reload the page.

The image ships about twenty popular LuCI apps, including firewall, DDNS, UPnP, SQM,
adblock, banIP, statistics, WireGuard, OpenVPN, PBR, mwan3, ACME and Samba. On first start
the container seeds `testdata/` so pages have realistic content:

- **Network:** LAN bridge on four fake ports, plus guest, IoT and WireGuard interfaces with two peers.
- **Wireless:** two radios with main, guest and hidden IoT SSIDs. They show as not present because there is no hardware.
- **DHCP:** static hosts and fourteen active leases across LAN, guest and IoT.
- **Firewall:** zones, port forwards and traffic rules, including scheduled and disabled ones.
- **System log:** sample entries from dnsmasq, hostapd, dropbear and others.

Config is seeded once, so changes made in LuCI survive restarts. Run
`docker compose up -d --force-recreate` to reset, or set `SEED_TESTDATA=0` in
`docker-compose.yml` to boot with an empty config.
