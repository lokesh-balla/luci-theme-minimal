#
# luci-theme-minimal
#
# This is free software, licensed under the Apache License, Version 2.0.
#

include $(TOPDIR)/rules.mk

LUCI_TITLE:=Minimal Theme
LUCI_DEPENDS:=+luci-base
PKG_VERSION:=1.0.0
PKG_RELEASE:=1
PKG_LICENSE:=Apache-2.0

define Package/luci-theme-minimal/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Minimal
	[ "$$(uci -q get luci.main.mediaurlbase)" = "/luci-static/minimal" ] && \
		uci set luci.main.mediaurlbase=/luci-static/bootstrap
	uci commit luci
}
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
