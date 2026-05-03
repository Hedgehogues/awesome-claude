## MODIFIED Requirements

### Requirement: sdd:archive верифицирует merges-into capabilities

`sdd:archive` SHALL читать поле `merges-into` из `<change-dir>/.sdd.yaml` в шаге 7 и запускать L1/L2/L3 верификацию для каждой capability из этого поля, симметрично обработке `creates`. Текст шага 7 SHALL явно указывать оба поля: `creates` и `merges-into`.

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

При verify-ok `sdd:archive` SHALL обновить запись capability в `openspec/specs/index.yaml` для каждого имени из `.sdd.yaml.merges-into` через команду `_sdd_yaml.py update-index-description`. Значение `description` берётся из секции `### Modified Capabilities` в `proposal.md` текущего change. Поля `path` и `test_plan` не меняются.

#### Scenario: Обновление описания

- **WHEN** verify прошёл (verdict = passed)
- **WHEN** `proposal.md` содержит `- \`existing-cap\`: <новое описание>` в `### Modified Capabilities`
- **THEN** `index.yaml` содержит обновлённое `description: <новое описание>` для `existing-cap`
- **THEN** поля `path` и `test_plan` не изменены

#### Scenario: merges-into пуст

- **WHEN** `.sdd.yaml.merges-into` равен `[]`
- **THEN** шаг выполняется без действий

### Requirement: _sdd_yaml.py предоставляет команду update-index-description

`_sdd_yaml.py update-index-description <index-yaml-path> <capability> <description>` SHALL найти запись с `capability: <capability>` в секции `specs:` YAML-файла и обновить поле `description`. При отсутствии записи SHALL завершиться с exit code 2 и сообщением об ошибке.

#### Scenario: Успешное обновление

- **WHEN** `index.yaml` содержит capability `existing-cap`
- **THEN** `_sdd_yaml.py update-index-description openspec/specs/index.yaml existing-cap "Новое описание"` обновляет `description`
- **THEN** exit code 0, stdout: `updated description for capability 'existing-cap'`

#### Scenario: Capability не найдена

- **WHEN** `index.yaml` не содержит capability `missing-cap`
- **THEN** exit code 2, stderr содержит `not found`
