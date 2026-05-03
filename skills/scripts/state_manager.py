#!/usr/bin/env python3
"""Declarative state router for SDD workflow.

Usage:
    state_manager.py --ns <namespace> --skill <skill> --step <step> --state-file <path>

Finds skills/<ns>/<skill>/state.yaml, validates step against current_stage,
then appends sets_stage to the pending_transitions accumulation chain.

current_stage resolution (accumulation model):
  - last value of pending_transitions if field is non-empty
  - else stage field from state-file
"""
import argparse
import subprocess
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent.resolve()
STATE_PY = SCRIPT_DIR.parent / "sdd" / "scripts" / "state.py"


def run_state(*args: str) -> int:
    r = subprocess.run(
        [sys.executable, str(STATE_PY)] + list(args),
        capture_output=True,
        text=True,
    )
    if r.returncode != 0:
        print(r.stderr.strip(), file=sys.stderr)
    return r.returncode


def get_current_stage(state_file: str) -> str:
    path = Path(state_file)
    if not path.exists():
        return "unknown"
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    except Exception:
        return "unknown"
    pending = str(data.get("pending_transitions", "")).strip()
    if pending:
        parts = [p.strip() for p in pending.split(",") if p.strip()]
        if parts:
            return parts[-1]
    return str(data.get("stage", "unknown"))


def append_pending(state_file: str, stage: str) -> int:
    path = Path(state_file)
    if path.exists():
        try:
            data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
            current = str(data.get("pending_transitions", "")).strip()
        except Exception:
            current = ""
    else:
        current = ""
    new_value = f"{current},{stage}" if current else stage
    return run_state("update", state_file, "pending_transitions", new_value)


def main() -> int:
    parser = argparse.ArgumentParser(description="SDD declarative state router")
    parser.add_argument("--ns", required=True, help="Namespace (e.g. sdd)")
    parser.add_argument("--skill", required=True, help="Skill name (e.g. apply)")
    parser.add_argument("--step", required=True, help="Step name defined in state.yaml")
    parser.add_argument("--state-file", required=True, dest="state_file")
    args = parser.parse_args()

    repo_root = SCRIPT_DIR.parent.parent
    state_yaml_path = repo_root / "skills" / args.ns / args.skill / "state.yaml"

    if not state_yaml_path.exists():
        print(
            f"ERROR: state.yaml not found for {args.ns}:{args.skill} "
            f"(expected: {state_yaml_path})",
            file=sys.stderr,
        )
        return 2

    try:
        state_yaml = yaml.safe_load(state_yaml_path.read_text(encoding="utf-8")) or {}
    except Exception as e:
        print(f"ERROR: failed to parse {state_yaml_path}: {e}", file=sys.stderr)
        return 2

    steps = state_yaml.get("steps", {})
    if args.step not in steps:
        print(
            f"ERROR: step '{args.step}' not found in {state_yaml_path}. "
            f"Available: {sorted(steps.keys())}",
            file=sys.stderr,
        )
        return 2

    step_def = steps[args.step]
    allowed_from = step_def.get("allowed_from", [])
    sets_stage = step_def.get("sets_stage", "")

    current_stage = get_current_stage(args.state_file)
    if current_stage not in allowed_from:
        print(
            f"ERROR: step '{args.step}' not allowed from stage '{current_stage}'. "
            f"Allowed from: {allowed_from}",
            file=sys.stderr,
        )
        return 2

    return append_pending(args.state_file, sets_stage)


if __name__ == "__main__":
    sys.exit(main())
