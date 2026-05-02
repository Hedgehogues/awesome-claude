## ADDED Requirements

### Requirement: Change directory contains test-plan.md with YAML front matter and markdown body
Every new change created after implementing this capability SHALL include a `test-plan.md` file combining YAML front matter for structured fields and a markdown body for scenarios. `sdd:propose` creates the stub automatically. Existing changes without `test-plan.md` continue to work.

```markdown
---
approach: |
  Describe test approach here
acceptance_criteria:
  - criterion one
  - criterion two
---

## Scenarios

Describe scenarios in prose here.
```

#### Scenario: New change is created
- **WHEN** author creates a new change via `sdd:propose`
- **THEN** `openspec/changes/<name>/test-plan.md` exists
- **THEN** file has YAML front matter with fields: `approach`, `acceptance_criteria`
- **THEN** file has markdown body with `## Scenarios` section

#### Scenario: test-plan.md is missing at archive time
- **WHEN** `sdd:archive` checks the change directory and `test-plan.md` is absent
- **THEN** archive is blocked with: "test-plan.md is missing — required before archiving"

#### Scenario: test-plan.md front matter has unfilled fields at archive time
- **WHEN** `sdd:archive` checks `test-plan.md` and YAML front matter fields contain only stub content
- **THEN** archive warns: "test-plan.md appears unfilled" and prompts author to confirm

### Requirement: sdd:apply reads test-plan.md as context
When implementing a change, `sdd:apply` SHALL include `test-plan.md` as context so Claude knows what tests to write.

#### Scenario: apply reads test-plan
- **WHEN** `sdd:apply` starts implementing a change
- **THEN** `test-plan.md` is read alongside `specs/` and `design.md`
- **THEN** generated tests align with `acceptance_criteria` and `## Scenarios` in `test-plan.md`

### Requirement: sdd:archive copies test-plan.md to specs
When archiving, `sdd:archive` SHALL copy `test-plan.md` from the change directory to `openspec/specs/<capability>/test-plan.md`.

#### Scenario: archive copies test-plan
- **WHEN** `sdd:archive` archives change `<name>`
- **THEN** `openspec/specs/<capability>/test-plan.md` exists and matches the change file
