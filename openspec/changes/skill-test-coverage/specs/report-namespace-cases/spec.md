## ADDED Requirements

### Requirement: cases/report/ directory exists with one file per report skill
`skills/skill/cases/report/` SHALL exist and contain `describe.md` and `session-report.md`, each with at least two cases.

#### Scenario: report namespace cases discoverable
- **WHEN** `skill:test-skill report:<name>` is invoked
- **THEN** cases file found, at least one case runs
