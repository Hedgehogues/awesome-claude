---
approach: |
  Прогнать skill:test-all после правок. Все 9 ранее упавших кейсов должны пройти.
  Проверить, что guard'ы не ломают existing поведение скиллов с заполненным $ARGUMENTS.
acceptance_criteria:
  - "dev:bump-version/edge-missing-versions PASSED: скилл останавливается при отсутствии .versions"
  - "dev:commit/clean-repo-nothing-to-commit PASSED: скилл сообщает 'nothing to commit' при пустом diff"
  - "dev:fix-bug/no-bug-description PASSED: скилл спрашивает описание бага вместо запуска агентов"
  - "dev:init-repo/fresh-repo-init PASSED: ветка main присутствует в выводе"
  - "dev:tdd/no-feature-description PASSED: скилл спрашивает описание фичи"
  - "dev:tracing/no-trace-target PASSED: скилл спрашивает цель вместо дефолта в Feature tracing"
  - "sdd:archive/index-yaml-update удалён из archive cases"
  - "sdd:apply/index-yaml-update PASSED в apply cases"
  - "sdd:change-verify/missing-artifact-gaps-found PASSED: стаб содержит задачу с несуществующим артефактом"
  - "sdd:change-verify/human-needed-task PASSED: стаб содержит задачу с live-проверкой"
---

## Scenarios

### Guard на пустой $ARGUMENTS
GIVEN скилл вызван без аргументов
WHEN $ARGUMENTS пустой
THEN скилл спрашивает пользователя и завершается без запуска дальнейших шагов

### bump-version без .versions
GIVEN .versions отсутствует
WHEN вызван dev:bump-version
THEN скилл выводит "Missing prerequisite: .versions not found" и останавливается

### commit при нулевых изменениях
GIVEN git status показывает только untracked или пусто
WHEN вызван dev:commit
THEN скилл выводит "Nothing to commit" и завершается

### change-verify с реальными задачами
GIVEN tasks.md содержит задачу с несуществующим артефактом
WHEN вызван sdd:change-verify
THEN verdict: gaps_found, missing path listed
