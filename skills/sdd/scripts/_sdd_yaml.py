#!/usr/bin/env python3
"""Shared parser + CLI for .sdd.yaml.

Library API (used by apply_report.py, contradiction_summary.py, archive_report.py):
    load(change_dir) -> dict
    get_creates(change_dir) -> list[str]
    get_merges_into(change_dir) -> list[str]

CLI:
    _sdd_yaml.py read <change-dir>
    _sdd_yaml.py move-capability <change-dir> <name> <from-field> <to-field>
        from-field/to-field ∈ {creates, merges-into}
    _sdd_yaml.py set-owner <change-dir> <email>
    _sdd_yaml.py merge-state <change-dir>
    _sdd_yaml.py update-index-description <index-yaml-path> <capability> <description>
"""
import json
import os
import sys

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


VALID_FIELDS = {"creates", "merges-into"}


def _path(change_dir: str) -> str:
    return os.path.join(change_dir, ".sdd.yaml")


def load(change_dir: str) -> dict:
    path = _path(change_dir)
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def save(change_dir: str, data: dict) -> None:
    path = _path(change_dir)
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)


def get_creates(change_dir: str) -> list[str]:
    creates = load(change_dir).get("creates") or []
    return [entry if isinstance(entry, str) else entry.get("name", "") for entry in creates]


def read_creates_with_meta(change_dir: str) -> list[dict]:
    """Return creates entries normalized to [{name: str, title: str | None}].

    Supports both string entries ("name") and object entries ({name, title}).
    """
    creates = load(change_dir).get("creates") or []
    result = []
    for entry in creates:
        if isinstance(entry, str):
            result.append({"name": entry, "title": None})
        elif isinstance(entry, dict):
            result.append({"name": entry.get("name", ""), "title": entry.get("title")})
    return result


def get_merges_into(change_dir: str) -> list[str]:
    return load(change_dir).get("merges-into") or []


def cmd_read(change_dir: str) -> int:
    data = load(change_dir)
    print(json.dumps(data, ensure_ascii=False, indent=2))
    return 0


def cmd_move_capability(change_dir: str, name: str, src: str, dst: str) -> int:
    if src not in VALID_FIELDS or dst not in VALID_FIELDS:
        print(
            f"ERROR: from/to must be one of {sorted(VALID_FIELDS)}",
            file=sys.stderr,
        )
        return 2
    if src == dst:
        print(f"ERROR: from-field and to-field are the same: {src}", file=sys.stderr)
        return 2
    data = load(change_dir)
    if not data:
        print(f"ERROR: .sdd.yaml not found in {change_dir}", file=sys.stderr)
        return 2
    src_list = data.get(src) or []
    dst_list = data.get(dst) or []
    if name not in src_list:
        print(f"ERROR: '{name}' not in {src}: {src_list}", file=sys.stderr)
        return 2
    src_list = [c for c in src_list if c != name]
    if name not in dst_list:
        dst_list.append(name)
    data[src] = src_list
    data[dst] = dst_list
    save(change_dir, data)
    print(f"moved '{name}': {src} -> {dst}")
    return 0


def merge_state(change_dir: str) -> None:
    state_path = os.path.join(change_dir, ".sdd-state.yaml")
    if not os.path.exists(state_path):
        return
    with open(state_path, encoding="utf-8") as f:
        state = yaml.safe_load(f) or {}
    data = load(change_dir)
    if not data:
        return
    for field in ("stage", "last_step_at"):
        if field in state:
            data[field] = state[field]
    save(change_dir, data)


def cmd_merge_state(change_dir: str) -> int:
    if not os.path.exists(_path(change_dir)):
        print(f"ERROR: .sdd.yaml not found in {change_dir}", file=sys.stderr)
        return 2
    merge_state(change_dir)
    return 0


def cmd_set_owner(change_dir: str, email: str) -> int:
    if not isinstance(email, str) or not email.strip():
        print("ERROR: owner must be a non-empty string", file=sys.stderr)
        return 2
    data = load(change_dir)
    if not data:
        print(f"ERROR: .sdd.yaml not found in {change_dir}", file=sys.stderr)
        return 2
    if isinstance(data.get("owner"), list):
        print(
            "ERROR: existing owner is a list — single-owner only. "
            "Manually clean .sdd.yaml first.",
            file=sys.stderr,
        )
        return 2
    data["owner"] = email
    save(change_dir, data)
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2
    cmd = sys.argv[1]
    if cmd == "read" and len(sys.argv) == 3:
        return cmd_read(sys.argv[2])
    if cmd == "move-capability" and len(sys.argv) == 6:
        return cmd_move_capability(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    if cmd == "set-owner" and len(sys.argv) == 4:
        return cmd_set_owner(sys.argv[2], sys.argv[3])
    if cmd == "merge-state" and len(sys.argv) == 3:
        return cmd_merge_state(sys.argv[2])
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
