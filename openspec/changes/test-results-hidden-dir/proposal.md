## Why

Директория `test-results/` сейчас трекается git'ом (через `.gitkeep`) и её имя не отражает «служебный» характер артефактов. Скрытая директория `.test-results/` (аналогично `.sdd-state.yaml`, `.openspec.yaml`) явно сигнализирует, что это runtime-вывод, не предназначенный для VCS.

## What Changes

- Директория `test-results/` переименована в `.test-results/`
- `.test-results/` добавлена в `.gitignore`; `.gitkeep` удалён
- Все упоминания пути `test-results/` обновлены → `.test-results/` в:
  - `skills/skill/test-skill/skill.md`
  - `openspec/specs/index.yaml`
  - `openspec/changes/install-modes/specs/skill-eval-framework/spec.md`
  - `openspec/changes/unified-test-flow/specs/skill-eval-framework/spec.md`
  - соответствующие `design.md`, `tasks.md`, `test-plan.md`, `proposal.md` тех же change'ов

## Capabilities

### New Capabilities

_(нет новых capabilities — это чисто инфраструктурный rename)_

### Modified Capabilities

- `skill-eval-framework`: путь результатов меняется с `test-results/<timestamp>.md` на `.test-results/<timestamp>.md`

## Impact

- `skills/skill/test-skill/skill.md` — исполняемый скилл, генерирует файлы по обновлённому пути
- `openspec/specs/index.yaml` — описание capability
- Два pending change'а (install-modes, unified-test-flow) содержат черновые spec-файлы с `test-results/` — требуют обновления
- `.gitignore` — новая запись `.test-results`
- `test-results/.gitkeep` — удалить, директория `test-results/` — переименовать

See `.sdd.yaml` for capability declarations.
