## Why

Сейчас скиллы вызывают `state.py transition` или `state.py update` напрямую, с хардкодом имён стадий внутри skill.md. Логика переходов размазана по четырём skill.md файлам. При добавлении нового скилла нужно вручную знать, какие переходы допустимы, и везде их прописывать.

`sdd-state-skill-hooks` убрал прямые `transition` вызовы, заменив на `pending_transitions` — но промежуточные шаги всё ещё требуют ручных вызовов, а правила переходов нигде не задекларированы per-skill.

Нужен единый роутер с декларативными правилами: каждый скилл описывает свои шаги и допустимые переходы в `state.yaml`, а `state_manager.py` читает эти правила и валидирует вызов.

См. `.sdd.yaml` для capability declarations.

## What Changes

- Добавить `skills/scripts/state_manager.py` — единая точка входа. Принимает `--namespace`, `--skill`, `--step`, `--state-file`. Находит `skills/<ns>/<skill>/state.yaml`, валидирует шаг и текущий stage, записывает новый stage.
- Добавить `skills/<ns>/<skill>/state.yaml` для каждого sdd-скилла (apply, archive, propose, contradiction) — декларативные правила: список steps, допустимые transitions_to, final-флаг.
- Заменить в skill.md вызовы `state.py update stage <X>` на `state_manager.py --ns sdd --skill apply --step <X>`.
- Namespace-уровень: `skills/sdd/state.yaml` содержит общие для namespace стадии (owner, started_at).

## Capabilities

### New Capabilities

- `sdd-state-manager`: `skills/scripts/state_manager.py` — роутер состояния. Принимает (namespace, skill, step, state-file), находит декларативный `state.yaml` для скилла, валидирует допустимость шага из текущего state, записывает. Exit 2 при невалидном шаге, exit 0 при успехе.
- `sdd-state-declarations`: `skills/<ns>/<skill>/state.yaml` для каждого sdd-скилла — декларативное описание шагов и transitions_to. `skills/sdd/state.yaml` — namespace-defaults.

### Modified Capabilities

- `sdd-apply`: skill.md заменяет `state.py update stage` на `state_manager.py --ns sdd --skill apply --step <X>`.
- `sdd-archive`: аналогично.
- `sdd-propose`: аналогично.
- `sdd-contradiction`: аналогично.
