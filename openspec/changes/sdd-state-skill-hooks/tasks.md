## 1. Scripts

- [ ] 1.1 Создать `skills/sdd/scripts/state_hook.py`: парсит stdin JSON `{tool_name, tool_input.skill, tool_input.args, tool_response.success}`, резолвит change-name (через args или freshest state-file), маппит skill→target stage по таблице, вызывает `state.py transition`. Exit 0 во всех ошибочных сценариях с warning в stderr.
- [ ] 1.2 Расширить `state.py update` — поддержка поля `verify_status` со валидацией значений (`ok | failed | n/a`).
- [ ] 1.3 Добавить smoke-тест `state_hook.py` через прогон с фейковым stdin JSON и проверкой ожидаемого transition.

## 2. Settings

- [ ] 2.1 Добавить в `.claude/settings.json` (через `update-config` skill): `PostToolUse` hook с матчером `Skill`, command `python3 ${CLAUDE_PROJECT_DIR}/skills/sdd/scripts/state_hook.py`.

## 3. Modify skill.md (4 файла)

- [ ] 3.1 `skills/sdd/apply/skill.md`: удалить `state.py transition applying|verifying|verify-ok|verify-failed`; добавить `state.py update <path> verify_status <ok|failed>` ПЕРЕД завершением скилла (после inline verify).
- [ ] 3.2 `skills/sdd/archive/skill.md`: удалить `state.py transition archiving|archived|archive-failed`; добавить `state.py update <path> verify_status <ok|failed>` ПЕРЕД завершением.
- [ ] 3.3 `skills/sdd/propose/skill.md`: удалить `state.py transition proposed`. Hook сам.
- [ ] 3.4 `skills/sdd/contradiction/skill.md`: удалить `state.py transition contradiction-ok|contradiction-failed`; добавить `state.py update <path> verify_status <ok|failed>` ПЕРЕД завершением.

## 4. Test cases для hook поведения

- [ ] 4.1 Расширить `skills/sdd/apply/cases/apply.md`: case `verify-status-written-before-end` (semantic — `verify_status` записан в state-file до завершения скилла), `no-direct-transition` (semantic — skill.md не содержит строк `state.py transition`).
- [ ] 4.2 Расширить `skills/sdd/archive/cases/archive.md`: аналогичные кейсы для archive.
- [ ] 4.3 Создать stub `skills/skill/test-skill/stubs/with-hooks-config.md` — `.claude/settings.json` с PostToolUse Skill hook сконфигурирован.
- [ ] 4.4 Создать case `state_hook-resolves-from-args` (stub `with-hooks-config`) — semantic: hook вызывается с tool_input, корректно резолвит change.

## 5. Documentation

- [ ] 5.1 В `docs/SKILL_DESIGN.md` (или аналог) добавить раздел «State automation via PostToolUse hook» с описанием side-channel `verify_status` и mapping skill→stage.
- [ ] 5.2 В `README.md` упомянуть hook в SDD workflow секции (1-2 предложения).

## 6. Integration & verification (manual)

- [ ] 6.1 Прогнать `/sdd:propose test-hook → /sdd:contradiction → /sdd:apply → /sdd:archive` с включённым hook'ом — убедиться что state-transitions происходят без ручных bash-вызовов.
- [ ] 6.2 Прогнать сценарий verify-failed: убедиться что hook ставит `verify-failed` (а не `verify-ok`) когда `verify_status: failed`.
- [ ] 6.3 Прогнать сценарий без hook'а (временно убрать из settings.json) — убедиться что workflow продолжает работать (state просто не обновляется автоматически).

## 7. Bump version

- [ ] 7.1 Запустить `/sdd:bump-version` — bump до 0.8.0 (minor, не breaking).
- [ ] 7.2 Обновить `CHANGELOG.md` записью о hook-driven state automation.
