## Why

`sdd:propose` на шаге 1 делегирует генерацию шаблонных артефактов внешнему скиллу `openspec-propose` (плагин openspec). Если плагин не подключён или его API изменилось, Skill tool возвращает `Unknown skill: openspec-propose` и весь workflow `sdd:propose` останавливается на первом шаге. Пользователь не получает proposal/design/tasks/specs.

Сейчас в репе нет fallback: при недоступности `openspec-propose` единственный путь — делать всё руками (что я и сделал при создании `unified-test-flow`). Это:
- ломает обещание `sdd:propose` как single-call workflow,
- не даёт воспроизводимого поведения между окружениями,
- не имеет диагностики (ошибка маскирует root cause: плагин не установлен / плагин обновился / harness не пробрасывает).

## Repro (история, как обнаружили)

1. Окружение: Claude Code, harness видит skill `openspec-propose` в списке available skills (system-reminder содержит строку `- openspec-propose: Propose a new change with all artifacts generated in one step.`).
2. Запуск: `/sdd:propose unified-test-flow <описание>`.
3. Skill tool успешно загрузил `sdd:propose`: `Successfully loaded skill`.
4. `sdd:propose` шаг 1 вызвал `Skill('openspec-propose', args=...)`.
5. Skill tool ответил: `Error: Unknown skill: openspec-propose`.
6. `sdd:propose` останавливается без указания, что делать дальше.
7. Workaround (ручной): написал `proposal.md`, `design.md`, `tasks.md`, `specs/<cap>/spec.md` через `Write`; использовал `skills/sdd/scripts/state.py` и `_sdd_yaml.py` для `.sdd-state.yaml` и `owner`; проверил design через `check-design.py`. Получился полноценный change, но обходным путём.

Расхождение: `openspec-propose` числится в available skills (по system-reminder), но недоступен через Skill tool. Это либо bug harness'а (пробрасывает имя но не реализацию), либо рассогласование между списком и реальной регистрацией скиллов.

## What Changes

- Добавить в `skills/sdd/propose/skill.md` шаг 0 — preflight check на доступность `openspec-propose` (см. `design.md` → D1)
- При отсутствии `openspec-propose` — fallback на встроенную генерацию шаблонов (см. `design.md` → D2)
- Шаблоны для proposal.md / design.md / tasks.md / spec.md SHALL быть в `skills/sdd/propose/templates/` (см. `design.md` → D3)
- При fallback — явное сообщение пользователю: `openspec-propose unavailable, using built-in templates` (см. `design.md` → D4)
- Тест-кейс `propose-without-openspec` в `skills/sdd/propose/cases/propose.md` — стаб без openspec-плагина, проверяет fallback-путь
- Аналогичный preflight + fallback для `sdd:apply` шага 5 (вызов `openspec-apply-change`) и `sdd:archive` шага 6 (вызов `openspec-archive-change`) — единая стратегия (см. `design.md` → D5)

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `sdd-propose-fallback`: `sdd:propose` гарантированно завершает workflow и без `openspec-propose`; preflight check + встроенные шаблоны + явный диагностический вывод.

### Modified Capabilities

<!-- В следующей итерации можно расширить на sdd:apply и sdd:archive — отдельный change или расширение этого; зависит от объёма правок. -->

## Impact

- `skills/sdd/propose/skill.md` — добавить шаг 0 (preflight), шаг 1 переписать под fallback-логику
- `skills/sdd/propose/templates/proposal.md.tmpl` — новый шаблон
- `skills/sdd/propose/templates/design.md.tmpl` — новый шаблон
- `skills/sdd/propose/templates/tasks.md.tmpl` — новый шаблон
- `skills/sdd/propose/templates/spec.md.tmpl` — новый шаблон
- `skills/sdd/propose/cases/propose.md` — добавить кейс `propose-without-openspec`
- `skills/skill/test-skill/stubs/no-openspec-plugin.md` — новый стаб (окружение без openspec-плагина)
