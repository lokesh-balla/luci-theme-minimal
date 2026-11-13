#!/usr/bin/env python3
"""Translate release tags into GitHub and OpenWrt package versions."""

import argparse
import re


def resolve(tag):
    match = re.fullmatch(
        r"v?([0-9]+(?:\.[0-9]+){1,3})(?:-(alpha|beta|rc)\.([1-9][0-9]*))?", tag
    )
    if not match:
        raise ValueError(
            f"invalid version {tag!r}: use vMAJOR.MINOR.PATCH, optionally "
            "followed by -alpha.N, -beta.N or -rc.N (e.g. v1.2.0, v1.2.0-rc.1)"
        )

    base, stage, number = match.groups()
    if not tag.startswith("v"):
        tag = f"v{tag}"
    version = tag.removeprefix("v")
    revision = 1
    apk_version = f"{base}_{stage}{number}" if stage else base
    # A tilde sorts before the final version in opkg.
    ipk_version = f"{base}~{stage}{number}" if stage else base

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
