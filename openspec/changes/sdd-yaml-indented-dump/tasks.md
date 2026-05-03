## 1. IndentedDumper в _sdd_yaml.py

- [ ] 1.1 Добавить класс `IndentedDumper(yaml.SafeDumper)` в `skills/sdd/scripts/_sdd_yaml.py`: переопределить `increase_indent(flow, indentless)` → передавать `indentless=False`.
- [ ] 1.2 В функции `save()` заменить `yaml.safe_dump(data, f, ...)` на `yaml.dump(data, f, Dumper=IndentedDumper, sort_keys=False, allow_unicode=True)`.
- [ ] 1.3 Убедиться что `set-owner` и `move-capability` после патча пишут `  - value` (с 2-space отступом).

## 2. Тест-кейс

- [ ] 2.1 Добавить кейс в `skills/sdd/scripts/cases/` (или в существующий файл кейсов для `_sdd_yaml.py`): после `set-owner` файл содержит строку `  - <capability>` с отступом — не `- <capability>`.
