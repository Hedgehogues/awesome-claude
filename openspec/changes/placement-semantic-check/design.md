## Context

см. `proposal.md` → Why. Детектор placement (3.7) покрывает только структурные паттерны; семантические нарушения границы proposal/design остаются необнаруженными.

## Goals / Non-Goals

**Goals:**
- Расширить детектор 3.7 двумя новыми паттернами: HOW в proposal, WHY в design
- Добавить cross-file redundancy для `## Context` / `## Why`

**Non-Goals:**
- Не менять severity (остаётся `warning`)
- Не покрывать нарушения placement в tasks.md или spec.md (они уже покрыты паттернами 1–3)
- Не автоматически перемещать контент — только диагностика

## Decisions

**Паттерн 4 — HOW в proposal.md**

Маркеры HOW в `proposal.md`:
- заголовки `## Implementation`, `## Technical Details`, `## Architecture`, `## How`
- абзацы с delegation chains: `→`, `delegates to`, вызовы типа `skill → SKILL.md`
- технические параметры: имена методов, пути конфигурации, протоколы — вне `## Impact`

Исключение: `## Impact` в proposal — допустимый перечень затронутых файлов/скиллов на уровне имён, без механики.

**Паттерн 5 — WHY в design.md**

Маркеры WHY в `design.md`:
- заголовок `## Goals` или `## Objectives` с мотивационным телом (без ссылки на proposal)
- абзацы с «потому что», «проблема в том», «пользователи хотят» — вне `## Context`

Исключение: `## Context` в design — допустимый однострочный бридж к proposal.

**Паттерн 6 — Context/Why cross-file redundancy**

Подстратегия детектора `redundancy` (3.5): если `## Context` в `design.md` и `## Why` в `proposal.md` содержат ≥3 общих предметных термина (нормализованных) — флагировать как cross-file semantic duplicate. SSOT = `proposal.md`. Pointer-rewrite: заменить тело `## Context` на однострочную ссылку.

**Порядок применения**

Паттерны 4–6 применяются в конце Phase 3 / 3.7 как продолжение существующих трёх паттернов. Вставка в фиксированный порядок детекторов не требуется — только расширение тела 3.7.

**Паттерн 7 — Self-compliance**

Детектор проверяет, что change-директория удовлетворяет поведенческим SHALL-требованиям из своих же спек. Subject detection: Requirement, чьё тело содержит паттерны «every new change SHALL», «change directory SHALL contain», «sdd:propose creates». Проверяется существование требуемого артефакта в change-директории.

Исключения:
- Requirement содержит temporal-scope маркер («only after implementing», «applies to new changes created after») — не флагировать.
- `design.md` содержит `## Migration Plan` с явным «не применять ретроактивно» или «только к новым changes» — не флагировать.
- Subject требования — скилл или инструмент, не change-директория («`sdd:archive` SHALL copy...») — не флагировать.

Severity `warning`. Self-compliance **не растит exit-код**.

**Порядок применения**

Паттерн 7 применяется последним в 3.7 — после паттернов 4–6. Итого семь паттернов.

**Coverage шаг 5 — Workflow-gate artifacts**

В детекторе coverage (3.6) добавляется шаг 5: для каждого workflow-обязательного артефакта проверяется, что в `tasks.md` есть хотя бы одна задача на его создание.

Workflow-обязательные артефакты:
- `test-plan.md` — требуется `sdd:archive`
- `.sdd.yaml` — требуется `sdd:archive`

Совпадение: имя файла упоминается в строке с чекбоксом (`- [ ]` / `- [x]`).

Severity: `warning`. Не растит exit-код.

Формат: `tasks.md: [warning] coverage: workflow artifact '<name>' has no task in tasks.md (required by sdd:archive)`

## Risks / Trade-offs

[Ложные срабатывания паттерна 4] → delegation chains в `## Impact` иногда содержат технические детали. Исключение `## Impact` из паттерна 4 снижает риск, но не устраняет полностью. Детектор помечает `ambiguous` если невозможно однозначно классифицировать.

[Паттерн 6 чувствителен к порогу совпадения] → порог ≥3 предметных терминов выбран эмпирически. При ложном срабатывании пользователь может добавить subject в ignore-список (`sdd:contradiction`-механизм).
