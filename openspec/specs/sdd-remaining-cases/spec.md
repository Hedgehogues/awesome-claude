## Purpose
Test cases for remaining sdd:* skills: audit, explore, repo, spec-verify, sync.
## Requirements
### Requirement: cases exist for audit, explore, repo, spec-verify, sync
`skills/skill/cases/sdd/` SHALL contain files `audit.md`, `explore.md`, `repo.md`, `spec-verify.md`, `sync.md`, each with at least two cases: happy path and missing/invalid input.

#### Scenario: each file exists and has cases
- **WHEN** `skill:test-skill sdd:<name>` is invoked for each of the five skills
- **THEN** the corresponding cases file is found (no SKIP output)
- **THEN** at least one case passes (contains or semantic checks satisfied)

