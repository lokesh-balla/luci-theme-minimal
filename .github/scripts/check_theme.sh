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

echo "Theme sanity checks passed successfully!"
