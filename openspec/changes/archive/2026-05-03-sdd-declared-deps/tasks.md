# Tasks: sdd-declared-deps

## contradiction-deps-validation

- [x] Прочитать `skills/sdd/contradiction/scripts/contradiction.py` — зафиксировать текущую структуру second pass (creates draft loading)
- [x] Добавить явный проход по `merges-into`: для каждой capability проверить наличие в `discovered_names` (из index.yaml); если отсутствует — добавить в `warnings`; если присутствует — пометить `[PRIMARY/merges-into]` при выводе
- [x] Изменить метку для `creates` live-specs: добавить `[PRIMARY/creates]` (аналогично merges-into)
- [x] Изменить метку для `creates` draft-specs: заменить `[DRAFT]` на `[PRIMARY/creates DRAFT]`
- [x] Добавить поля `primary_capabilities` и `merges_into_missing` в блок Summary
- [x] Написать spec: `openspec/changes/sdd-declared-deps/specs/contradiction-deps-validation/spec.md` ← уже создан
- [x] Написать test-plan для capability: `openspec/changes/sdd-declared-deps/specs/contradiction-deps-validation/test-plan.md`

## contradiction-index-awareness

- [x] Добавить third pass в `contradiction.py`: index awareness scan
  - Собрать токены из имён `creates ∪ merges-into` (split, lowercase, filter: len>3, не в стоп-листе)
  - Для каждой capability из index.yaml, не в `creates ∪ merges-into`: вычислить |пересечение токенов| ≥ 2 → ADJACENT
  - Вывести секцию `--- ADJACENT Capabilities ---` (одна строка на capability или `(none)`)
- [x] Добавить поле `adjacent_capabilities` в блок Summary
- [x] Определить стоп-лист generic-токенов в коде (константа `STOP_TOKENS`)
- [x] Написать spec: `openspec/changes/sdd-declared-deps/specs/contradiction-index-awareness/spec.md` ← уже создан
- [x] Написать test-plan для capability: `openspec/changes/sdd-declared-deps/specs/contradiction-index-awareness/test-plan.md`

## apply-merges-into-context

- [x] Прочитать `skills/sdd/apply/skill.md` шаг 3 — зафиксировать текущую структуру (только чтение test-plan.md)
- [x] Добавить в шаг 3 подшаг: прочитать `merges-into` из `.sdd.yaml`; для каждой capability найти `path` в `index.yaml`; загрузить `openspec/specs/<path>` как read-only контекст
- [x] Оформить загруженные спеки в блоке «Existing capability contracts (read-only context)» — передавать Claude перед реализацией задач
- [x] Реализовать Requirement `merges-into-missing-warning` из `specs/apply-merges-into-context/spec.md`
- [x] Написать spec: `openspec/changes/sdd-declared-deps/specs/apply-merges-into-context/spec.md`
- [x] Написать test-plan для capability: `openspec/changes/sdd-declared-deps/specs/apply-merges-into-context/test-plan.md`

## contradiction-full-scan (modified)

- [x] Обновить live spec `openspec/specs/contradiction-full-scan/spec.md` — добавить Requirement'ы для PRIMARY/ADJACENT маркировки и merges-into validation
- [x] Обновить `skills/sdd/contradiction/skill.md` (cross-spec preamble): добавить описание новых секций `PRIMARY capabilities` и `ADJACENT Capabilities` в документацию вывода скрипта
