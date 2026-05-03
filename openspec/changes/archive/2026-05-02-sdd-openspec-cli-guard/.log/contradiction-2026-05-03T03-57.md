# sdd:contradiction — 2026-05-03T03-57
change: sdd-openspec-cli-guard

## Шаги выполнения

## Шаг: Logging setup
✓ timestamp=2026-05-03T03-57, log=.log/contradiction-2026-05-03T03-57.md

## Шаг: Identity check
✓ email=owner=e.s.urvanov@gmail.com

## Шаг: Cross-spec preamble
✓ contradiction.py: total_discovered=41, total_loaded=30, skipped=12 (missing files)

## Шаг: Phase 1 EXPAND
✓ change зрелый, пропущен молча

## Шаг: Phase 2 COMPRESS
✓ дубликатов ≥120 chars не найдено

## Шаг: Phase 3 VALIDATE
✓ numeric: 0 issues
✓ reference: 0 issues
✓ deontic: 0 issues
✓ semantic: 8 subjects проверены, конфликтов нет
✓ redundancy: 0 warnings
✓ coverage: capability семантически покрыта задачами группы 1
✓ placement: нет нарушений
⚠ spec-count: 2 warnings (нет spec.md)
⚠ semantic-completeness: 1 warning
⚠ what-changes-coverage: 1 warning (frontmatter клинап без Decision)
⚠ decisions-coverage: 1 warning (D1 без Requirement)

## Шаг: Phase 4 CONVERGE
n/a — нет hard issues

## Шаг: Phase 5 CROSS-CUT
n/a — PATH = single change-dir

## Детекторный отчёт (verbatim)

=== Contradiction report: openspec/changes/sdd-openspec-cli-guard ===

--- Suspicious nodes (heuristic) ---
proposal.md: единственный артефакт с capability-list и What Changes — высокая связность
design.md: 5 Decisions, все ссылаются на конкретные skill-файлы вне PATH

--- Hard issues (error) ---
(none)

--- Cascade predictions ---
(none)

--- Soft warnings ---
proposal.md:27: [warning] spec-count: New Capability 'sdd-openspec-cli-guard' has no corresponding spec.md file
tasks.md:3-14: [warning] spec-count: 9 tasks in groups 1-2 have no corresponding Requirement in any spec.md (no spec files exist)
proposal.md:27: [warning] semantic-completeness: term 'sdd-openspec-cli-guard' introduced in proposal but not covered in any spec
proposal.md:21: [warning] what-changes-coverage: What Changes item (frontmatter/.openspec-version removal) has no corresponding Decision in design.md
design.md:29: [warning] decisions-coverage: Decision 'D1' (prescriptive: Добавить preflight в каждый skill.md) has no corresponding Requirement in spec

--- Subjects covered by semantic detector ---
- CLI installation error message (openspec not found / npm install -g @openspec/cli)
- sdd:propose шаг 1 replacement (openspec-propose → openspec new change)
- sdd:explore replacement (openspec-explore → opsx:explore)
- sdd:apply шаг 5 replacement (openspec-apply-change → opsx:apply)
- sdd:archive шаг 6 replacement (openspec-archive-change → openspec archive -y)
- Two abstraction layers (openspec CLI vs opsx:* commands)
- Step numbers (шаг 1 / шаг 5 / шаг 6)
- preflight command pattern (which openspec)

--- Summary ---
- hard: 0 (numeric=0, reference=0, deontic=0, semantic=0)
- warnings: 5 (redundancy=0, coverage=0, placement=0, spec-count=2, semantic-completeness=1, derivability=0, what-changes-coverage=1, decisions-coverage=1)
- drift_score: 5
- convergence: n/a — no hard issues
- exit semantics: clean
- residual_risk: low — все 3 артефакта прочитаны полностью, context не переполнен, cross-ref граф линейный

## Дрейф и веса

| Детектор | Тип | Вес | Кол-во | Вклад | Что означает |
|---|---|---|---|---|---|
| numeric | hard | 10 | 0 | 0 | Числовые противоречия — блокируют архив |
| reference | hard | 10 | 0 | 0 | Сломанные ссылки на файлы или секции |
| deontic | hard | 10 | 0 | 0 | Логические конфликты MUST/MUST NOT |
| semantic | hard | 10 | 0 | 0 | Смысловые расхождения между файлами |
| redundancy | soft | 1 | 0 | 0 | Один текст скопирован в несколько мест |
| coverage | soft | 1 | 0 | 0 | Требование или capability без задачи |
| placement | soft | 1 | 0 | 0 | Информация в неправильном артефакте |
| spec-count | soft | 1 | 2 | 2 | Задача без покрывающего требования в спеке |
| semantic-completeness | soft | 1 | 1 | 1 | Термин введён, но не раскрыт в спеке |
| derivability | soft | 1 | 0 | 0 | Пересказ из другого артефакта без добавления |
| what-changes-coverage | soft | 1 | 1 | 1 | Изменение без Decision в design |
| decisions-coverage | soft | 1 | 1 | 1 | Decision без Requirement в спеке |
| **drift_score** | | | | **5** | hard×10 + warnings×1 |
