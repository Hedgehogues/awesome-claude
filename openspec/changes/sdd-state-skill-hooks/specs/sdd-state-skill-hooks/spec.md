## ADDED Requirements

### Requirement: PostToolUse hook на матчер Skill

`.claude/settings.json` SHALL содержать `PostToolUse` hook с матчером `Skill`, который вызывает `skills/sdd/scripts/state_hook.py`. Hook MUST срабатывать только на Skill events, не на Bash/Edit/Write.

#### Scenario: Hook срабатывает после Skill tool

- **WHEN** модель вызывает Skill tool с `tool_input.skill = "sdd:apply"`
- **THEN** harness после завершения Skill tool вызывает `state_hook.py` с JSON на stdin

#### Scenario: Hook не срабатывает на Bash

- **WHEN** модель вызывает Bash tool
- **THEN** `state_hook.py` НЕ вызывается

### Requirement: state_hook.py резолвит change-name

`skills/sdd/scripts/state_hook.py` SHALL резолвить current change-name через приоритет:

1. Аргумент скилла (`tool_input.args` парсится на change-name).
2. Fallback: поиск `openspec/changes/<X>/.sdd-state.yaml` с самой свежей `last_step_at`.
3. Если не найдено — exit 0 с warning в stderr.

#### Scenario: Резолв через явный аргумент

- **WHEN** Skill вызвана с `args = "my-change"`
- **THEN** state_hook.py использует `openspec/changes/my-change/.sdd-state.yaml`

#### Scenario: Fallback на freshest state-file

- **WHEN** Skill вызвана без change-name в args, но есть `openspec/changes/foo/.sdd-state.yaml` с last_step_at = now
- **THEN** state_hook.py использует `foo` как current change

#### Scenario: Нерезолвенный change

- **WHEN** ни args, ни freshest state-file не находятся
- **THEN** state_hook.py выводит warning в stderr и exit 0 (не валит harness)

### Requirement: state_hook.py маппит skill→stage

state_hook.py SHALL маппить имя скилла на target stage по таблице:

| Skill | Target stage |
|---|---|
| `sdd:propose` | `proposed` |
| `sdd:contradiction` | `contradiction-ok` если `verify_status: ok`, иначе `contradiction-failed` |
| `sdd:apply` | `verify-ok` если `verify_status: ok`; `verify-failed` если `failed`; `applying` иначе |
| `sdd:archive` | `archived` если `verify_status: ok`; `archive-failed` если `failed`; `archiving` иначе |

#### Scenario: apply с verify_status=ok

- **WHEN** state.verify_status = ok после `sdd:apply`
- **THEN** state_hook.py вызывает `state.py transition <path> verify-ok`

#### Scenario: archive с verify_status=failed

- **WHEN** state.verify_status = failed после `sdd:archive`
- **THEN** state_hook.py вызывает `state.py transition <path> archive-failed`

### Requirement: Hook fail soft

state_hook.py SHALL exit 0 во всех ошибочных сценариях (включая нерезолвенный change, отсутствующий state-file, отвергнутый transition). Ошибки идут в stderr.

#### Scenario: state-file отсутствует

- **WHEN** state-file для current change ещё не создан
- **THEN** state_hook.py создаёт файл at-first-touch и применяет transition

#### Scenario: невалидный transition

- **WHEN** state в stage `verify-ok`, hook пытается transition в `applying` (не разрешено)
- **THEN** state_hook.py выводит ошибку в stderr и exit 0

### Requirement: Hook не дублирует skill.md

`skill.md` файлы (apply/archive/propose/contradiction) MUST NOT содержать ручных `state.py transition` команд. Эти команды заменены работой hook'а.

#### Scenario: skill.md без transition команд

- **WHEN** разработчик читает любой sdd-скилл
- **THEN** в теле скилла нет строк `python3 ... state.py transition ...`
- **THEN** есть только `state.py update verify_status <ok|failed>` (для скиллов с verify-этапом)
