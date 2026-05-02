#!/usr/bin/env python3
"""Read/write/delete .sdd-state.yaml for SDD workflow tracking.

Usage:
    state.py read <path>
    state.py update <path> <field> <value>
    state.py transition <path> <new-stage>
    state.py delete <path>

Lifecycle: file lives in openspec/changes/<change-id>/.sdd-state.yaml.
Created at-first-touch with stage='unknown' if missing on read/update.
Deleted only on successful archive completion (last step).
"""
import os
import sys
from datetime import datetime, timezone

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


VALID_STAGES = {
    "unknown",
    "proposed",
    "contradiction-ok",
    "contradiction-failed",
    "applying",
    "verifying",
    "verify-ok",
    "verify-failed",
    "archiving",
    "archived",
    "archive-failed",
}

ALLOWED_TRANSITIONS = {
    "unknown": VALID_STAGES,
    "proposed": {"contradiction-ok", "contradiction-failed"},
    "contradiction-ok": {"applying", "contradiction-failed", "proposed"},
    "contradiction-failed": {"proposed", "contradiction-ok", "contradiction-failed"},
    "applying": {"verifying", "verify-failed"},
    "verifying": {"verify-ok", "verify-failed"},
    "verify-ok": {"archiving", "verifying", "applying"},
    "verify-failed": {"applying", "verifying"},
    "archiving": {"archived", "archive-failed"},
    "archived": set(),
    "archive-failed": {"archiving", "archived", "verify-ok"},
}


def now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def at_first_touch(path: str) -> dict:
    """Create state file with stage='unknown' if missing."""
    data = {"stage": "unknown", "last_step_at": now_iso(), "owner": ""}
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)
    return data


def load(path: str) -> dict:
    if not os.path.exists(path):
        return at_first_touch(path)
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def save(path: str, data: dict) -> None:
    data["last_step_at"] = now_iso()
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)


def cmd_read(path: str) -> int:
    data = load(path)
    yaml.safe_dump(data, sys.stdout, sort_keys=False, allow_unicode=True)
    return 0


def cmd_update(path: str, field: str, value: str) -> int:
    data = load(path)
    data[field] = value
    save(path, data)
    return 0


def cmd_transition(path: str, new_stage: str) -> int:
    if new_stage not in VALID_STAGES:
        print(f"ERROR: invalid stage '{new_stage}'. Valid: {sorted(VALID_STAGES)}", file=sys.stderr)
        return 2
    data = load(path)
    current = data.get("stage", "unknown")
    if current not in ALLOWED_TRANSITIONS:
        print(f"ERROR: unknown current stage '{current}'", file=sys.stderr)
        return 2
    if new_stage not in ALLOWED_TRANSITIONS[current]:
        print(
            f"ERROR: transition '{current}' -> '{new_stage}' not allowed. "
            f"Allowed from '{current}': {sorted(ALLOWED_TRANSITIONS[current])}",
            file=sys.stderr,
        )
        return 2
    data["stage"] = new_stage
    save(path, data)
    print(f"{current} -> {new_stage}")
    return 0


def cmd_delete(path: str) -> int:
    if os.path.exists(path):
        os.remove(path)
    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2
    cmd = sys.argv[1]
    if cmd == "read" and len(sys.argv) == 3:
        return cmd_read(sys.argv[2])
    if cmd == "update" and len(sys.argv) == 5:
        return cmd_update(sys.argv[2], sys.argv[3], sys.argv[4])
    if cmd == "transition" and len(sys.argv) == 4:
        return cmd_transition(sys.argv[2], sys.argv[3])
    if cmd == "delete" and len(sys.argv) == 3:
        return cmd_delete(sys.argv[2])
    print(__doc__, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
