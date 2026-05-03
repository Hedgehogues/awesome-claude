## Context

`sdd:propose` сейчас создаёт два скилл-специфичных артефакта безусловно для всех change:
- `test-plan.md` (шаг 7) — план тестирования, имеющий смысл только для skill-change
- stub-кейсы `skills/<ns>/<skill>/cases/<skill>.md` (шаг 11) — тестовая инфраструктура, специфичная для скиллов

При этом `sdd:apply` уже владеет знанием о том, ЧТО реализуется: он читает tasks.md, specs и design.md. Логично, что именно он должен инициализировать тест-инфраструктуру скилла — в момент реализации, а не в момент пропоузала.

## Goals / Non-Goals

**Goals:**
- `sdd:propose` не знает о скиллах — он создаёт только proposal.md, design.md, specs, tasks, .sdd.yaml, .sdd-state.yaml
- `sdd:apply` определяет, является ли change skill-change, и если да — создаёт test-plan.md и stub-кейсы
- spec `test-plan-link` обновлён: test-plan.md создаётся в apply, только для skill-change

**Non-Goals:**
- Не трогаем логику `sdd:archive` (она читает test-plan.md — это остаётся)
- Не вводим новый скилл в `skill:` namespace (достаточно расширить sdd:apply)
- Не меняем формат test-plan.md и cases/*.md

## Decisions

**Решение: переместить в sdd:apply, а не в skill: namespace**

Альтернатива — создать `skill:new` или аналогичный скилл, который нужно явно вызывать при создании нового скилла. Отклонено: это требует запоминания дополнительного шага от автора, а `sdd:apply` уже имеет контекст change и может сделать это автоматически.

**Решение: определение skill-change по proposal.md**

`sdd:apply` проверяет `## What Changes` и `## Capabilities → New Capabilities` в proposal.md на наличие `skills/<ns>/<skill>/skill.md` — тот же эвристик, что использовал шаг 11 `sdd:propose`. Это сохраняет согласованность логики.

**Решение: test-plan.md создаётся перед реализацией первой задачи**

`sdd:apply` создаёт test-plan.md и stub-кейсы до начала реализации tasks, чтобы авторы могли заполнить plan до merge.

## Risks / Trade-offs

- [Риск] Авторы, привыкшие видеть test-plan.md сразу после propose, не найдут его — Митигация: документировать в skill:onboarding, что test-plan создаётся при apply для skill-change
- [Риск] sdd:apply уже достаточно сложный — добавление skill-detection увеличивает его объём — Митигация: изолировать в отдельный опциональный шаг в начале apply
