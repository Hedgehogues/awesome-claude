## ADDED Requirements

### Requirement: cases/sdd/apply.md содержит сценарии inline-verify

`skills/skill/cases/sdd/apply.md` SHALL дополнительно содержать три сценария для inline L1/L2/L3 verify, который теперь часть `/sdd:apply` (приехало из удалённой capability `sdd-change-verify-cases`):

1. **passed** — все задачи в `tasks.md` имеют корректные артефакты (L1+L2+L3 pass), `/sdd:apply` завершается verdict `passed`, `index.yaml` обновляется.
2. **gaps_found** — хотя бы одна задача имеет статус `missing` или `partial`, `/sdd:apply` останавливается с verdict `gaps_found`, state переходит в `verify-failed`, `index.yaml` НЕ обновляется.
3. **human_needed** — есть задача, требующая live-запуска или визуальной проверки; verdict `human_needed`, `/sdd:apply` выводит конкретные шаги ручной проверки.

#### Scenario: passed — все задачи done

- **WHEN** `skill:test-skill sdd:apply` runs with stub `change-with-sdd-yaml` где все задачи `tasks.md` отмечены `[x]` и артефакты существуют
- **THEN** output содержит `verdict: passed`
- **THEN** state переходит в `verify-ok`
- **THEN** запись в `openspec/specs/index.yaml` для capabilities из `creates:` обновлена

#### Scenario: gaps_found — missing artifact

- **WHEN** stub содержит unchecked task ссылающуюся на несуществующий файл
- **THEN** output содержит `verdict: gaps_found`
- **THEN** state переходит в `verify-failed`
- **THEN** `openspec/specs/index.yaml` НЕ модифицируется

#### Scenario: human_needed — task requires live run

- **WHEN** stub содержит task требующую live-запуска skill'а
- **THEN** output содержит `human_needed` с конкретным шагом проверки
- **THEN** state может перейти в `verify-ok` (human_needed не блокирует, если нет gaps)
