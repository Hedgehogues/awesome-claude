# sdd-state-archived-in-sdd Specification

## Purpose
TBD - created by archiving change sdd-state-merge-on-archive. Update Purpose after archive.
## Requirements
### Requirement: _sdd_yaml.py merge-state command exists

`skills/sdd/scripts/_sdd_yaml.py` SHALL содержать команду `merge-state <change-dir>`.

Команда:
- MUST читать `stage` и `last_step_at` из `<change-dir>/.sdd-state.yaml`
- MUST дописывать эти поля в `<change-dir>/.sdd.yaml`
- MUST NOT копировать поле `owner` из state
- Если `.sdd-state.yaml` отсутствует — MUST завершаться с exit 0, `.sdd.yaml` не трогается

#### Scenario: merge-state копирует stage и last_step_at

- **WHEN** вызывается `_sdd_yaml.py merge-state <change-dir>` и `.sdd-state.yaml` существует
- **THEN** `.sdd.yaml` содержит поля `stage` и `last_step_at` со значениями из state; поле `owner` не изменилось

#### Scenario: merge-state при отсутствующем state-файле

- **WHEN** вызывается `_sdd_yaml.py merge-state <change-dir>` и `.sdd-state.yaml` отсутствует
- **THEN** команда завершается с exit 0; `.sdd.yaml` не изменён

### Requirement: archived .sdd.yaml contains stage and last_step_at

После выполнения `merge-state` файл `<change-dir>/.sdd.yaml` SHALL содержать поля `stage` и `last_step_at` со значениями из `.sdd-state.yaml`.

Поле `owner` в `.sdd.yaml` MUST остаться прежним (не перезаписывается из state).

#### Scenario: поля stage и last_step_at присутствуют после merge-state

- **WHEN** `merge-state` выполнен успешно
- **THEN** `_sdd_yaml.py read <change-dir>` возвращает объект с полями `stage` и `last_step_at`; значение `owner` совпадает с исходным

#### Scenario: owner не перезаписывается

- **WHEN** owner в `.sdd.yaml` и owner в `.sdd-state.yaml` различаются
- **THEN** после `merge-state` owner в `.sdd.yaml` остаётся прежним (из `.sdd.yaml`), не заменяется значением из state

