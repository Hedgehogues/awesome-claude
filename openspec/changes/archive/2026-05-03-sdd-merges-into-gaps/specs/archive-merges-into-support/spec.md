## MODIFIED Requirements

### Requirement: sdd:archive верифицирует merges-into capabilities

`sdd:archive` SHALL читать поле `merges-into` из `<change-dir>/.sdd.yaml` в шаге 7 и запускать L1/L2/L3 верификацию для каждой capability из этого поля, симметрично обработке `creates`.

#### Scenario: Change с непустым merges-into

- **WHEN** `sdd:archive` выполняет шаг 7 верификации
- **WHEN** `.sdd.yaml.merges-into` содержит одну или более capabilities
- **THEN** для каждой capability из `merges-into` выполняется L1/L2/L3 верификация против `openspec/specs/<cap>/spec.md`
- **THEN** вердикт (passed / gaps_found / human_needed) учитывается наравне с `creates`

#### Scenario: Verify-fail для merges-into

- **WHEN** L1/L2/L3 для capability из `merges-into` возвращает `gaps_found`
- **THEN** выводится red-banner: `🔴 SPECS MODIFIED — manual rollback required`
- **THEN** state переходит в `archive-failed`
- **THEN** выполнение останавливается

### Requirement: sdd:archive обновляет index.yaml для merges-into

При verify-ok `sdd:archive` SHALL обновить запись capability в `openspec/specs/index.yaml` для каждого имени из `.sdd.yaml.merges-into`. Обновляется поле `description` — значение берётся из секции `### Modified Capabilities` в `proposal.md` текущего change (inline-описание после имени capability). Поля `path` и `test_plan` не меняются (запись уже существует).

#### Scenario: Обновление описания

- **WHEN** verify прошёл для capability `existing-cap` из `merges-into`
- **WHEN** `proposal.md` содержит `- \`existing-cap\`: <новое описание>` в `### Modified Capabilities`
- **THEN** `index.yaml` содержит обновлённое `description: <новое описание>` для `existing-cap`
- **THEN** поля `path` и `test_plan` не изменены

#### Scenario: merges-into пуст

- **WHEN** `.sdd.yaml.merges-into` равен `[]`
- **THEN** шаг выполняется без действий; verify-ok для creates не затрагивается
