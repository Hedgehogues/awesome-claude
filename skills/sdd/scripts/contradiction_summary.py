#!/usr/bin/env python3
"""Parse Summary section from sdd:contradiction detailed report.

Usage:
  python contradiction_summary.py <report-file>   # read from file
  python contradiction_summary.py -               # read from stdin

Outputs JSON:
  {
    "hard_counts": {"total": int, "numeric": int, "reference": int, "deontic": int, "semantic": int},
    "warning_counts": {"total": int, "redundancy": int, "coverage": int, "placement": int,
                       "spec_count": int, "semantic_completeness": int, "derivability": int,
                       "what_changes_coverage": int, "decisions_coverage": int},
    "residual_risk": {"level": "low|medium|high", "reason": str},
    "convergence": str,
    "exit_semantics": str
  }
"""
import json
import re
import sys


def parse_summary(text: str) -> dict:
    m = re.search(r"--- Summary ---\n(.*?)(?=\n---|$)", text, re.DOTALL)
    if not m:
        return _empty_summary()
    body = m.group(1)

    hard_counts = {"total": 0, "numeric": 0, "reference": 0, "deontic": 0, "semantic": 0}
    warning_counts = {
        "total": 0, "redundancy": 0, "coverage": 0, "placement": 0,
        "spec_count": 0, "semantic_completeness": 0, "derivability": 0,
        "what_changes_coverage": 0, "decisions_coverage": 0,
    }
    residual_risk = {"level": "low", "reason": "not reported"}
    convergence = "n/a"
    exit_semantics = "clean"

    for line in body.splitlines():
        line = line.strip().lstrip("- ")
        if line.startswith("hard:"):
            m2 = re.search(r"hard:\s*(\d+)", line)
            if m2:
                hard_counts["total"] = int(m2.group(1))
            for key in ("numeric", "reference", "deontic", "semantic"):
                m3 = re.search(rf"{key}=(\d+)", line)
                if m3:
                    hard_counts[key] = int(m3.group(1))
        elif line.startswith("warnings:"):
            m2 = re.search(r"warnings:\s*(\d+)", line)
            if m2:
                warning_counts["total"] = int(m2.group(1))
            pairs = {
                "redundancy": "redundancy",
                "coverage": "coverage",
                "placement": "placement",
                "spec-count": "spec_count",
                "semantic-completeness": "semantic_completeness",
                "derivability": "derivability",
                "what-changes-coverage": "what_changes_coverage",
                "decisions-coverage": "decisions_coverage",
            }
            for raw, key in pairs.items():
                m3 = re.search(rf"{re.escape(raw)}=(\d+)", line)
                if m3:
                    warning_counts[key] = int(m3.group(1))
        elif line.startswith("convergence:"):
            convergence = line.split(":", 1)[1].strip()
        elif line.startswith("exit semantics:"):
            exit_semantics = line.split(":", 1)[1].strip()
        elif line.startswith("residual_risk:"):
            rest = line.split(":", 1)[1].strip()
            parts = rest.split("—", 1) if "—" in rest else rest.split("-", 1)
            level = parts[0].strip().lower()
            reason = parts[1].strip() if len(parts) > 1 else ""
            residual_risk = {"level": level, "reason": reason}

    return {
        "hard_counts": hard_counts,
        "warning_counts": warning_counts,
        "residual_risk": residual_risk,
        "convergence": convergence,
        "exit_semantics": exit_semantics,
    }


def _empty_summary() -> dict:
    return {
        "hard_counts": {"total": 0, "numeric": 0, "reference": 0, "deontic": 0, "semantic": 0},
        "warning_counts": {
            "total": 0, "redundancy": 0, "coverage": 0, "placement": 0,
            "spec_count": 0, "semantic_completeness": 0, "derivability": 0,
            "what_changes_coverage": 0, "decisions_coverage": 0,
        },
        "residual_risk": {"level": "low", "reason": "no summary found"},
        "convergence": "n/a",
        "exit_semantics": "clean",
    }


def main() -> int:
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <report-file|->\n  Use '-' to read from stdin")
        return 1

    src = sys.argv[1]
    if src == "-":
        text = sys.stdin.read()
    else:
        try:
            with open(src, encoding="utf-8") as f:
                text = f.read()
        except OSError as e:
            print(f"ERROR: {e}", file=sys.stderr)
            return 1

    result = parse_summary(text)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
