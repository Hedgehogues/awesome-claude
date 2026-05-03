## MODIFIED Requirements

### Requirement: Change directory contains test-plan.md with YAML front matter and markdown body
Skill-change SHALL include a `test-plan.md` file with YAML front matter (fields: `approach`, `acceptance_criteria`) and a markdown body with `## Scenarios`. A change is a skill-change if `proposal.md` mentions creation of `skills/<ns>/<skill>/skill.md` under `## What Changes` or `## Capabilities → New Capabilities`. `sdd:apply` creates the stub automatically before executing the first task. Non-skill changes do NOT get `test-plan.md`. Existing changes without `test-plan.md` continue to work.

#### Scenario: New skill-change is applied
- **WHEN** `sdd:apply` starts implementing a change that mentions `skills/<ns>/<skill>/skill.md` in proposal.md
- **THEN** `openspec/changes/<name>/test-plan.md` is created before the first task
- **THEN** file has YAML front matter with fields: `approach`, `acceptance_criteria`
- **THEN** file has markdown body with `## Scenarios` section

#### Scenario: New non-skill change is proposed
- **WHEN** author creates a new change via `sdd:propose` and proposal.md does NOT mention `skills/` paths
- **THEN** `openspec/changes/<name>/test-plan.md` does NOT exist after propose
- **THEN** `sdd:propose` does not create test-plan.md

#### Scenario: test-plan.md is missing at archive time for skill-change
- **WHEN** `sdd:archive` checks a skill-change directory and `test-plan.md` is absent
- **THEN** archive is blocked with: "test-plan.md is missing — required before archiving"

#### Scenario: test-plan.md front matter has unfilled fields at archive time
- **WHEN** `sdd:archive` checks `test-plan.md` and YAML front matter fields contain only stub content
- **THEN** archive warns: "test-plan.md appears unfilled" and prompts author to confirm

## REMOVED Requirements

### Requirement: sdd:propose creates test-plan.md stub
**Reason**: test-plan.md is skill-specific; sdd:propose is a general SDD artifact and should not know about skill structure.
**Migration**: test-plan.md is now created by `sdd:apply` when it detects a skill-change.
