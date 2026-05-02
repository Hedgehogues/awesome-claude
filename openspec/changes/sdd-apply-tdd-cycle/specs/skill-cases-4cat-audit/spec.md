## ADDED Requirements

### Requirement: every skill case file uses 4-category naming
Every `skills/<ns>/<skill>/cases/<skill>.md` SHALL contain at least one case per category. Category is determined by case name prefix:

| Prefix | Meaning |
|---|---|
| `positive-happy-` | valid input, expected success path |
| `positive-corner-` | boundary value, edge of valid range |
| `negative-missing-input-` | required artifact or input absent |
| `negative-invalid-input-` | input present but malformed or schema-violating |

A case without a recognized prefix is treated as uncategorized and does not count toward any category.

#### Scenario: skill has all 4 categories
- **WHEN** `cases/dev/tdd.md` contains cases `positive-happy-with-context`, `positive-corner-empty-description`, `negative-missing-input-no-feature`, `negative-invalid-input-malformed-stub`
- **THEN** `check-coverage-matrix.py` reports `dev:tdd: OK (4/4)`

#### Scenario: skill missing negative-invalid-input category
- **WHEN** `cases/sdd/apply.md` has no case with `negative-invalid-input-` prefix
- **THEN** `check-coverage-matrix.py` reports: `sdd:apply: MISSING [negative-invalid-input]`

#### Scenario: uncategorized case names not counted
- **WHEN** `cases/dev/commit.md` has cases `clean-repo-nothing-to-commit` and `with-staged-changes`
- **THEN** `check-coverage-matrix.py` reports both as uncategorized, counts 0/4 categories

### Requirement: every stub referenced in a case file exists on disk
For each `stub: <name>` field in a case, the referenced stub at `skills/skill/test-skill/stubs/<name>.md` SHALL exist.

#### Scenario: stub exists
- **WHEN** `cases/dev/tdd.md` references `stub: fresh-repo` and `skills/skill/test-skill/stubs/fresh-repo.md` exists
- **THEN** `check-coverage-matrix.py` reports stub as OK

#### Scenario: stub missing
- **WHEN** `cases/sdd/apply.md` references `stub: nonexistent-stub` and the file does not exist
- **THEN** `check-coverage-matrix.py` reports: `sdd:apply: STUB MISSING [nonexistent-stub]`

### Requirement: check-coverage-matrix.py audits all skills and produces structured report
`skills/skill/scripts/check-coverage-matrix.py` (already declared in `skill-tdd-coverage-policy`) SHALL be updated to detect category from name prefix, check stub existence, and produce a report with:
- per-skill status line: `<ns>:<skill>: OK | MISSING [<cats>] | STUB MISSING [<stubs>]`
- summary: total skills, compliant count, non-compliant count

#### Scenario: full audit run
- **WHEN** `check-coverage-matrix.py` is run against `skills/`
- **THEN** output contains one line per skill with status, and a final summary line

#### Scenario: all skills compliant
- **WHEN** every skills has all 4 categories and all stubs resolve
- **THEN** summary reads: `Coverage: N/N skills compliant`

### Requirement: sdd:apply runs coverage audit before task loop
Before the first task, `sdd:apply` SHALL invoke `check-coverage-matrix.py` and print non-compliant skills as WARNINGs. Non-compliance does NOT block apply — it is informational only (gradual migration).

#### Scenario: non-compliant skills found at apply start
- **WHEN** apply starts and `check-coverage-matrix.py` finds 3 non-compliant skills
- **THEN** apply prints a WARNING section listing them and continues to the task loop

#### Scenario: all skills compliant
- **WHEN** apply starts and all skills pass coverage check
- **THEN** apply prints: `Coverage matrix: all skills compliant` and continues

#### Scenario: check-coverage-matrix.py missing
- **WHEN** `skills/skill/scripts/check-coverage-matrix.py` does not exist
- **THEN** apply skips coverage audit and prints: `WARNING: check-coverage-matrix.py not found — coverage audit skipped`

### Requirement: all existing case files are migrated to 4-category naming
All 27 existing `cases/<ns>/<skill>.md` files SHALL have their case names updated (or new cases added) to satisfy the 4-category requirement. Migration strategy: rename existing cases to the closest matching category prefix; add missing-category stub cases where no match exists.

#### Scenario: existing case matches happy path
- **WHEN** case `happy-path-with-sdd-yaml` maps to `positive-happy-`
- **THEN** it is renamed to `positive-happy-with-sdd-yaml`

#### Scenario: existing case needs stub category added
- **WHEN** a skill has only 2 categorized cases after renaming
- **THEN** 2 stub cases are added with `TODO: fill semantic assertions` to cover missing categories
