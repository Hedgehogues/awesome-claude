# Proposal: Fix merges-into gaps in sdd:archive and contradiction.py

## Why

В ходе анализа `.sdd.yaml` и скиллов обнаружены два несоответствия между намерением и реализацией.

**Пробел 1 — `sdd:archive` не обрабатывает `merges-into`.**
Спек `sdd-propose-merge-dialog` явно говорит: «Изменения index.yaml — ответственность `/sdd:apply` (для новых capabilities) и `/sdd:archive` (для `merges-into`)». В `archive/skill.md` шаг 7 читает только `.sdd.yaml.creates` — `merges-into` игнорируется. Capabilities, которые change модифицирует, не верифицируются (L1/L2/L3 не запускается) и их запись в `index.yaml` не обновляется.

**Пробел 2 — `contradiction.py` содержит dead code и не загружает draft-спеки.**
Переменная `relevant_names = creates | merges_into | discovered_names` вычисляется, но в цикл загрузки не передаётся — loop итерирует `all_specs` без фильтрации. Дополнительно: capabilities из `creates` (новые, ещё не в `index.yaml`) не загружаются из локальных `openspec/changes/<name>/specs/<cap>/spec.md` — только из live `openspec/specs/`. Contradiction не видит draft-спеки текущего change.

## What Changes

- `skills/sdd/archive/skill.md` шаг 7: добавить обработку `merges-into` — читать capabilities из `.sdd.yaml.merges-into`, запускать L1/L2/L3 верификацию против `openspec/specs/<cap>/spec.md` (уже merged), обновлять описание capability в `index.yaml` при verify-ok
- `skills/sdd/contradiction/scripts/contradiction.py`: убрать dead code (`relevant_names`); добавить второй проход по `creates` — загружать `openspec/changes/<name>/specs/<cap>/spec.md` для capabilities, которых нет в `index.yaml`, с пометкой `(draft)` в пакете

## Capabilities

### New Capabilities

- `archive-merges-into-support`: `sdd:archive` верифицирует capabilities из `merges-into` через L1/L2/L3 против live spec.md и обновляет их запись в `index.yaml` при verify-ok, симметрично с обработкой `creates`
- `contradiction-draft-specs`: `contradiction.py` загружает draft-спеки из директории change для `creates`-capabilities, отсутствующих в `index.yaml`; удаляет dead code `relevant_names`

### Modified Capabilities

- `contradiction-full-scan`: scope расширяется — включает draft-спеки из `openspec/changes/<name>/specs/` наравне с live specs из `openspec/specs/`

See `.sdd.yaml` for capability declarations.
