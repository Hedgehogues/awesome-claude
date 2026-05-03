## MODIFIED Requirements

### Requirement: _sdd_yaml.py сохраняет .sdd.yaml с отступами у списков

`skills/sdd/scripts/_sdd_yaml.py` функция `save()` SHALL записывать sequence-элементы с отступом относительно ключа (`  - value`, не `- value`) при любой операции записи.

#### Scenario: set-owner сохраняет отступ у creates

- **GIVEN** `.sdd.yaml` содержит `creates: [my-capability]`
- **WHEN** `_sdd_yaml.py set-owner <dir> user@example.com`
- **THEN** файл содержит строку `  - my-capability` (2 пробела + дефис)
- **THEN** файл НЕ содержит строку `- my-capability` без отступа

#### Scenario: move-capability сохраняет отступ у обоих списков

- **WHEN** `_sdd_yaml.py move-capability <dir> my-cap creates merges-into`
- **THEN** в `merges-into:` запись `  - my-cap` с отступом
- **THEN** `creates:` пуст (`[]` или пустой список с отступом)

#### Scenario: Edit-инструмент находит строку после вызова скрипта

- **GIVEN** файл записан через `_sdd_yaml.py`
- **WHEN** Edit-инструмент ищет `  - my-capability`
- **THEN** строка найдена, Edit выполняется успешно
