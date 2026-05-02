# Tasks: skill-test-dynamic-execution

## 1. Обновить skill:test-skill

- [ ] В шаге 3c добавить запись в status.json: `agent_launched: true` сразу после `Agent(...)` вызова
- [ ] В шаге 3d добавить pre-condition: если `agent_launched != true` → FAIL с сообщением "agent was not launched"
- [ ] Обновить JSON-схему status.json в шаге 5 (добавить поле `agent_launched: bool`)

## 2. Обновить тест-кейсы

- [ ] Проверить, что существующие кейсы в `skills/skill/test-skill/cases/` не нарушают новое требование
- [ ] Добавить кейс `negative-static-analysis-blocked` в `skills/skill/test-skill/cases/test-skill.md`
