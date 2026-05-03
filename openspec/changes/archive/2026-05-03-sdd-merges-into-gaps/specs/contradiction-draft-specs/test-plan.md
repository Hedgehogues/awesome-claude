---
approach: |
  Проверка contradiction.py на отсутствие relevant_names и наличие второго прохода.
  Функциональная проверка через запуск скрипта на тестовой директории.
acceptance_criteria:
  - ac-01: contradiction.py не содержит строк с relevant_names
  - ac-02: contradiction.py содержит второй проход по creates с загрузкой из specs/<cap>/spec.md
  - ac-03: draft-спеки выводятся с суффиксом [DRAFT] в заголовке
  - ac-04: summary содержит поле draft_specs_loaded
---

## Scenarios

Запустить: `grep -n "relevant_names" skills/sdd/contradiction/scripts/contradiction.py`
Ожидание: пустой вывод.

Запустить скрипт на директории `sdd-merges-into-gaps` (у неё есть creates с новыми capabilities):
`python3 skills/sdd/contradiction/scripts/contradiction.py openspec/changes/sdd-merges-into-gaps`
Ожидание: вывод содержит `[DRAFT]` для archive-merges-into-support и contradiction-draft-specs,
summary содержит `draft_specs_loaded: 2`.
