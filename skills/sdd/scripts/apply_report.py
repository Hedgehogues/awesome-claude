#!/usr/bin/env python3
"""Collect structured data for sdd:apply final report.

Usage: python apply_report.py <change-dir>

Reads .sdd.yaml.creates, tasks.md (checkbox state), test-plan.md (acceptance_criteria, ## Scenarios).
Outputs JSON:
  {
    "capabilities": [{"name": str, "status": "done"|"partial"}],
    "file_facts": [str],
    "verify": [{"capability": str, "scenario": str, "where": str, "how": ""}]
  }
The "how" field is left empty — filled by LLM at render time.
"""
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(__file__))
import _sdd_yaml as sdd_yaml

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)


def parse_front_matter(content: str) -> dict:
    m = re.match(r"^---\s*\n(.*?\n)---\s*\n", content, re.DOTALL)
    if not m:
        return {}
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return {}


def parse_tasks(tasks_path: str) -> tuple[list[str], list[str], list[str]]:
    """Return (checked_tasks, unchecked_tasks, file_facts).
    file_facts: paths mentioned in tasks.md that look like file paths.
    """
    if not os.path.exists(tasks_path):
        return [], [], []
    with open(tasks_path, encoding="utf-8") as f:
        content = f.read()
    checked, unchecked, file_facts = [], [], []
    for line in content.splitlines():
        stripped = line.strip()
        if re.match(r"- \[x\]", stripped, re.IGNORECASE):
            checked.append(stripped)
            # extract file paths (patterns like skills/..., .claude/..., docs/...)
            for m in re.finditer(r"`([^`]+\.[a-z]{2,5})`", stripped):
                file_facts.append(m.group(1))
        elif re.match(r"- \[ \]", stripped):
            unchecked.append(stripped)
    return checked, unchecked, file_facts


def capability_tasks(capability: str, checked: list[str], unchecked: list[str]) -> tuple[list[str], list[str]]:
    """Filter tasks that mention the capability name. Falls back to all tasks if none found."""
    cap_lower = capability.lower().replace("-", "[-_]?")
    pattern = re.compile(cap_lower, re.IGNORECASE)
    cap_checked = [t for t in checked if pattern.search(t)]
    cap_unchecked = [t for t in unchecked if pattern.search(t)]
    if not cap_checked and not cap_unchecked:
        return checked, unchecked
    return cap_checked, cap_unchecked


def determine_status(cap_checked: list[str], cap_unchecked: list[str]) -> str:
    if cap_unchecked:
        return "partial"
    if cap_checked:
        return "done"
    return "partial"


def parse_test_plan(test_plan_path: str) -> tuple[list[str], list[str]]:
    """Return (acceptance_criteria, scenarios)."""
    if not os.path.exists(test_plan_path):
        return [], []
    with open(test_plan_path, encoding="utf-8") as f:
        content = f.read()
    fm = parse_front_matter(content)
    criteria = fm.get("acceptance_criteria") or []
    if isinstance(criteria, list):
        criteria = [str(c) for c in criteria]
    else:
        criteria = []
    # Extract ## Scenarios section
    scenarios = []
    m = re.search(r"^## Scenarios\s*\n(.*?)(?=^## |\Z)", content, re.DOTALL | re.MULTILINE)
    if m:
        body = m.group(1).strip()
        if body and not body.lower().startswith("todo"):
            for line in body.splitlines():
                line = line.strip()
                if line and not line.startswith("#"):
                    scenarios.append(line)
    return criteria, scenarios


def extract_where_hint(capability: str, checked: list[str], file_facts: list[str]) -> str:
    """Return a plausible 'where' hint for verification."""
    # Look for test file paths in file_facts
    for fact in file_facts:
        if "test" in fact.lower() or "cases" in fact.lower() or "spec" in fact.lower():
            return fact
    if file_facts:
        return file_facts[0]
    # Fallback: derive from capability name
    ns = "sdd"
    return f"skills/{ns}/{capability}/cases/{capability}.md"


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <change-dir>")
        return 1

    change_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(change_dir):
        print(f"ERROR: change directory not found: {change_dir}", file=sys.stderr)
        return 1

    creates_meta = sdd_yaml.read_creates_with_meta(change_dir)
    if not creates_meta:
        result = {"capabilities": [], "file_facts": [], "verify": []}
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    checked, unchecked, file_facts = parse_tasks(os.path.join(change_dir, "tasks.md"))
    criteria, scenarios = parse_test_plan(os.path.join(change_dir, "test-plan.md"))

    capabilities = []
    verify = []
    for cap_meta in creates_meta:
        cap = cap_meta["name"]
        cap_title = cap_meta.get("title")
        cap_checked, cap_unchecked = capability_tasks(cap, checked, unchecked)
        status = determine_status(cap_checked, cap_unchecked)
        incomplete_count = len(cap_unchecked)
        capabilities.append({
            "name": cap,
            "title": cap_title,
            "status": status,
            "incomplete_count": incomplete_count,
        })

        where = extract_where_hint(cap, cap_checked + cap_unchecked, file_facts)
        effective_criteria = criteria if criteria else scenarios[:3]
        if not effective_criteria:
            verify.append({"capability": cap, "title": cap_title, "scenario": cap, "where": where, "how": ""})
        else:
            for criterion in effective_criteria:
                criterion_str = str(criterion)
                if "todo" in criterion_str.lower():
                    continue
                verify.append({"capability": cap, "title": cap_title, "scenario": str(criterion), "where": where, "how": ""})

    result = {
        "capabilities": capabilities,
        "file_facts": file_facts,
        "verify": verify,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
