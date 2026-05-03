## Context

SDD-скиллы (apply, archive, propose, contradiction) управляют жизненным циклом change через `.sdd-state.yaml`. Сейчас логика переходов состояния размазана по четырём `skill.md` файлам: каждый скилл напрямую вызывает `state.py update pending_transitions` с захардкоженными именами стадий.

`sdd-state-skill-hooks` убрал прямые вызовы `state.py transition` — хук применяет их автоматически по полю `pending_transitions`. Но правила допустимых переходов нигде не задекларированы per-skill, и промежуточные шаги внутри скилла не отражаются в state.

## Goals / Non-Goals

**Goals:**
- Единая точка входа для записи состояния — `state_manager.py` принимает `--ns`, `--skill`, `--step`, `--state-file` и сам находит правила.
- Декларативные правила в `skills/<ns>/<skill>/state.yaml` — каждый скилл описывает список steps и allowed `transitions_to`.
- Валидация на уровне роутера: exit 2 при невалидном шаге, exit 0 при успехе.
- Namespace-уровень: `skills/sdd/state.yaml` содержит общие для namespace поля (owner, started_at).

**Non-Goals:**
- Не заменяет `state.py` как низкоуровневый YAML-менеджер — `state_manager.py` вызывает его внутри.
- Не меняет структуру `.sdd-state.yaml` на диске.
- Не добавляет UI или визуализацию state machine.

## Decisions

**D1: state_manager.py как тонкий роутер.**
Принимает `(namespace, skill, step, state-file)`, находит `skills/<ns>/<skill>/state.yaml`, читает entry для step, проверяет `current_stage ∈ allowed_from`, дописывает `sets_stage` в конец цепочки `pending_transitions` через `state.py update`. Сам файл не содержит бизнес-логики — только dispatch + validation.

`current_stage` определяется как последнее значение в `pending_transitions` (если поле непустое), иначе — поле `stage` из state-файла. Это позволяет корректно валидировать последовательные вызовы внутри одного скилла до того, как хук применит переходы.

**D2: Формат state.yaml per-skill.**
```yaml
steps:
  start:
    sets_stage: applying
    allowed_from: [proposed, contradiction-ok]
  verify-start:
    sets_stage: verifying
    allowed_from: [applying]
  verify-passed:
    sets_stage: verify-ok
    allowed_from: [verifying]
  verify-failed:
    sets_stage: verify-failed
    allowed_from: [verifying]
```
Каждый шаг описывает одну стрелку в state machine. Полная цепочка apply: `start → verify-start → verify-passed/verify-failed`.

**D3: Обратная совместимость.**
`pending_transitions` остаётся — hook по-прежнему применяет финальные переходы. `state_manager.py` дополняет, не заменяет существующий механизм.

**D4: Расположение state_manager.py.**
`skills/scripts/state_manager.py` (рядом с `state.py`) — один скрипт на все namespace/skills, маршрутизация через аргументы.

**D5: Финальные стадии в state.py.**
`state.py` содержит `FINAL_STAGES = {"archived"}` рядом с `ALLOWED_TRANSITIONS`. Команда `python3 state.py is-final <stage>` возвращает exit 0 если стадия финальная, exit 1 иначе. `state_hook.py` вызывает эту команду вместо хардкода `"archived"` при решении об удалении state-файла.

## Risks / Trade-offs

**R1: Дрейф state.yaml и skill.md.** Если step в skill.md переименован, а state.yaml не обновлён — exit 2 при запуске. Митигация: тест-кейс на invalid step name.

**R2: Увеличение количества файлов.** Четыре `state.yaml` файла (apply, archive, propose, contradiction) + namespace-level. Приемлемо — каждый мал и декларативен.

**R3: Backward compatibility при добавлении нового скилла.** Новый скилл может не иметь `state.yaml` — state_manager.py должен завершиться с понятным сообщением, не падать с KeyError.
