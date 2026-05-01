#!/usr/bin/env python3
"""Collect spec content for sdd:contradiction cross-spec analysis.

Usage: python contradiction.py <change-dir>

Reads openspec/specs/index.yaml and <change-dir>/.sdd.yaml,
loads relevant spec.md files, outputs a structured package for Claude to analyze.
"""
import sys
import os

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)


def find_project_root(start: str) -> str:
    """Walk up until we find openspec/ directory."""
    current = os.path.abspath(start)
    for _ in range(10):
        if os.path.isdir(os.path.join(current, "openspec")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return os.path.abspath(start)


def load_yaml_file(path: str) -> dict | None:
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or {}


def read_file(path: str) -> str | None:
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return f.read()


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: contradiction.py <change-dir>")
        sys.exit(1)

    change_dir = os.path.abspath(sys.argv[1])
    project_root = find_project_root(change_dir)
    index_path = os.path.join(project_root, "openspec", "specs", "index.yaml")
    sdd_yaml_path = os.path.join(change_dir, ".sdd.yaml")
    specs_root = os.path.join(project_root, "openspec", "specs")

    warnings: list[str] = []
    loaded: list[dict] = []
    skipped: list[dict] = []

    # Read index.yaml
    index = load_yaml_file(index_path)
    if index is None:
        print(f"INFO: openspec/specs/index.yaml not found at {index_path}")
        print("No cross-spec analysis possible without index.")
        print(f"\nsummary: total_discovered=0 total_loaded=0 skipped=0")
        return

    all_specs: list[dict] = index.get("specs", [])
    discovered_names = {s.get("capability") for s in all_specs if s.get("capability")}

    # Read .sdd.yaml
    sdd = load_yaml_file(sdd_yaml_path)
    if sdd is None:
        print(f"INFO: .sdd.yaml not found at {sdd_yaml_path}")
        print("Proceeding with full index scan (no capability scoping).")
        relevant_names = discovered_names
    else:
        creates = set(sdd.get("creates") or [])
        merges_into = set(sdd.get("merges-into") or [])
        relevant_names = creates | merges_into | discovered_names

    # Load specs
    for entry in all_specs:
        name = entry.get("capability", "")
        if not name:
            continue
        rel_path = entry.get("path", f"{name}/spec.md")
        abs_path = os.path.join(specs_root, rel_path)
        content = read_file(abs_path)
        if content is None:
            msg = f"missing file: {rel_path}"
            warnings.append(msg)
            skipped.append({"capability": name, "reason": msg})
        else:
            loaded.append({"capability": name, "path": rel_path, "content": content})

    # Output structured package
    print("=== SDD Cross-Spec Package ===")
    print(f"change_dir: {change_dir}")
    print(f"index: {index_path}")
    print()

    if warnings:
        print("--- Warnings ---")
        for w in warnings:
            print(f"  {w}")
        print()

    for entry in loaded:
        print(f"--- Capability: {entry['capability']} ({entry['path']}) ---")
        print(entry["content"])
        print()

    print("--- Summary ---")
    print(f"total_discovered: {len(all_specs)}")
    print(f"total_loaded: {len(loaded)}")
    print(f"skipped: {len(skipped)}")
    if skipped:
        for s in skipped:
            print(f"  - {s['capability']}: {s['reason']}")


if __name__ == "__main__":
    main()
