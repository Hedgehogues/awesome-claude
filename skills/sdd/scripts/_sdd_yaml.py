#!/usr/bin/env python3
"""Shared parser for .sdd.yaml — imported by apply_report.py, contradiction_summary.py, archive_report.py."""
import os
import sys

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def load(change_dir: str) -> dict:
    path = os.path.join(change_dir, ".sdd.yaml")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def get_creates(change_dir: str) -> list[str]:
    return load(change_dir).get("creates") or []


def get_merges_into(change_dir: str) -> list[str]:
    return load(change_dir).get("merges-into") or []


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <change-dir>")
        sys.exit(1)
    import json
    data = load(sys.argv[1])
    print(json.dumps(data, ensure_ascii=False, indent=2))
