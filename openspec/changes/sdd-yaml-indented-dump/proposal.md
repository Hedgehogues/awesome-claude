## Why

`_sdd_yaml.py` использует `yaml.safe_dump` для записи `.sdd.yaml`. `safe_dump` сериализует списки без отступа («indentless sequences»):

```yaml
# safe_dump пишет:      # человек пишет:
creates:                 creates:
- my-capability            - my-capability
```

После того как скрипт (например, `set-owner`) перезаписал файл, Edit-инструмент не может найти строку с отступом — и падает с `String to replace not found`. Это вынуждает обходить ошибку вместо fail-fast поведения.

Нужно зафиксировать формат: `_sdd_yaml.py` должен всегда писать YAML с отступами у списков, чтобы файл оставался предсказуемым для Edit-инструмента.

См. `.sdd.yaml` для capability declarations.

## What Changes

- Заменить `yaml.safe_dump` в `skills/sdd/scripts/_sdd_yaml.py` на вызов с `IndentedDumper` — кастомный Dumper, который форсирует отступ у sequence-элементов.
- Покрыть изменение тест-кейсом: после `set-owner` / `move-capability` файл должен содержать строки вида `  - capability-name` (с отступом).

## Capabilities

### Modified Capabilities

- `sdd-ownership`: `skills/sdd/scripts/_sdd_yaml.py` — функция `save()` использует `IndentedDumper` вместо `safe_dump`. Формат списков в `.sdd.yaml` стабилен после любой операции скрипта.
