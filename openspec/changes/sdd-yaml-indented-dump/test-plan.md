---
approach: |
  Вызвать set-owner и move-capability на тестовом .sdd.yaml,
  проверить форматирование вывода через grep на отступ.
acceptance_criteria:
  - После set-owner файл содержит "  - capability" (2 пробела перед дефисом)
  - После move-capability файл содержит "  - capability" (2 пробела перед дефисом)
  - Edit-инструмент находит строку после вызова скрипта
---

## Scenarios

### S1: set-owner не ломает отступы
Создать .sdd.yaml с `creates: [my-cap]`. Вызвать `set-owner`. Проверить: файл содержит `  - my-cap`.

### S2: move-capability не ломает отступы
Переместить capability из creates в merges-into. Проверить оба списка с отступом.
