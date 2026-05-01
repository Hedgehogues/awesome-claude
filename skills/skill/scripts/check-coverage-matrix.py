#!/usr/bin/env python3
"""
Check TDD coverage matrix for all skills.

Parses cases/<ns>/<skill>.md files and verifies each skill has cases
covering all 4 categories: positive-happy, positive-corner, negative-missing-input, negative-invalid-input.
"""

import os
import sys
import re
from pathlib import Path
from collections import defaultdict

def extract_cases(file_path):
    """Parse cases/<ns>/<skill>.md and extract case categories."""
    if not os.path.exists(file_path):
        return []

    with open(file_path, 'r') as f:
        content = f.read()

    cases = []
    # Match ## Case: <name> blocks
    case_pattern = r'## Case: ([^\n]+)'
    for match in re.finditer(case_pattern, content):
        case_name = match.group(1).strip()

        # Try to detect category from name
        category = None
        if 'positive-happy' in case_name or 'happy' in case_name:
            category = 'positive-happy'
        elif 'positive-corner' in case_name or 'corner' in case_name or 'edge' in case_name:
            category = 'positive-corner'
        elif 'negative-missing' in case_name or 'missing' in case_name:
            category = 'negative-missing-input'
        elif 'negative-invalid' in case_name or 'invalid' in case_name or 'malformed' in case_name:
            category = 'negative-invalid-input'

        if category:
            cases.append({'name': case_name, 'category': category})

    return cases

def check_coverage(cases_dir):
    """Check coverage for all skills in cases/ directory."""
    categories = ['positive-happy', 'positive-corner', 'negative-missing-input', 'negative-invalid-input']
    results = defaultdict(lambda: {'covered': set(), 'total_cases': 0})

    if not os.path.exists(cases_dir):
        print(f"ERROR: {cases_dir} not found")
        return results

    # Iterate through all <ns>/<skill>.md files
    for ns_dir in os.listdir(cases_dir):
        ns_path = os.path.join(cases_dir, ns_dir)
        if not os.path.isdir(ns_path):
            continue

        for skill_file in os.listdir(ns_path):
            if not skill_file.endswith('.md'):
                continue

            skill_name = skill_file[:-3]  # Remove .md
            skill_id = f"{ns_dir}:{skill_name}"

            file_path = os.path.join(ns_path, skill_file)
            cases = extract_cases(file_path)

            results[skill_id]['total_cases'] = len(cases)
            for case in cases:
                if case['category']:
                    results[skill_id]['covered'].add(case['category'])

    return results

def main():
    cases_dir = 'skills/skill/cases'
    results = check_coverage(cases_dir)

    categories = ['positive-happy', 'positive-corner', 'negative-missing-input', 'negative-invalid-input']

    incomplete = []
    for skill_id in sorted(results.keys()):
        covered = results[skill_id]['covered']
        total = results[skill_id]['total_cases']
        missing = [c for c in categories if c not in covered]

        if len(covered) < 4:
            incomplete.append({
                'skill': skill_id,
                'covered': len(covered),
                'total': total,
                'missing': missing
            })

    if incomplete:
        print("=== Skills with incomplete coverage ===\n")
        for item in incomplete:
            print(f"{item['skill']}: {item['covered']}/4 categories ({item['total']} cases)")
            for cat in item['missing']:
                print(f"  ✗ {cat}")

        print(f"\n❌ {len(incomplete)} skills need coverage")
        return 1
    else:
        print(f"✓ All skills have complete TDD coverage (4 categories)")
        return 0

if __name__ == '__main__':
    sys.exit(main())
