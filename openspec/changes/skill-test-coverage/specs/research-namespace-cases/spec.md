## ADDED Requirements

### Requirement: cases/research/ directory exists with one file per research skill
`skills/skill/cases/research/` SHALL exist and contain `triz.md` with at least two cases.

#### Scenario: research namespace cases discoverable
- **WHEN** `skill:test-skill research:triz` is invoked
- **THEN** cases file found, at least one case runs
