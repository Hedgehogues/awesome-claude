## ADDED Requirements

### Requirement: sdd:apply generates semantic test cases from test-plan.md
`sdd:apply` SHALL invoke `test-plan-to-cases.py` (at `${CLAUDE_SKILL_DIR}/scripts/test-plan-to-cases.py`) after updating `openspec/specs/index.yaml`. The script reads `test-plan.md` of the current change, parses YAML front matter (fields `approach`, `acceptance_criteria`), and generates one semantic case file per acceptance criterion at `skills/skill/cases/<namespace>/<capability>/<ac_id>.md`.

#### Scenario: apply generates cases from test-plan
- **WHEN** `sdd:apply` runs for a change with non-empty `acceptance_criteria` in `test-plan.md`
- **THEN** `test-plan-to-cases.py` is invoked
- **THEN** for each criterion, a case file is created at `skills/skill/cases/<ns>/<cap>/<ac_id>.md`
- **THEN** each case file contains `## Case: <ac_id>`, `stub: fresh-repo` (default), and `semantic:` assertions derived from the criterion text

#### Scenario: test-plan has empty acceptance_criteria
- **WHEN** `sdd:apply` reads `test-plan.md` and `acceptance_criteria: []`
- **THEN** `test-plan-to-cases.py` exits cleanly without generating files
- **THEN** apply continues without error

### Requirement: test-plan-to-cases.py outputs case files in canonical format
`test-plan-to-cases.py` SHALL write case files using the format expected by `skill:test-skill`: top-level `# Test: <ns>:<skill>` heading, one `## Case: <ac_id>` section per criterion, `stub:` line, and `semantic:` block.

#### Scenario: Case file format is consumable by skill:test-skill
- **WHEN** `test-plan-to-cases.py` writes a case file
- **THEN** the file structure matches the format used in existing `skills/skill/cases/sdd/*.md`
- **THEN** `skill:test-skill` can read and execute the generated case without manual editing
