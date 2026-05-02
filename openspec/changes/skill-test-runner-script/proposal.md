## Why

`skill:test-skill` — pure AI-скилл без внешнего enforcer'а: шаги могут быть пропущены или выполнены не по порядку (в текущей сессии был пропущен шаг 5 с `status.json`). `openspec-apply-change` решает аналогичную проблему для `tasks.md` через CLI. Нужен скрипт, который гарантированно выполняет все шаги тест-раннера в правильном порядке.

## What Changes

- Новый Python-скрипт `skills/skill/test-skill/scripts/run_test.py` — реализует логику `skill:test-skill` как детерминированный процесс: разбор кейсов → материализация стабов → запуск скилла через `claude -p` → сбор вывода → проверка contains/semantic → обновление `status.json` → итоговый отчёт.
- Скрипт соответствует шагам 1–5 из `skill:test-skill/skill.md` и выполняет их все без исключения.
- Зеркалировать в `.claude/skills/skill/test-skill/scripts/`.

See `.sdd.yaml` for capability declarations.

## Capabilities

### New Capabilities

- `skill-test-runner-script`: Python-скрипт, реализующий тест-раннер для скиллов — детерминированная альтернатива AI-скиллу `skill:test-skill`.

### Modified Capabilities

## Impact

- `skills/skill/test-skill/scripts/run_test.py` — новый файл
- `.claude/skills/skill/test-skill/scripts/run_test.py` — зеркало
- Использует `claude` CLI для запуска скилла в subprocess (аналог Agent tool)
- Зависит от: наличия `claude` CLI в PATH, структуры `cases/<skill>.md` и `stubs/*.md`
