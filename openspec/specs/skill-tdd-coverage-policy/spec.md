## Purpose
Mandatory 4-category test coverage matrix for every skill: positive-happy, positive-corner, negative-missing-input, negative-invalid-input.
## Requirements
### Requirement: Each skill has minimum coverage matrix of 4 categories
Every skill SHALL have at least 4 test cases at `skills/skill/cases/<ns>/<skill>.md`, one per category:

| Category | Purpose |
|---|---|
| `positive-happy` | TDD-green: valid input, expected success path |
| `positive-corner` | boundary values (empty list, max, limit, edge of valid range) |
| `negative-missing-input` | TDD-red: required artifact absent |
| `negative-invalid-input` | input is malformed by type or schema |

Categories are detected by case name prefix (`## Case: positive-happy-...`) or explicit `category:` field in the case body.

#### Scenario: Skill with all 4 categories passes coverage check
- **WHEN** `cases/<ns>/<skill>.md` contains at least one case per category
- **THEN** `check-coverage-matrix.py` reports the skill as compliant

#### Scenario: Skill missing a category is flagged
- **WHEN** `cases/<ns>/<skill>.md` lacks any case in `negative-missing-input` category
- **THEN** `check-coverage-matrix.py` reports: "skill <ns>:<skill> is missing category: negative-missing-input"

### Requirement: skill:test-all reports coverage matrix gaps
After running all tests, `skill:test-all` SHALL invoke `check-coverage-matrix.py` and include a coverage section in the final report.

#### Scenario: Coverage report appended to test-all output
- **WHEN** `skill:test-all` finishes test execution
- **THEN** output contains a "Coverage matrix" section listing skills below 4-category threshold
- **THEN** if all skills are compliant, section reads: "Coverage matrix: all skills have 4 categories"

### Requirement: sdd:propose auto-generates 4-category stubs for new skills
When `sdd:propose` (or any skill-creation flow) registers a new skill in proposal.md, it SHALL auto-generate `cases/<ns>/<skill>.md` containing 4 stub cases — one per category — with placeholder stubs and `TODO:` semantic assertions.

#### Scenario: New skill triggers stub case generation
- **WHEN** proposal introduces new skill `dev:newthing`
- **THEN** `skills/skill/cases/dev/newthing.md` is created with 4 cases: `positive-happy-stub`, `positive-corner-stub`, `negative-missing-input-stub`, `negative-invalid-input-stub`
- **THEN** mirror is created at `.claude/skills/skill/cases/dev/newthing.md`

### Requirement: Coverage policy is documented as a rule
`rules/skill-tdd-coverage.md` SHALL document the 4-category matrix, the rationale (TDD red-green discipline applied to skill infra), and reference `check-coverage-matrix.py` as the enforcement mechanism.

#### Scenario: Developer reads the rule
- **WHEN** developer opens `rules/skill-tdd-coverage.md`
- **THEN** all 4 categories are listed with definitions and examples
- **THEN** rule is mirrored at `.claude/rules/skill-tdd-coverage.md`

### Requirement: Coverage scope stays at unit level
The 4-category matrix SHALL apply to **unit-level** behavior tests using stubs and mocks (per `mock-stubs-extended`). Integration tests (real services, real infrastructure) are explicitly out of scope of this policy and `skill:test-all` SHALL NOT enforce coverage for them.

#### Scenario: Integration coverage is not enforced
- **WHEN** `check-coverage-matrix.py` audits skills
- **THEN** only unit cases at `cases/<ns>/<skill>.md` are counted
- **THEN** integration test artifacts (if any) are ignored by the matrix check

