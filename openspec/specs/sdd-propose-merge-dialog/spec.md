# sdd-propose-merge-dialog Specification

## Purpose
TBD - created by archiving change merge-verify-into-apply-archive. Update Purpose after archive.
## Requirements
### Requirement: Detection пересечений creates с index.yaml

`/sdd:propose` SHALL после генерации `.sdd.yaml` сравнивать поле `creates:` с `capability:` записями в `openspec/specs/index.yaml`. Для каждого пересечения MUST зафиксировать конфликт и предложить пользователю выбор.

#### Scenario: Все capabilities новые

- **WHEN** `creates: [foo-cap, bar-cap]` в `.sdd.yaml`, и в `index.yaml` нет ни `foo-cap`, ни `bar-cap`
- **THEN** скилл продолжает без диалога

#### Scenario: Одна capability существует

- **WHEN** `creates: [existing-cap, new-cap]` в `.sdd.yaml`, и `index.yaml` содержит `capability: existing-cap`
- **THEN** скилл вызывает merge-dialog для `existing-cap`; `new-cap` остаётся в `creates:` без диалога

### Requirement: Merge-dialog interactive

При обнаружении пересечения `/sdd:propose` SHALL вызвать AskUserQuestion с двумя опциями для каждого конфликтующего имени:

- **«Оставить в creates»** — capability будет создаваться как новая (предупредить, что это конфликт с существующей spec'ой и приведёт к проблемам при архивации).
- **«Переключить в merges-into»** — расширение существующей capability; имя уезжает из `creates:` в `merges-into:` в `.sdd.yaml`.

Скилл MUST NOT принимать решение молча.

#### Scenario: Пользователь выбирает merges-into

- **WHEN** detected конфликт по `existing-cap`, пользователь выбирает «Переключить в merges-into»
- **THEN** скилл обновляет `.sdd.yaml`: `creates:` → без `existing-cap`, `merges-into:` → с добавлением `existing-cap`

#### Scenario: Пользователь оставляет в creates

- **WHEN** detected конфликт по `existing-cap`, пользователь выбирает «Оставить в creates»
- **THEN** скилл выводит warning «namespace clash может вызвать проблемы при `/sdd:archive`», но не меняет `.sdd.yaml`; продолжает workflow

### Requirement: Multiple intersections в одном change

Если `creates:` содержит несколько capability'ей, существующих в `index.yaml`, `/sdd:propose` SHALL вызвать AskUserQuestion **для каждой** последовательно. Не объединять в один вопрос.

#### Scenario: Два пересечения

- **WHEN** `creates: [cap-a, cap-b, cap-c]`, и `index.yaml` содержит и `cap-a`, и `cap-b`
- **THEN** скилл задаёт два отдельных вопроса (для `cap-a` и для `cap-b`), результаты применяются независимо

### Requirement: Update .sdd.yaml через скрипт

При изменении `creates:` или `merges-into:` в результате merge-dialog `/sdd:propose` SHALL использовать скрипт для обновления YAML, а не Edit-tool. Скрипт может быть тем же `state.py` или отдельным `sdd_yaml.py` — главное, что нативная правка YAML запрещена по claude-way.

#### Scenario: Перенос cap из creates в merges-into

- **WHEN** пользователь выбрал «Переключить в merges-into» для `existing-cap`
- **THEN** скилл вызывает Python-скрипт с командой типа `move-capability <path> existing-cap creates merges-into`, не правит YAML напрямую

### Requirement: Index.yaml read-only в propose

`/sdd:propose` MUST NOT изменять `openspec/specs/index.yaml` ни при каких сценариях merge-dialog. Изменения index.yaml — ответственность `/sdd:apply` (для новых capabilities) и `/sdd:archive` (для merges-into).

#### Scenario: Read-only доступ

- **WHEN** скилл проверяет пересечения с `index.yaml`
- **THEN** только читает файл; запись запрещена; нет shell-команд `>` или `>>` на этот файл из propose

