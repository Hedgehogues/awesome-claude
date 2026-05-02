---
approach: |
  Запустить skill:test-skill дважды: один раз с реальным агентом (должен PASS),
  один раз с эмулятором статического анализа (должен FAIL с "agent was not launched").
  Проверить, что status.json содержит agent_launched: true только для первого случая.
acceptance_criteria:
  - "Кейс с пропущенным Agent-вызовом получает FAIL с сообщением 'agent was not launched'"
  - "status.json содержит поле agent_launched: true после успешного запуска агента"
  - "Кейс с реальным агентом проходит без изменений"
---

## Scenarios

### Happy path: агент запущен
GIVEN skill:test-skill выполняет шаг 3c через Agent tool
WHEN агент возвращает OUTPUT
THEN status.json[case].agent_launched == true
AND кейс оценивается по contains/semantic проверкам

### Negative: статический анализ
GIVEN шаг 3c пропущен (agent_launched не записан)
WHEN шаг 3d начинает проверку
THEN кейс получает FAIL
AND сообщение "agent was not launched — static analysis is not allowed"
