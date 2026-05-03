## Context

`skills/sdd/scripts/_sdd_yaml.py` — единая точка записи `.sdd.yaml`. Функция `save()` вызывает `yaml.safe_dump(data, f, sort_keys=False, allow_unicode=True)`. PyYAML по умолчанию пишет sequence-элементы без отступа относительно ключа (indentless sequences). Это валидный YAML, но не совпадает с форматом, который Claude пишет вручную через Write-инструмент. Каждый вызов `set-owner` или `move-capability` изменяет форматирование файла — Edit-инструмент после этого не находит строки.

## Goals / Non-Goals

**Goals:**
- После любого вызова `_sdd_yaml.py` файл `.sdd.yaml` содержит sequence-элементы с отступом (`  - value`, не `- value`).
- Edit-инструмент надёжно работает с `.sdd.yaml` независимо от того, был ли файл тронут скриптом.

**Non-Goals:**
- Не менять формат `.sdd-state.yaml` или других YAML-файлов — только `.sdd.yaml` через `_sdd_yaml.py`.
- Не добавлять зависимость `ruamel.yaml` — решение на стандартном PyYAML.

## Decisions

**D1: IndentedDumper поверх PyYAML.**
`yaml.Dumper` переопределяет `increase_indent(flow, indentless)` — передаём `indentless=False`. Это форсирует отступ у всех sequence-элементов. Никаких новых зависимостей.

```python
class IndentedDumper(yaml.Dumper):
    def increase_indent(self, flow=False, indentless=False):
        return super().increase_indent(flow, indentless=False)
```

Заменяем в `save()`:
```python
yaml.dump(data, f, Dumper=IndentedDumper, sort_keys=False, allow_unicode=True)
```

**D2: Только функция `save()` — точка единственного изменения.**
Вся запись проходит через `save()`. Менять только её — остальные функции не трогаем.

## Risks / Trade-offs

**R1: Существующие `.sdd.yaml` уже в indentless-формате.**
После патча скрипт начнёт писать отступы. Файлы, тронутые `set-owner` после патча, получат новый формат. Это не ломает читателей YAML — оба формата валидны. Миграция не нужна.

**R2: `yaml.dump` vs `yaml.safe_dump`.**
`IndentedDumper` наследует от `yaml.Dumper` (не SafeDumper), что технически допускает сериализацию Python-объектов. На практике `_sdd_yaml.py` работает только с `dict/list/str` — риска нет. Можно унаследовать от `yaml.SafeDumper` для строгости.
