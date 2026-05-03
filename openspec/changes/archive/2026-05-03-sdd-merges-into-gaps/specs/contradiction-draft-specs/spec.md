## MODIFIED Requirements

### Requirement: contradiction.py загружает draft-спеки для creates-capabilities

`contradiction.py` SHALL после основного цикла по `index.yaml` выполнять второй проход по полю `creates` из `.sdd.yaml`. Для каждой capability из `creates`, отсутствующей в `discovered_names` (т.е. ещё не в `index.yaml`), SHALL искать draft-спек в `openspec/changes/<name>/specs/<cap>/spec.md` и включать в пакет при нахождении.

#### Scenario: Новая capability с draft-спеком

- **WHEN** `.sdd.yaml.creates` содержит `new-cap`
- **WHEN** `new-cap` отсутствует в `openspec/specs/index.yaml`
- **WHEN** файл `openspec/changes/<name>/specs/new-cap/spec.md` существует
- **THEN** его содержимое включается в пакет с пометкой `[DRAFT]`
- **THEN** summary содержит счётчик `draft_specs_loaded: 1`

#### Scenario: creates capability уже в index.yaml

- **WHEN** capability из `creates` уже присутствует в `index.yaml`
- **THEN** второй проход пропускает её (live spec уже загружен основным циклом)
- **THEN** дубля в пакете нет

#### Scenario: draft-спек отсутствует

- **WHEN** capability из `creates` не в `index.yaml` и файл в `specs/` не найден
- **THEN** capability перечисляется в секции `skipped` с причиной `draft spec not found`

### Requirement: contradiction.py не содержит dead code relevant_names

`contradiction.py` SHALL NOT содержать вычисление переменной `relevant_names`. Переменная должна быть удалена.

#### Scenario: Код после изменения

- **WHEN** читаем `contradiction.py`
- **THEN** строк с `relevant_names` нет
- **THEN** основной цикл по `all_specs` выполняется без фильтрации (full scan)
