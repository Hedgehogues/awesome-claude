## ADDED Requirements

### Requirement: State-file location

`.sdd-state.yaml` SHALL располагаться в директории change'а: `openspec/changes/<change-name>/.sdd-state.yaml` — рядом с `proposal.md`, `tasks.md`, `.sdd.yaml`. Файл MUST быть один на change.

#### Scenario: Один change — один state-file

- **WHEN** пользователь работает с change `foo`
- **THEN** state-file для него находится только в `openspec/changes/foo/.sdd-state.yaml`; глобальных или сторонних реестров нет

### Requirement: State-file gitignored

Корневой `.gitignore` SHALL содержать паттерн `**/.sdd-state.yaml`. Файл MUST NOT попадать в git-индекс ни в одной директории репозитория.

#### Scenario: git status не показывает state-file

- **WHEN** sdd-скилл создал или обновил `.sdd-state.yaml` в активном change'е
- **THEN** `git status` не показывает этот файл как untracked или modified

### Requirement: State-file schema

`.sdd-state.yaml` SHALL содержать минимум поля: `stage` (одно из: `proposed | contradiction-ok | contradiction-failed | applying | verifying | verify-ok | verify-failed | archiving | archived | archive-failed`), `last_step_at` (ISO-8601 timestamp), `owner` (email).

Дополнительные поля по контексту: `verify_result` (`{total, failed, failed_tasks}` для verifying-стадий), `contradiction_last_run`, `contradiction_hard_issues`.

#### Scenario: Минимальный валидный state

- **WHEN** `/sdd:propose` создал свежий state-file
- **THEN** файл содержит как минимум `stage`, `last_step_at`, `owner`; парсится через `yaml.safe_load` без ошибок

### Requirement: State-file через Python-скрипт

Все операции чтения и записи `.sdd-state.yaml` SHALL выполняться через `skills/sdd/scripts/state.py`. Скрипт MUST поддерживать команды: `read <path>`, `update <path> <field> <value>`, `transition <path> <new-stage>`, `delete <path>`. SDD-скиллы MUST NOT парсить/писать YAML нативно.

#### Scenario: Update через скрипт

- **WHEN** sdd-скилл переходит на новую стадию
- **THEN** вызывает `python state.py transition <path> <stage>`, не использует Edit/Write для прямой правки YAML

### Requirement: At-first-touch создание

При обращении любого sdd-скилла к change-директории без существующего `.sdd-state.yaml` скрипт `state.py` SHALL создать файл с `stage: unknown` и текущим `last_step_at`. Это обеспечивает совместимость с change'ами, созданными до введения state-system.

#### Scenario: Старый change без state-file

- **WHEN** пользователь вызывает `/sdd:apply` на change'е, созданном до введения state-system (нет `.sdd-state.yaml`)
- **THEN** скрипт `state.py` создаёт файл со `stage: unknown`; скилл продолжает работу; следующий transition обновит stage на корректный

### Requirement: Удаление при success archive

`.sdd-state.yaml` SHALL удаляться через `state.py delete` **только** последним шагом успешного `/sdd:archive`. Файл MUST оставаться при любом fail на промежуточных стадиях для возможности resume.

#### Scenario: Resume после fail

- **WHEN** archive упал на spec-verify, state остался с `stage: archive-failed`, и пользователь через час запускает `/sdd:archive` повторно
- **THEN** скилл читает state, видит `archive-failed`, выводит red-banner и инструкцию по ручному восстановлению

### Requirement: Stage transition rules

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

Скилл MUST отвергать недопустимые переходы с явной ошибкой.

#### Scenario: Попытка архивировать с verify-failed

- **WHEN** state имеет `stage: verify-failed`, пользователь вызывает `/sdd:archive`
- **THEN** скилл отказывает с сообщением «verify failed, fix tasks and rerun /sdd:apply first»; transition не выполняется
