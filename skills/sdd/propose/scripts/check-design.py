#!/usr/bin/env python3
"""Validate design.md structure against openspec template.

Usage: python check-design.py <change-dir>

Reads <change-dir>/design.md and checks that all required openspec sections
are present. Required sections (from `openspec instructions design --json`):
  ## Context
  ## Goals / Non-Goals
  ## Decisions
  ## Risks / Trade-offs

Optional: ## Migration Plan, ## Open Questions

Exits 0 if all required sections present, 1 with section name on first missing.
"""
import sys
import os
import re

REQUIRED_SECTIONS = [
    "## Context",
    "## Goals / Non-Goals",
    "## Decisions",
    "## Risks / Trade-offs",
]


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <change-dir>")
        return 1

    change_dir = os.path.abspath(sys.argv[1])
    design_path = os.path.join(change_dir, "design.md")
    if not os.path.exists(design_path):
        print(f"ERROR: design.md not found at {design_path}")
        return 1

    with open(design_path, encoding="utf-8") as f:
        content = f.read()

    headings = set(re.findall(r"^##\s+.+$", content, re.MULTILINE))
    headings_normalized = {h.strip() for h in headings}

    missing = [s for s in REQUIRED_SECTIONS if s not in headings_normalized]
    if missing:
        for section in missing:
            print(f"ERROR: design.md is missing section: {section}")
        return 1

    print(f"OK: design.md contains all {len(REQUIRED_SECTIONS)} required sections")
    return 0


if __name__ == "__main__":
    sys.exit(main())
