#!/usr/bin/env python3
"""Collect structured data for sdd:archive final report.

Usage: python archive_report.py <change-dir>

Reads .sdd.yaml creates and merges-into, checks existence of
openspec/specs/<cap>/spec.md and openspec/specs/<cap>/test-plan.md.

Outputs JSON:
  {
    "archived": [
      {"name": str, "spec_path": str, "test_plan_path": str,
       "spec_exists": bool, "test_plan_exists": bool, "kind": "creates"|"merges-into"}
    ]
  }
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import _sdd_yaml as sdd_yaml


def find_project_root(start: str) -> str:
    current = os.path.abspath(start)
    for _ in range(10):
        if os.path.isdir(os.path.join(current, "openspec")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return os.path.abspath(start)


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <change-dir>")
        return 1

    change_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(change_dir):
        print(f"ERROR: change directory not found: {change_dir}", file=sys.stderr)
        return 1

    creates = sdd_yaml.get_creates(change_dir)
    merges_into = sdd_yaml.get_merges_into(change_dir)
    project_root = find_project_root(change_dir)

    archived = []
    for kind, caps in [("creates", creates), ("merges-into", merges_into)]:
        for cap in caps:
            spec_path = f"openspec/specs/{cap}/spec.md"
            test_plan_path = f"openspec/specs/{cap}/test-plan.md"
            spec_exists = os.path.exists(os.path.join(project_root, spec_path))
            test_plan_exists = os.path.exists(os.path.join(project_root, test_plan_path))
            archived.append({
                "name": cap,
                "spec_path": spec_path,
                "test_plan_path": test_plan_path,
                "spec_exists": spec_exists,
                "test_plan_exists": test_plan_exists,
                "kind": kind,
            })

    result = {"archived": archived}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
