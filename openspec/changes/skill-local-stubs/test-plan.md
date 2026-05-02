---
approach: |
  Проверить local-first резолюцию стабов: создать локальный стаб для одного скилла,
  убедиться что он приоритетнее глобального. Проверить fallback. Проверить ошибку
  при отсутствии в обоих местах.
acceptance_criteria:
  - ac-local-first: локальный стаб используется вместо глобального при совпадении имени
  - ac-fallback: при отсутствии локального стаба используется глобальный с логом
  - ac-not-found: при отсутствии в обоих местах — явная ошибка с путями
  - ac-divergence-ok: расхождение содержимого локального и глобального стаба не вызывает ошибок
  - ac-existing-cases: существующие кейсы со ссылками на глобальные стабы продолжают работать без изменений
---

## Scenarios

### Local stub shadows global

**When:** `skills/dev/tracing/stubs/fresh-repo.md` существует, кейс ссылается на `stub: fresh-repo`

**Then:** используется локальный стаб, в логе `stub resolved: local`

### Fallback to global

**When:** локальный стаб отсутствует, глобальный есть

**Then:** используется глобальный, в логе `stub resolved: global fallback (...)`

### Stub not found

**When:** стаб отсутствует в обоих местах

**Then:** `ERROR: stub <name> not found. Checked: <path1>, <path2>`

### Existing cases unaffected

**When:** запускается любой существующий кейс без локальных стабов

**Then:** прогон завершается так же как раньше через global fallback
