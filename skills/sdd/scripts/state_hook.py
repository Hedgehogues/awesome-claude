#!/usr/bin/env python3
"""
PostToolUse hook: apply pending state transitions after SDD skills complete.

Reads stdin JSON from Claude Code harness (tool_name, tool_input, tool_response).
Reads .sdd-state.yaml.pending_transitions written by the skill, applies each
stage via state.py in order, then clears the field. Exit 0 always (fail-soft).

Coupling: none — hook does not know about specific skills or stage names.
"""
import json
import subprocess
import sys
from pathlib import Path
from typing import List, Optional

SCRIPT_DIR = Path(__file__).parent.resolve()
STATE_PY = SCRIPT_DIR / "state.py"


def warn(msg: str) -> None:
    print(f"[state_hook] WARNING: {msg}", file=sys.stderr)


def find_freshest_state_file() -> Optional[str]:
    changes_dir = Path("openspec/changes")
    if not changes_dir.exists():
        return None
    try:
        import yaml
    except ImportError:
        warn("PyYAML not installed; cannot find freshest state-file")
        return None
    freshest: Optional[str] = None
    freshest_ts = ""
    for f in changes_dir.glob("*/.sdd-state.yaml"):
        try:
            data = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
            ts = str(data.get("last_step_at", ""))
            if ts > freshest_ts:
                freshest_ts, freshest = ts, str(f)
        except Exception:
            continue
    return freshest


def resolve_change(args: str) -> Optional[str]:
    if args:
        name = args.strip().split()[0]
        candidate = f"openspec/changes/{name}/.sdd-state.yaml"
        if Path(candidate).exists():
            return candidate
    return find_freshest_state_file()


def run_cmd(*cmd_args: str) -> bool:
    r = subprocess.run(
        [sys.executable, str(STATE_PY)] + list(cmd_args),
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        warn(f"state.py {' '.join(cmd_args)}: {r.stderr.strip()}")
    return r.returncode == 0


def is_final_stage(stage: str) -> bool:
    r = subprocess.run(
        [sys.executable, str(STATE_PY), "is-final", stage],
        capture_output=True, text=True,
    )
    return r.returncode == 0


def read_pending(state_path: str) -> List[str]:
    try:
        import yaml
        data = yaml.safe_load(Path(state_path).read_text(encoding="utf-8")) or {}
        raw = str(data.get("pending_transitions", "")).strip()
        return [s.strip() for s in raw.split(",") if s.strip()] if raw else []
    except Exception:
        return []


def main() -> int:
    raw = sys.stdin.read().strip()
    if not raw:
        return 0
    try:
        event = json.loads(raw)
    except Exception as e:
        warn(f"invalid JSON on stdin: {e}")
        return 0

    if event.get("tool_name") != "Skill":
        return 0

    tool_input = event.get("tool_input") or {}
    args = str(tool_input.get("args", "") or "")

    state_path = resolve_change(args)
    if not state_path:
        return 0

    stages = read_pending(state_path)
    if not stages:
        return 0

    last_applied: Optional[str] = None
    for stage in stages:
        if run_cmd("transition", state_path, stage):
            last_applied = stage
        else:
            break

    run_cmd("update", state_path, "pending_transitions", "")

    if last_applied and is_final_stage(last_applied):
        run_cmd("delete", state_path)

    return 0


if __name__ == "__main__":
    sys.exit(main())
