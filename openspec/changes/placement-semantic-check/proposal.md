## Why

Детектор `placement` (3.7) в `sdd:contradiction` проверяет только три структурных паттерна (`### Requirement:` вне spec.md, чекбоксы в spec.md, rationale без `### Why`). Он не ловит семантические нарушения: HOW-контент (архитектурные решения, механика реализации) в `proposal.md` и WHY-контент (цели, мотивация) в `design.md`. Это обнаружилось на реальном change (`sdd-layer-artifacts`): детальные описания делегирования скиллов лежали в `## Impact` proposal.md, а `## Goals` из design.md дублировали `## Capabilities` proposal.md — contradiction не поймал ни то, ни другое.

## What Changes

- Расширить детектор `placement` (3.7) в `sdd:contradiction`: добавить два новых паттерна
  - **HOW в proposal**: секция или абзац с архитектурной механикой (Decisions, Implementation Details, delegation chains, технические параметры) в `proposal.md` вне явного `## Impact`-заголовка
  - **WHY в design**: секция `## Goals` или `## Objectives` с мотивационным контентом в `design.md` без ссылки на proposal
- Добавить cross-file duplication: `## Context` в `design.md`, семантически совпадающий с `## Why` в `proposal.md`, — новый под-паттерн redundancy-детектора (3.5)
- Добавить sub-check `self-compliance` в детектор placement (3.7): проверять что change-директория удовлетворяет поведенческим SHALL-требованиям из своих же спек; исключать при наличии явного `## Migration Plan` или temporal-scope маркеров («only after implementing», «applies to new changes after»)
- Добавить шаг 5 в детектор coverage (3.6): проверять что `tasks.md` содержит задачи на workflow-обязательные артефакты (`test-plan.md`, `.sdd.yaml`)

## Capabilities

### New Capabilities

- `placement-how-in-proposal`: детектирует HOW-контент (механику, delegation chains, технические параметры) в `proposal.md`
- `placement-why-in-design`: детектирует WHY-контент (`## Goals`, `## Objectives`) в `design.md`
- `context-why-redundancy`: детектирует семантический дубликат `## Context` в `design.md` и `## Why` в `proposal.md`
- `self-compliance`: sub-check детектора 3.7 — проверяет что change-директория удовлетворяет поведенческим SHALL-требованиям, которые она сама вводит в своих спеках
- `coverage-workflow-gates`: шаг 5 детектора 3.6 — детектирует отсутствие в `tasks.md` задач на workflow-обязательные артефакты (`test-plan.md`, `.sdd.yaml`)

### Modified Capabilities

- `sdd-contradiction-placement`: детектор 3.7 расширяется тремя новыми паттернами
- `sdd-contradiction-coverage`: детектор 3.6 расширяется шагом 5 (workflow-gate artifacts)

## Impact

- `skills/sdd/contradiction.md` и зеркало `.claude/skills/sdd/contradiction.md` — секция Phase 3 / 3.7 placement
