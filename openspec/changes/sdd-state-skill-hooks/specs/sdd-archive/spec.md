## MODIFIED Requirements

### Requirement: Inline spec-verification

`/sdd:archive` SHALL выполнять L1/L2/L3 верификацию реализации против live `spec.md` после merge specs в `openspec/specs/`, до удаления `.sdd-state.yaml`. Отдельная команда `/sdd:spec-verify` MUST NOT существовать.

После inline spec-verify скилл SHALL записать результат в `.sdd-state.yaml.verify_status` (`ok` если verdict=passed, `failed` если verdict=gaps_found, `n/a` если verify не запускался). Hook читает это поле для выбора transition (`archived` vs `archive-failed`).

#### Scenario: Успешный archive с прохождением spec-verify

- **WHEN** пользователь вызывает `/sdd:archive <change-name>` и все Requirements из live spec'ов прошли L1+L2+L3
- **THEN** скилл архивирует change, прогоняет inline spec-verify
- **THEN** скилл записывает `verify_status: ok` в `.sdd-state.yaml`
- **THEN** PostToolUse hook transitions state в `archived` и hook ИЛИ скилл удаляет `.sdd-state.yaml` после transition

#### Scenario: Spec-verify fail после merge specs

- **WHEN** specs уже merged в `openspec/specs/`, но verify обнаружил `missing` или `partial` Requirements
- **THEN** скилл записывает `verify_status: failed`, выводит red-banner с двумя опциями (`git restore openspec/specs/` или новый change через `/sdd:propose`)
- **THEN** PostToolUse hook transitions state в `archive-failed`
- **THEN** `.sdd-state.yaml` MUST оставаться (НЕ удаляется при archive-failed)

### Requirement: Финальное удаление state-file

`/sdd:archive` SHALL удалять `.sdd-state.yaml` через `skills/sdd/scripts/state.py delete` ПОСЛЕ того как hook успешно перевёл state в `archived`. Удаление MUST быть последним действием. Если verify_status=failed и hook поставил `archive-failed` — `.sdd-state.yaml` MUST оставаться.

`skill.md` MUST NOT содержать прямых `state.py transition archived` вызовов — это работа hook'а.

#### Scenario: Удаление при success

- **WHEN** verify_status=ok, hook поставил state в `archived`
- **THEN** скилл (или follow-up hook) вызывает `state.py delete <path>`
- **THEN** `.sdd-state.yaml` отсутствует

#### Scenario: Сохранение при fail

- **WHEN** verify_status=failed, hook поставил state в `archive-failed`
- **THEN** `.sdd-state.yaml` НЕ удаляется
