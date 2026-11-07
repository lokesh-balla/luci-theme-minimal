#
# luci-theme-minimal
#
# This is free software, licensed under the Apache License, Version 2.0.
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Minimal Theme
LUCI_DEPENDS:=+luci-base
LUCI_PKGARCH:=all

PKG_NAME:=luci-theme-minimal
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0

define Package/luci-theme-minimal/postinst
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	[ -f /etc/uci-defaults/30_luci-theme-minimal ] && /bin/sh /etc/uci-defaults/30_luci-theme-minimal && rm -f /etc/uci-defaults/30_luci-theme-minimal
}
exit 0
endef

define Package/luci-theme-minimal/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Minimal
	[ "$$(uci -q get luci.main.mediaurlbase)" = "/luci-static/minimal" ] && \
		uci set luci.main.mediaurlbase=/luci-static/bootstrap
	uci commit luci
}
endef

# Include LuCI build rules (supports both feed and direct buildroot tree)
ifneq ($(wildcard $(TOPDIR)/feeds/luci/luci.mk),)
  include $(TOPDIR)/feeds/luci/luci.mk
else
  include ../../luci.mk
endif

# call BuildPackage - OpenWrt buildroot signature
