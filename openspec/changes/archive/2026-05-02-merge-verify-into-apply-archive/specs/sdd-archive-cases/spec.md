## ADDED Requirements

### Requirement: cases/sdd/archive.md содержит сценарии inline spec-verify

`skills/skill/cases/sdd/archive.md` SHALL дополнительно содержать три сценария для inline L1/L2/L3 spec-verify, который теперь часть `/sdd:archive` (приехало из удалённой capability `sdd-spec-verify-cases` — её до этого не существовало как отдельной spec'и, но логика была в `sdd-remaining-cases`):

1. **passed** — все Requirements live spec'ов прошли L1+L2+L3, `/sdd:archive` завершается успешно, `.sdd-state.yaml` удаляется.
2. **REMOVED-инверсия** — spec содержит `## REMOVED Requirements`, артефакт физически отсутствует, L1 inverted pass, verdict `done`.
3. **archive-fail с red-banner** — spec-verify обнаружил `missing` Requirement после merge specs, `/sdd:archive` выводит red-banner и останавливается без авто-rollback, state остаётся `archive-failed`, `.sdd-state.yaml` НЕ удаляется.

#### Scenario: passed — все ADDED Requirements done

- **WHEN** `skill:test-skill sdd:archive` runs with stub `change-with-sdd-yaml` где все артефакты для ADDED Requirements существуют и содержательны
- **THEN** archive completes
- **THEN** state переходит в `archived`
- **THEN** `.sdd-state.yaml` удалён

#### Scenario: REMOVED-инверсия — файл отсутствует

- **WHEN** stub содержит spec с `## REMOVED Requirements` упоминанием удалённого файла, и файл физически отсутствует
- **THEN** verdict для этого Requirement = `done` (L1 inverted pass)
- **THEN** archive completes

#### Scenario: archive-fail — red-banner

- **WHEN** spec-verify обнаружил `missing` Requirement после merge specs в `openspec/specs/`
- **THEN** output содержит red-banner с текстом `🔴 SPECS MODIFIED — manual rollback required` и инструкциями `git restore openspec/specs/` или `/sdd:propose`
- **THEN** state остаётся `archive-failed`
- **THEN** `.sdd-state.yaml` НЕ удалён
- **THEN** файлы в `openspec/specs/` НЕ откатываются автоматически
