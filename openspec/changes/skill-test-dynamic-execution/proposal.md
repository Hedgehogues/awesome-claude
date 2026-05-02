# Proposal: Enforce Dynamic Skill Execution in skill:test-skill

## Why

`skill:test-skill` содержит шаг 3c "Запусти скилл в агенте", но ничто не обязывает
исполнителя действительно запускать агента. В текущей реализации можно провести
статический анализ `skill.md` и вынести вердикт PASS/FAIL без единого вызова Agent.

Это означает, что тесты проверяют текст скилла, а не его реальное поведение — багу
в промпте или в сайд-эффектах инструментов тест не обнаружит.

## What Changes

- `skill:test-skill` (`skills/skill/test-skill/skill.md`): добавить обязательную запись
  в `status.json` поля `agent_launched: true` сразу после запуска Agent в шаге 3c;
  добавить проверку в шаге 3d — если `agent_launched` отсутствует или false, кейс
  автоматически получает вердикт FAIL с сообщением "agent was not launched".

- `status.json` schema: расширить схему — добавить поле `agent_launched: bool`
  в запись каждого кейса.

### New Capabilities

- `skill-test-dynamic-execution`: spec-level guarantee that each test case in
  skill:test-skill runs the skill body through an Agent, not static analysis.

## Impact

Все существующие тесты, где агент не был запущен (статический анализ), начнут
падать с FAIL. Это ожидаемо и корректно.

See `.sdd.yaml` for capability declarations.
