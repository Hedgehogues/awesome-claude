#!/usr/bin/env python3
"""Generate semantic test case files from test-plan.md acceptance_criteria.

Usage: python test-plan-to-cases.py <change-dir>

Reads <change-dir>/test-plan.md (YAML front matter) and <change-dir>/.sdd.yaml.
For each capability in .sdd.yaml.creates, generates skills/skill/cases/<ns>/<cap>/<ac_id>.md
populated with semantic assertions derived from acceptance_criteria.

Namespace inference: 'sdd' for capabilities mentioning sdd:/spec/index/test-plan; 'dev' for
dev:/build/test/deploy; 'report' for report:; 'research' for research:; falls back to 'sdd'.
"""
import sys
import os
import re

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)


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


def parse_front_matter(content: str) -> dict:
    m = re.match(r"^---\s*\n(.*?\n)---\s*\n", content, re.DOTALL)
    if not m:
        return {}
    try:
        return yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError:
        return {}


def slugify(text: str, max_len: int = 50) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", text.lower()).strip("-")
    return s[:max_len].rstrip("-") or "criterion"


def infer_namespace(capability: str) -> str:
    cap = capability.lower()
    if any(k in cap for k in ("dev-", "build", "deploy", "tdd", "trace", "fix")):
        return "dev"
    if any(k in cap for k in ("report-", "describe", "session")):
        return "report"
    if any(k in cap for k in ("research-", "triz")):
        return "research"
    return "sdd"


def generate_case(ac_id: str, criterion: str, stub: str = "fresh-repo") -> str:
    return (
        f"## Case: {ac_id}\n"
        f"stub: {stub}\n"
        f"semantic:\n"
        f"  - acceptance: {criterion}\n"
    )


def main() -> int:
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <change-dir>")
        return 1

    change_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(change_dir):
        print(f"ERROR: change directory not found: {change_dir}")
        return 1

    test_plan_path = os.path.join(change_dir, "test-plan.md")
    sdd_yaml_path = os.path.join(change_dir, ".sdd.yaml")

    if not os.path.exists(test_plan_path):
        print(f"INFO: test-plan.md not found at {test_plan_path}; nothing to generate")
        return 0

    if not os.path.exists(sdd_yaml_path):
        print(f"INFO: .sdd.yaml not found at {sdd_yaml_path}; cannot resolve capabilities")
        return 0

    with open(test_plan_path, encoding="utf-8") as f:
        content = f.read()

    fm = parse_front_matter(content)
    criteria = fm.get("acceptance_criteria") or []
    if not isinstance(criteria, list) or not criteria:
        print("INFO: no acceptance_criteria in test-plan.md; nothing to generate")
        return 0

    with open(sdd_yaml_path, encoding="utf-8") as f:
        sdd = yaml.safe_load(f) or {}
    capabilities = sdd.get("creates") or []
    if not capabilities:
        print("INFO: .sdd.yaml.creates is empty; nothing to generate")
        return 0

    project_root = find_project_root(change_dir)
    cases_root = os.path.join(project_root, "skills", "skill", "cases")

    generated = 0
    for cap in capabilities:
        ns = infer_namespace(cap)
        cap_dir = os.path.join(cases_root, ns, cap)
        os.makedirs(cap_dir, exist_ok=True)
        for idx, criterion in enumerate(criteria, 1):
            ac_id = f"ac-{idx:02d}-{slugify(str(criterion))}"
            file_path = os.path.join(cap_dir, f"{ac_id}.md")
            if os.path.exists(file_path):
                continue
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(f"# Test: {ns}:{cap} ({ac_id})\n\n")
                f.write(generate_case(ac_id, str(criterion)))
            generated += 1

    print(f"Generated {generated} case files for {len(capabilities)} capabilities")
    return 0


if __name__ == "__main__":
    sys.exit(main())
