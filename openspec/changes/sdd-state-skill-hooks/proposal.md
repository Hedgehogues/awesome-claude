## Why

В change `merge-verify-into-apply-archive` мы ввели `.sdd-state.yaml` с stage-машиной, но транзиции пишутся в `skill.md` как bash-команды и выполняются моделью при дисциплинированном вызове скиллов. Если модель пропустила шаг или пользователь работает вручную (как фактически и происходило в нашей же сессии при реализации) — state не обновляется, и `.sdd-state.yaml` либо отсутствует, либо рассинхронизирован с реальностью.

`PostToolUse` hook на матчер `Bash` не подходит — fires на каждый bash вызов и не различает контекст. Нужен **Skill**-уровневый event с tool_input, содержащим имя скилла, чтобы хук мог автоматически вызывать `state.py transition` без участия модели.

См. `.sdd.yaml` для capability declarations.

## What Changes

- Ввести `.claude/settings.json` hook на `PostToolUse` с матчером `Skill`, который для каждого вызова `/sdd:propose|contradiction|apply|archive` извлекает имя скилла из `tool_input` и автоматически вызывает соответствующий `state.py transition` для текущего change.
- Ввести скрипт-обёртку `skills/sdd/scripts/state_hook.py` — принимает на stdin JSON от harness'а (имя скилла, аргументы, success/failure), резолвит change-name, маппит skill→stage, вызывает `state.py transition`. Изолирует hook-логику от моделинга.
- Удалить ручные `state.py transition ...` bash-команды из `skill.md` файлов (apply/archive/contradiction/propose). Они становятся избыточными при работающем хуке. Оставить документацию state-перехода как комментарий.
- Решить **side-channel** для verify-результата: `/sdd:apply` после прогона inline verify пишет краткий `verify_status: ok|failed` в `.sdd-state.yaml` через `state.py update verify_status`. Hook читает это поле при transition после Skill завершения и выбирает `verify-ok` vs `verify-failed`.

## Capabilities

### New Capabilities

- `sdd-state-skill-hooks`: автоматическая транзиция `.sdd-state.yaml` через `PostToolUse` hook на матчер `Skill` — при завершении `/sdd:propose|contradiction|apply|archive` хук читает имя скилла из `tool_input`, резолвит current change-name, и вызывает `state.py transition` без участия модели. Скрипт-обёртка `state_hook.py` инкапсулирует resolve-логику. Verify-результат передаётся через side-channel поле `verify_status` в `.sdd-state.yaml`.

### Modified Capabilities

- `sdd-apply`: убрать ручные `state.py transition` bash-вызовы из `skill.md`; добавить запись `verify_status` после inline verify-прогона.
- `sdd-archive`: убрать ручные `state.py transition` bash-вызовы; добавить запись `verify_status` после inline spec-verify.
- `sdd-state`: добавить поле `verify_status` в schema (значения: `ok | failed | n/a`), описать как side-channel для hook-driven transitions.

(propose и contradiction skill.md тоже теряют bash-вызовы transition, но это покрывается требованием «skill.md MUST NOT содержать `state.py transition`» в основном spec'е `sdd-state-skill-hooks` — отдельных live-capability'ей под их state-handling нет.)

## Impact

**Конфигурация:**
- `.claude/settings.json` — новый hook `PostToolUse` на матчере `Skill`, вызывает `state_hook.py`.

**Новые файлы:**
- `skills/sdd/scripts/state_hook.py` — обёртка для harness'а: принимает JSON, резолвит change, маппит skill→stage, вызывает state.py.

**Модифицированные:**
- `skills/sdd/apply/skill.md` — убрать bash-вызовы state.py transition; добавить `state.py update verify_status <ok|failed>` после inline verify.
- `skills/sdd/archive/skill.md` — то же.
- `skills/sdd/propose/skill.md` — убрать `state.py transition proposed` (hook сделает сам).
- `skills/sdd/contradiction/skill.md` — убрать `state.py transition contradiction-ok|failed`; добавить `verify_status` после прогона.
- Live spec `sdd-state` — MODIFIED Requirement, добавить `verify_status` поле в schema.

**Внешние зависимости:**
- Claude Code 2.x с поддержкой `PostToolUse` matcher на `Skill` (известно работает по `~/.claude/settings.json` примеру).

**Совместимость:**
- Backward-compat: если хук не настроен (например, в CI без `.claude/settings.json`) — state не обновляется автоматически, но скилл функционально не ломается. Можно дополнительно оставить bash-fallback в skill.md за условным флагом.
- Существующие changes без `.sdd-state.yaml` продолжают работать через at-first-touch создание.
