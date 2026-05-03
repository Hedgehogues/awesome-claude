#!/usr/bin/env python3
"""Collect spec content for sdd:contradiction cross-spec analysis.

Usage: python contradiction.py <change-dir>

Reads openspec/specs/index.yaml and <change-dir>/.sdd.yaml,
loads all live spec.md files plus draft specs for creates-capabilities
not yet in index.yaml, outputs a structured package for Claude to analyze.
"""
import sys
import os

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)

STOP_TOKENS = {
    "sdd", "skill", "spec", "test", "change", "draft",
    "with", "from", "into", "that", "this", "case", "cases",
}


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


def tokenize(name: str) -> set[str]:
    """Split capability name into non-trivial tokens."""
    import re
    parts = re.split(r"[-_\s]+", name.lower())
    return {p for p in parts if len(p) > 3 and p not in STOP_TOKENS}


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
    draft_specs_loaded: int = 0
    primary_capabilities: int = 0
    merges_into_missing: int = 0

    # Read index.yaml
    index = load_yaml_file(index_path)
    if index is None:
        print(f"INFO: openspec/specs/index.yaml not found at {index_path}")
        print("No cross-spec analysis possible without index.")
        print(f"\nsummary: total_discovered=0 total_loaded=0 skipped=0 draft_specs_loaded=0")
        return

    all_specs: list[dict] = index.get("specs", [])
    discovered_names = {s.get("capability") for s in all_specs if s.get("capability")}
    index_by_name = {s.get("capability"): s for s in all_specs if s.get("capability")}

    # Read .sdd.yaml
    sdd = load_yaml_file(sdd_yaml_path)
    if sdd is None:
        print(f"INFO: .sdd.yaml not found at {sdd_yaml_path}")
        print("Proceeding with full index scan (no draft spec loading).")
        creates: set[str] = set()
        merges_into: list[str] = []
    else:
        raw_creates = sdd.get("creates") or []
        creates = {
            entry if isinstance(entry, str) else entry.get("name", "")
            for entry in raw_creates
        }
        merges_into = sdd.get("merges-into") or []

    primary_set = creates | set(merges_into)

    # Explicit merges-into validation pass
    for cap in merges_into:
        if cap not in discovered_names:
            msg = f"merges-into capability '{cap}' not found in index.yaml"
            warnings.append(msg)
            merges_into_missing += 1
        # Successfully found ones are labeled during the main loop below

    # Load live specs (full scan) with PRIMARY labeling
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
            if name in set(merges_into):
                label = "PRIMARY/merges-into"
                primary_capabilities += 1
            elif name in creates:
                label = "PRIMARY/creates"
                primary_capabilities += 1
            else:
                label = None
            loaded.append({"capability": name, "path": rel_path, "content": content, "label": label})

    # Second pass: load draft specs for creates-capabilities not yet in index
    for cap in sorted(creates - discovered_names):
        draft_path = os.path.join(change_dir, "specs", cap, "spec.md")
        content = read_file(draft_path)
        if content is None:
            skipped.append({"capability": cap, "reason": "draft spec not found"})
        else:
            rel = os.path.relpath(draft_path, project_root)
            loaded.append({
                "capability": cap,
                "path": rel,
                "content": content,
                "label": "PRIMARY/creates DRAFT",
            })
            draft_specs_loaded += 1
            primary_capabilities += 1

    # Third pass: ADJACENT scan
    primary_tokens: set[str] = set()
    for cap in primary_set:
        primary_tokens |= tokenize(cap)

    adjacent: list[dict] = []
    if primary_tokens:
        for entry in all_specs:
            name = entry.get("capability", "")
            if not name or name in primary_set:
                continue
            shared = tokenize(name) & primary_tokens
            if len(shared) >= 2:
                adjacent.append({"capability": name, "shared_tokens": sorted(shared)})

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
        label = entry.get("label")
        suffix = f" [{label}]" if label else ""
        print(f"--- Capability: {entry['capability']} ({entry['path']}){suffix} ---")
        print(entry["content"])
        print()

    if adjacent:
        print("--- ADJACENT Capabilities ---")
        for a in adjacent:
            tokens_str = ", ".join(a["shared_tokens"])
            print(f"  {a['capability']}: shared tokens [{tokens_str}]")
        print()
    else:
        print("--- ADJACENT Capabilities ---")
        print("  (none)")
        print()

    print("--- Summary ---")
    print(f"total_discovered: {len(all_specs)}")
    print(f"total_loaded: {len(loaded)}")
    print(f"draft_specs_loaded: {draft_specs_loaded}")
    print(f"primary_capabilities: {primary_capabilities}")
    print(f"merges_into_missing: {merges_into_missing}")
    print(f"adjacent_capabilities: {len(adjacent)}")
    print(f"skipped: {len(skipped)}")
    if skipped:
        for s in skipped:
            print(f"  - {s['capability']}: {s['reason']}")


if __name__ == "__main__":
    main()
