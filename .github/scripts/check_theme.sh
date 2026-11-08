#!/bin/sh
set -eu

cd "$(dirname "$0")/../.."

# 1. Validate JavaScript syntax
if [ -d "htdocs/luci-static/resources" ]; then
	if command -v node >/dev/null 2>&1; then
		find htdocs/luci-static/resources -type f -name '*.js' -print |
			while IFS= read -r script; do node --check "$script"; done
	else
		echo "Notice: node not found, skipping JS syntax check."
	fi
fi

# 2. Validate Shell scripts in uci-defaults
for script in root/etc/uci-defaults/*; do
	[ -f "$script" ] || continue
	sh -n "$script"
done

# 3. Validate Makefile LuCI ucode destination
if ! grep -q '\$(INSTALL_DIR)[[:space:]]\+\$(1)/usr/share/ucode/luci' Makefile; then
	echo "Error: Makefile must install ucode files to \$(1)/usr/share/ucode/luci" >&2
	exit 1
fi

# 4. Validate template files exist
for tpl in header.ut footer.ut sysauth.ut; do
	if [ ! -f "ucode/template/themes/minimal/$tpl" ]; then
		echo "Error: Missing expected template: ucode/template/themes/minimal/$tpl" >&2
		exit 1
	fi
done

echo "Theme sanity checks passed successfully!"
