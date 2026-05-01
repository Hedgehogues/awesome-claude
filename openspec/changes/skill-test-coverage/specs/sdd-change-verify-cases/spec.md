## ADDED Requirements

### Requirement: cases/sdd/change-verify.md exists with at least three cases
`skills/skill/cases/sdd/change-verify.md` SHALL exist with cases covering: all tasks done (passed verdict), missing artifact (gaps_found verdict), and human_needed task.

#### Scenario: all tasks done → passed
- **WHEN** `skill:test-skill sdd:change-verify` runs with stub `change-with-sdd-yaml` where all tasks are checked
- **THEN** output contains "verdict: passed"
- **THEN** output contains summary with "missing: 0"

#### Scenario: missing artifact → gaps_found
- **WHEN** stub has an unchecked task referencing a file that does not exist
- **THEN** output contains "verdict: gaps_found"
- **THEN** output contains the missing artifact path

#### Scenario: human_needed task
- **WHEN** stub has a task requiring live skill invocation
- **THEN** output contains "human_needed" with a concrete verification step
