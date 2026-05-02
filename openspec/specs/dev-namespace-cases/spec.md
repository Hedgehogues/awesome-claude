## Purpose
Test cases for all dev:* skills covering the full dev namespace.
## Requirements
### Requirement: cases/dev/ directory exists with one file per dev skill
`skills/skill/cases/dev/` SHALL exist and contain one `.md` file per skill in `skills/dev/` (excluding `bump-version.md`): `commit.md`, `dead-features.md`, `deploy.md`, `fix-bug.md`, `fix-tests.md`, `init-repo.md`, `tdd.md`, `test-all.md`, `tracing.md`. Each file SHALL have at least two cases.

#### Scenario: dev namespace cases discoverable
- **WHEN** `skill:test-skill dev:<name>` is invoked for any dev skill
- **THEN** the cases file is found (no SKIP)
- **THEN** at least one case runs without error

