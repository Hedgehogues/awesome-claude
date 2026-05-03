# Tasks: sdd-merges-into-gaps

## archive-merges-into-support

- [x] Прочитать `skills/sdd/archive/skill.md` шаг 7 — зафиксировать текущую структуру L1/L2/L3 для `creates`
- [x] Добавить в шаг 7 чтение `merges-into` из `.sdd.yaml` (после чтения `creates`)
- [x] Добавить L1/L2/L3 верификационный цикл для каждой capability из `merges-into` — симметрично блоку для `creates`
- [x] Добавить обновление `index.yaml` при verify-ok для `merges-into`: обновить поле `description` существующей записи capability (шаг 9)
- [x] При verify-fail для `merges-into` — тот же red-banner и остановка, что и для `creates` (шаг 8 stop-guard охватывает 9–12)
- [x] Написать spec: `openspec/changes/sdd-merges-into-gaps/specs/archive-merges-into-support/spec.md`
- [x] Написать test-plan для capability
- [x] Обновить финальный отчёт (`archive_report.py`) — включить `merges-into` capabilities в секцию `## Архивированные артефакты`

## contradiction-draft-specs

- [x] Прочитать `skills/sdd/contradiction/scripts/contradiction.py` — зафиксировать текущую структуру
- [x] Удалить dead code: вычисление `relevant_names` (строки с `creates`, `merges_into`, `relevant_names =`)
- [x] Добавить второй проход по `creates` после основного цикла: для каждой capability из `creates`, отсутствующей в `discovered_names`, искать `openspec/changes/<name>/specs/<cap>/spec.md`
- [x] При нахождении draft-спека: добавлять в `loaded` с полем `draft: true`; в выводе помечать как `--- Capability: <cap> (<path>) [DRAFT] ---`
- [x] Обновить блок Summary — добавить счётчик `draft_specs_loaded`
- [x] Обновить live spec `contradiction-full-scan`: добавить Requirement для draft-spec loading
- [x] Написать spec: `openspec/changes/sdd-merges-into-gaps/specs/contradiction-draft-specs/spec.md`
- [x] Написать test-plan для capability
