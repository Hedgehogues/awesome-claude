## ADDED Requirements

### Requirement: placement detector checks change-directory self-compliance
`sdd:contradiction` placement detector (3.7) SHALL run a self-compliance sub-check in change-directory mode: for each Requirement in `specs/**/spec.md` whose subject is the change directory (identified by body patterns `every new change SHALL`, `change directory SHALL contain`, `sdd:propose creates`), check whether the required artifact exists in the change directory. Flag violations with severity `warning`.

Exceptions — do NOT flag if any of the following apply:
1. The Requirement body contains a temporal-scope marker: `only after implementing`, `applies to new changes after`, or equivalent.
2. The `design.md` of the change contains a `## Migration Plan` section that explicitly states the requirement does not apply retroactively.
3. The Requirement subject is a skill or tool (e.g. `sdd:archive SHALL copy`), not the change directory itself.

#### Scenario: required artifact absent — no Migration Plan
- **WHEN** a Requirement in specs says "every new change SHALL include `test-plan.md`"
- **AND** the change directory does not contain `test-plan.md`
- **AND** no temporal-scope marker or Migration Plan exclusion applies
- **THEN** detector emits:
  `[warning] placement: self-compliance: 'test-plan.md' required by Requirement '<name>' (specs/<path>/spec.md) but absent from change directory`

#### Scenario: Migration Plan excludes the check
- **WHEN** `design.md` contains `## Migration Plan` with text "Новые требования применяются только к новым changes" or equivalent
- **THEN** detector does NOT flag self-compliance violations for this change

#### Scenario: temporal scope marker in Requirement body
- **WHEN** Requirement body contains "only after implementing this capability" or "applies to new changes created after"
- **THEN** detector does NOT flag

#### Scenario: Requirement subject is skill behavior, not change directory
- **WHEN** Requirement says "`sdd:archive` SHALL copy `test-plan.md` to `openspec/specs/<capability>/`"
- **AND** the subject is the skill's action, not the presence of a file in the change directory
- **THEN** detector does NOT flag
