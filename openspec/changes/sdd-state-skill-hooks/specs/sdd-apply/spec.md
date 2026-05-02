## MODIFIED Requirements

### Requirement: Inline tasks-verification

`/sdd:apply` SHALL выполнять L1/L2/L3 верификацию реализации против `tasks.md` как обязательный шаг после фазы реализации, до обновления `openspec/specs/index.yaml`. Отдельная команда `/sdd:change-verify` MUST NOT существовать.

После inline verify скилл SHALL записать результат в `.sdd-state.yaml.verify_status` (значения: `ok` если verdict=passed, `failed` если verdict=gaps_found, `n/a` если verify не запускался). Это поле читается hook'ом для выбора финального transition.

#### Scenario: Успешный apply с прохождением verify

- **WHEN** пользователь вызывает `/sdd:apply <change-name>` и все задачи в `tasks.md` имеют корректные артефакты (L1+L2+L3 pass)
- **THEN** скилл реализует задачи, прогоняет inline-verify, выводит отчёт `verdict: passed`, обновляет `openspec/specs/index.yaml` для capabilities из `creates:` в `.sdd.yaml`
- **THEN** скилл записывает `verify_status: ok` в `.sdd-state.yaml`
- **THEN** PostToolUse hook читает `verify_status` и transitions state в `verify-ok`

#### Scenario: Verify обнаружил недостающий артефакт

- **WHEN** после реализации хотя бы одна задача из `tasks.md` имеет статус `missing` или `partial`
- **THEN** скилл выводит отчёт с секцией `--- Gaps ---`, записывает `verify_status: failed` в `.sdd-state.yaml`, MUST NOT обновлять `openspec/specs/index.yaml`, останавливается с инструкцией пофиксить и перезапустить `/sdd:apply`
- **THEN** PostToolUse hook читает `verify_status` и transitions state в `verify-failed`

### Requirement: State-update на каждом подшаге

`/sdd:apply` SHALL обновлять `.sdd-state.yaml.verify_status` через `skills/sdd/scripts/state.py` ПЕРЕД своим завершением. State-transition (`applying → verifying → verify-ok|verify-failed`) выполняется автоматически hook'ом на основе `verify_status` — `skill.md` MUST NOT содержать прямых `state.py transition` вызовов.

#### Scenario: Skill записывает verify_status и завершается

- **WHEN** `/sdd:apply` завершает inline verify
- **THEN** скилл вызывает `state.py update <path> verify_status <ok|failed>`
- **THEN** скилл MUST NOT вызывать `state.py transition` сам — это работа hook'а
