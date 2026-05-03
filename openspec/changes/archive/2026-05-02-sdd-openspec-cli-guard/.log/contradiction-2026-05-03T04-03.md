# sdd:contradiction — 2026-05-03T04-03
change: sdd-openspec-cli-guard

## Шаги выполнения

## Шаг: Logging setup
✓ timestamp=2026-05-03T04-03

## Шаг: Identity check
✓ email=e.s.urvanov@gmail.com, owner=e.s.urvanov@gmail.com — пользователь выбрал оставить

## Шаг: Cross-spec preamble
✓ total_discovered=41, total_loaded=30, skipped=12

## Шаг: Phase 1 EXPAND
✓ change зрелый, пропущен

## Шаг: Phase 2 COMPRESS
✓ дубликатов ≥120 chars не найдено

## Шаг: Phase 3 VALIDATE
✓ numeric: 0
✓ reference: 0
✓ deontic: 0
✓ semantic: 8 subjects, конфликтов нет
✓ redundancy: 0
✓ coverage: 0
✓ placement: 0
⚠ spec-count: 2 (tasks 3.1 и 3.2 без Requirement)
✓ semantic-completeness: 0
✓ derivability: 0
✓ what-changes-coverage: 0 (D6 закрыл предыдущий warning)
⚠ decisions-coverage: 1 (D6 без Requirement)

## Шаг: Phase 4 CONVERGE
n/a

## Шаг: Phase 5 CROSS-CUT
n/a

## Детекторный отчёт (verbatim)

=== Contradiction report: openspec/changes/sdd-openspec-cli-guard ===

--- Suspicious nodes (heuristic) ---
design.md: 6 Decisions, высокая связность с 4 внешними файлами вне PATH
spec.md: 2 Requirements с prescriptive SHALL/SHALL NOT — проверяем deontic

--- Hard issues (error) ---
(none)

--- Soft warnings ---
tasks.md:17: [warning] spec-count: task 3.1 (frontmatter .openspec-version cleanup) has no corresponding Requirement in spec.md
tasks.md:18: [warning] spec-count: task 3.2 (opsx:archive review) has no corresponding Requirement in spec.md
design.md:62: [warning] decisions-coverage: Decision 'D6' (prescriptive: Убрать из frontmatter) has no corresponding Requirement in spec.md

--- Subjects covered by semantic detector ---
- preflight error message (openspec not found / npm install)
- sdd:propose шаг 1 replacement (openspec-propose → openspec new change)
- sdd:explore replacement (openspec-explore → opsx:explore)
- sdd:apply шаг 5 replacement (openspec-apply-change → opsx:apply)
- sdd:archive шаг 6 replacement (openspec-archive-change → openspec archive -y)
- Two abstraction layers (openspec CLI vs opsx:*)
- Step numbers (шаг 1/5/6)
- preflight command (which openspec)

--- Summary ---
- hard: 0 (numeric=0, reference=0, deontic=0, semantic=0)
- warnings: 3 (spec-count=2, decisions-coverage=1)
- drift_score: 3
- convergence: n/a — no hard issues
- exit semantics: clean
- residual_risk: low — все 4 артефакта прочитаны полностью

## Дрейф и веса

| Детектор | Тип | Вес | Кол-во | Вклад | Что означает |
|---|---|---|---|---|---|
| numeric | hard | 10 | 0 | 0 | Числовые противоречия |
| reference | hard | 10 | 0 | 0 | Сломанные ссылки |
| deontic | hard | 10 | 0 | 0 | Конфликты MUST/MUST NOT |
| semantic | hard | 10 | 0 | 0 | Смысловые расхождения |
| redundancy | soft | 1 | 0 | 0 | Дубликаты текста |
| coverage | soft | 1 | 0 | 0 | Capability без задачи |
| placement | soft | 1 | 0 | 0 | Информация не в том артефакте |
| spec-count | soft | 1 | 2 | 2 | Задачи без Requirement |
| semantic-completeness | soft | 1 | 0 | 0 | Термин не раскрыт в спеке |
| derivability | soft | 1 | 0 | 0 | Пересказ из другого артефакта |
| what-changes-coverage | soft | 1 | 0 | 0 | Изменение без Decision |
| decisions-coverage | soft | 1 | 1 | 1 | Decision без Requirement |
| **drift_score** | | | | **3** | hard×10 + warnings×1 |
