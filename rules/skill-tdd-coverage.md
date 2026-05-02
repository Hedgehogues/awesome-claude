---
paths:
  - "skills/**/*.md"
---

# Skill TDD Coverage Policy

## Rule

Every skill SHALL have at least 4 test cases at `skills/skill/cases/<ns>/<skill>.md`, covering all four categories:

| Category | Purpose | Example |
|----------|---------|---------|
| `positive-happy` | TDD-green: valid input, expected success | User asks for feature → skill generates proposal |
| `positive-corner` | Boundary values, edge cases | Empty list, maximum limits, valid edge |
| `negative-missing-input` | TDD-red: required artifact absent | User asks to apply with no tasks.md |
| `negative-invalid-input` | Input malformed or incorrect type | JSON syntax error, missing required field |

Test case names SHOULD include the category: `## Case: positive-happy-...` or use explicit `category:` field.

## Verification

When modifying or creating a skill:
1. Run `/skill:test-all` to audit coverage
2. If coverage < 4 categories: add missing cases before shipping
3. Categories are discovered by pattern matching case names or explicit `category:` field

## Exception

Internal infrastructure skills (e.g. `skill:test-skill`, `skill:test-all`) are exempt from the 4-category requirement but SHOULD have at least 2 cases (happy path + one edge).
