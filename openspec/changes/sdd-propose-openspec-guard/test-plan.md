---
approach: |
  Ручная проверка: запустить /sdd:propose с установленным и без openspec бинаря.
acceptance_criteria:
  - sdd:propose не падает с "Unknown skill: openspec-propose"
  - при отсутствии openspec выводится "openspec not found. Run /dev:install"
---

## Scenarios

**Сценарий 1 — openspec установлен**: запустить `/sdd:propose test-change`, убедиться что change создаётся без ошибок.

**Сценарий 2 — openspec отсутствует**: временно переименовать бинарь, запустить `/sdd:propose`, получить корректное сообщение об ошибке.
