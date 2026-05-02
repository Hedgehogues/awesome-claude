## MODIFIED Requirements

### Requirement: cases/sdd/change-verify.md exists with at least three cases

**DEPRECATED in this change.** Скилл `/sdd:change-verify` SHALL быть удалён в `merge-verify-into-apply-archive` — его L1/L2/L3 verify-логика инлайнится в `/sdd:apply` как обязательный шаг после реализации.

Capability `sdd-change-verify-cases` SHALL считаться устаревшей. Файл `skills/skill/cases/sdd/change-verify.md` MUST отсутствовать. Сценарии (passed / gaps_found / human_needed) SHALL переехать в capability `sdd-apply-cases` как ADDED Requirement.

#### Scenario: capability deprecated, file absent

- **WHEN** developer ищет тест-кейсы для verify-логики
- **THEN** файл `skills/skill/cases/sdd/change-verify.md` отсутствует
- **THEN** соответствующие сценарии находятся в `skills/skill/cases/sdd/apply.md` (Requirement из `sdd-apply-cases`)

#### Scenario: capability not used in new changes

- **WHEN** автор нового change рассматривает добавление в `sdd-change-verify-cases`
- **THEN** вместо этого добавляет в `sdd-apply-cases`; capability `sdd-change-verify-cases` deprecated
