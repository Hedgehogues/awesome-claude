## 1. _sdd_yaml.py: команда merge-state

- [x] 1.1 Добавить функцию `merge_state(change_dir)` в `skills/sdd/scripts/_sdd_yaml.py` — читает `.sdd-state.yaml`, дописывает `stage` и `last_step_at` в `.sdd.yaml`
- [x] 1.2 Если `.sdd-state.yaml` отсутствует — возвращать exit 0, `.sdd.yaml` не трогать
- [x] 1.3 Не копировать поле `owner` из state
- [x] 1.4 Добавить `cmd_merge_state(change_dir)` и ветку `merge-state` в `main()`
- [x] 1.5 Обновить docstring модуля: добавить `merge-state <change-dir>` в CLI Usage

## 2. archive/skill.md: шаг 11

- [x] 2.1 Обновить шаг 11 в `skills/sdd/archive/skill.md`: добавить `_sdd_yaml.py merge-state <change-dir>` перед `state.py delete`
- [x] 2.2 Убедиться, что порядок зафиксирован: merge-state → delete (не наоборот)
