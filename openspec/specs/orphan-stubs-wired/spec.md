## Purpose
Ensuring all existing stubs are referenced by at least one test case.
## Requirements
### Requirement: every stub in skills/skill/stubs/ is referenced by at least one case
Every file in `skills/skill/stubs/` SHALL be referenced via `stub: <name>` in at least one case file under `skills/skill/cases/`. Stubs with no referencing case are orphaned and indicate missing test coverage.

Current stub status:
- `multi-skill` → already referenced in `cases/sdd/help.md` ✓
- `with-openspec` → already referenced in `cases/sdd/help.md` ✓
- `fresh-repo` → wired in `sdd/apply.md` (this change, task 1.1) ✓
- `change-missing-test-plan` → wired in `sdd/archive.md` (this change, task 1.2)
- `change-with-sdd-yaml` → wired in `sdd/archive.md` and `sdd/apply.md` (this change)
- `specs-with-index` → wired in `sdd/contradiction.md` or `sdd/apply.md` (this change, task 6.3)

#### Scenario: change-missing-test-plan is used
- **WHEN** cases are searched for `stub: change-missing-test-plan`
- **THEN** at least one case in `cases/sdd/archive.md` references this stub

#### Scenario: specs-with-index is used
- **WHEN** cases are searched for `stub: specs-with-index`
- **THEN** at least one case references this stub

### Requirement: new case files are mirrored to .claude/skills/skill/cases/
Every new file created under `skills/skill/cases/` as part of this change SHALL also exist at the corresponding path under `.claude/skills/skill/cases/` with identical content.

#### Scenario: mirror exists for each new case file
- **WHEN** a new case file is created at `skills/skill/cases/<ns>/<skill>.md`
- **THEN** an identical file exists at `.claude/skills/skill/cases/<ns>/<skill>.md`

