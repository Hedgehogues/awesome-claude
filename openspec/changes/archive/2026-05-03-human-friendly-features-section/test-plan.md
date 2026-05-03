---
approach: |
  Запустить sdd:apply на тестовом change с capability, у которого задан title и у которого partial-статус.
  Проверить секцию ## Реализованные фичи в выводе.
acceptance_criteria:
  - В строке capability отображается title, а не kebab-name
  - Статус "done" рендерится как "готово", "partial" — как "частично"
  - Для partial-capability в строке есть "(N задач не завершено)", а не сырой текст задач
  - Capability без title отображает name как fallback
---

## Scenarios

TODO: describe scenarios here.
