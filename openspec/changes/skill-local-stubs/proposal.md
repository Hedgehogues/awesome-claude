## Why

Сейчас все стабы лежат в `skills/skill/test-skill/stubs/` и используются всеми скиллами через `skill:test-skill`. Это создаёт ложное ощущение shared state: стабы не принадлежат скиллам, которые их используют, и нельзя адаптировать стаб под конкретный скилл (например, добавить исходный код для `dev:tracing`) без влияния на всех остальных.

## What Changes

- **BREAKING** Стабы переносятся к скиллам: `skills/<ns>/<skill>/stubs/<name>.md` — новое каноническое место.
- Глобальный пул `skills/skill/test-skill/stubs/` остаётся как **starter kit** — шаблоны при создании нового скилла, не shared source of truth.
- `run_test.py` и `skill:test-skill` ищут стаб в двух местах: сначала `skills/<ns>/<skill>/stubs/<name>.md`, затем fallback на `skills/skill/test-skill/stubs/<name>.md`.
- Расхождение между локальной копией стаба и глобальным шаблоном — **намеренное и ожидаемое**, синхронизация не требуется.
- Добавить D7 в `design.md` спеки `skill-test-runner-script`: зафиксировать модель владения стабами.

See `.sdd.yaml` for capability declarations.

## Capabilities

### New Capabilities

- `skill-local-stubs`: модель владения стабами — локальные стабы коlocated со скиллом, глобальные — starter kit с fallback-резолюцией.

### Modified Capabilities

## Impact

- `skills/<ns>/<skill>/stubs/` — новые директории для всех скиллов с локальными стабами
- `skills/skill/test-skill/skill.md` — обновить логику поиска стаба (local first, global fallback)
- `skills/skill/test-skill/stubs/` — добавить описание роли starter kit
- `openspec/changes/skill-test-runner-script/design.md` — добавить D7
- Все существующие кейсы (`skills/*/*/cases/*.md`) — **не изменяются**: формат `stub: <name>` остаётся, меняется только где `<name>` ищется
