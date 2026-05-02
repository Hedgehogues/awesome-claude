## MODIFIED Requirements

### Requirement: cases exist for audit, explore, repo, spec-verify, sync

`skills/skill/cases/sdd/` SHALL contain files `audit.md`, `explore.md`, `repo.md`, `sync.md`, each with at least two cases: happy path and missing/invalid input.

Скилл `spec-verify` удалён в этом change'е (его логика инлайнится в `/sdd:archive`); сценарии для spec-verify переезжают в capability `sdd-archive-cases` как ADDED Requirement. Файл `cases/sdd/spec-verify.md` MUST отсутствовать после применения этого change'а.

#### Scenario: each file exists and has cases

- **WHEN** `skill:test-skill sdd:<name>` is invoked for each of the four skills (audit, explore, repo, sync)
- **THEN** the corresponding cases file is found (no SKIP output)
- **THEN** at least one case passes (contains or semantic checks satisfied)

#### Scenario: spec-verify case file removed

- **WHEN** developer searches for `skills/skill/cases/sdd/spec-verify.md`
- **THEN** file is absent (skill removed in change merge-verify-into-apply-archive)
