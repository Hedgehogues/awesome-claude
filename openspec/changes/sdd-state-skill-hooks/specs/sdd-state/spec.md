## MODIFIED Requirements

### Requirement: State-file schema

`.sdd-state.yaml` SHALL содержать минимум поля: `stage` (одно из: `proposed | contradiction-ok | contradiction-failed | applying | verifying | verify-ok | verify-failed | archiving | archived | archive-failed | unknown`), `last_step_at` (ISO-8601 timestamp), `owner` (email).

Дополнительные поля по контексту:
- `verify_status` (`ok | failed | n/a`) — side-channel для PostToolUse hook'а; пишется скиллами apply/archive/contradiction после inline verify; читается hook'ом для выбора финального transition.
- `verify_result` (`{total, failed, failed_tasks}` для verifying-стадий)
- `contradiction_last_run`, `contradiction_hard_issues`

#### Scenario: Минимальный валидный state

- **WHEN** `/sdd:propose` создал свежий state-file
- **THEN** файл содержит как минимум `stage`, `last_step_at`, `owner`; парсится через `yaml.safe_load` без ошибок

#### Scenario: verify_status side-channel для hook

- **WHEN** `/sdd:apply` завершает inline verify с verdict=passed
- **THEN** скилл записывает `verify_status: ok` в `.sdd-state.yaml`
- **THEN** PostToolUse hook читает поле и выбирает transition `verify-ok` (вместо `verify-failed`)

### Requirement: State transition rules

State-machine transitions SHALL следовать правилам:

- `proposed` → `contradiction-ok` | `contradiction-failed`
- `contradiction-ok` → `applying`
- `contradiction-failed` → `proposed` (после правок) или `contradiction-ok` (после повторного контроля)
- `applying` → `verifying`
- `verifying` → `verify-ok` | `verify-failed`
- `verify-failed` → `applying` (после правок)
- `verify-ok` → `archiving`
- `archiving` → `archived` | `archive-failed`
- `archived` → файл удалён
- `archive-failed` → `archiving` | `archived`

`state.py transition` MUST отвергать недопустимые переходы. PostToolUse hook MUST использовать `state.py transition` (соблюдает правила) — если hook'у нужен переход, не разрешённый из текущего state, hook MUST exit 0 с warning, не валит harness.

#### Scenario: Hook соблюдает state-machine

- **WHEN** state в `verify-ok`, PostToolUse hook после `/sdd:archive` пытается `transition archiving`
- **THEN** state.py разрешает (verify-ok → archiving в whitelist)
- **THEN** hook продолжает workflow

#### Scenario: Hook fails soft на невалидном transition

- **WHEN** state в `archived`, hook после `/sdd:apply` пытается `transition applying`
- **THEN** state.py отвергает (archived → applying не в whitelist)
- **THEN** hook выводит stderr message и exit 0 (не валит harness)
