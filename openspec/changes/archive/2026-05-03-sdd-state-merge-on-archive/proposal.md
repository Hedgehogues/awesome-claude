## Why

При архивировании change'а `.sdd-state.yaml` удаляется целиком. Вместе с ним теряются поля `stage: archived` и `last_step_at` — полезная историческая информация о том, когда и в каком состоянии завершился change. Эти данные больше нигде не сохраняются.

Кроме того, поле `owner:` продублировано в обоих файлах — `.sdd.yaml` и `.sdd-state.yaml` — что создаёт потенциальное расхождение.

## What Changes

- Добавить команду `merge-state` в `skills/sdd/scripts/_sdd_yaml.py` — читает поля `stage` и `last_step_at` из `.sdd-state.yaml` и дописывает их в `.sdd.yaml`; поле `owner` из state не копируется (первичный в `.sdd.yaml`)
- Обновить шаг 11 `skills/sdd/archive/skill.md`: перед удалением `.sdd-state.yaml` выполнять `merge-state`, чтобы финальные поля state оказались в `.sdd.yaml`

## Capabilities

See `.sdd.yaml` for machine-readable capability declarations.

### New Capabilities

- `sdd-state-archived-in-sdd`: при архивировании change поля `stage` и `last_step_at` из `.sdd-state.yaml` мёрджатся в `.sdd.yaml` перед удалением state-файла — историческая запись сохраняется в едином файле

### Modified Capabilities

- `sdd-archive`: шаг 11 обновлён — вызывает `_sdd_yaml.py merge-state` перед `state.py delete`

## Impact

- `skills/sdd/scripts/_sdd_yaml.py` — новая команда `merge-state <change-dir>`
- `skills/sdd/archive/skill.md` — шаг 11: `merge-state` → `delete`
