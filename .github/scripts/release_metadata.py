#!/usr/bin/env python3
"""Translate release tags into GitHub and OpenWrt package versions."""

import argparse
import re


def resolve(tag):
    match = re.fullmatch(
        r"v?([0-9]+(?:\.[0-9]+){1,3})(?:-(alpha|beta|rc)\.([1-9][0-9]*))?", tag
    )
    if not match:
        # Fallback for branches or arbitrary non-semver tags
        version = tag.removeprefix("v")
        return {
            "tag": tag,
            "version": version,
            "prerelease": "false",
            "package_release": "1",
            "apk_version": version,
            "ipk_version": version,
        }

    base, stage, number = match.groups()
    version = tag.removeprefix("v")
    revision = 1
    apk_version = f"{base}_{stage}{number}" if stage else base
    # A tilde sorts before the final version in opkg.
    ipk_version = f"{base}~{stage}{number}-{revision}" if stage else base

    return {
        "tag": tag,
        "version": version,
        "prerelease": "true" if stage else "false",
        "package_release": str(revision),
        "apk_version": apk_version,
        "ipk_version": ipk_version,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tag")
    parser.add_argument("--field", choices=resolve("v1.0.0").keys())
    args = parser.parse_args()
    try:
        metadata = resolve(args.tag)
    except ValueError as error:
        parser.error(str(error))
    if args.field:
        print(metadata[args.field])
    else:
        for key, value in metadata.items():
            print(f"{key}={value}")
