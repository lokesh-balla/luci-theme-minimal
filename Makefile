include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-minimal
PKG_VERSION:=1.0.0
PKG_RELEASE:=1

PKG_LICENSE:=MIT
PKG_MAINTAINER:=Lokesh Balla <22737334+lokesh-balla@users.noreply.github.com>

include $(INCLUDE_DIR)/package.mk

define Package/luci-theme-minimal
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=Themes
  TITLE:=Minimal LuCI theme
  DEPENDS:=+luci-base
  PKGARCH:=all
endef

define Package/luci-theme-minimal/description
  A minimal theme for the LuCI web interface.
endef

define Build/Compile
endef

define Package/luci-theme-minimal/install
	$(INSTALL_DIR) $(1)/www
	$(CP) ./htdocs/* $(1)/www/

	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(CP) ./root/etc/uci-defaults/* $(1)/etc/uci-defaults/

	$(INSTALL_DIR) $(1)/usr/share/ucode
	$(CP) ./ucode/* $(1)/usr/share/ucode/
endef

define Package/luci-theme-minimal/postinst
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	[ -f /etc/uci-defaults/30_luci-theme-minimal ] && ( . /etc/uci-defaults/30_luci-theme-minimal ) && rm -f /etc/uci-defaults/30_luci-theme-minimal
	exit 0
}
endef

define Package/luci-theme-minimal/postrm
#!/bin/sh
[ -n "$${IPKG_INSTROOT}" ] || {
	uci -q delete luci.themes.Minimal
	[ "$$(uci -q get luci.main.mediaurlbase)" = "/luci-static/minimal" ] && {
		uci -q set luci.main.mediaurlbase=/luci-static/bootstrap
	}
	uci commit luci
	exit 0
}
endef

$(eval $(call BuildPackage,luci-theme-minimal))
