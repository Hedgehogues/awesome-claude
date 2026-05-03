---
approach: |
  Запустить contradiction.py с тестовым change-dir, проверить stdout на наличие
  PRIMARY-меток и предупреждений для missing merges-into capabilities.
acceptance_criteria:
  - merges-into capability присутствующая в index.yaml помечается [PRIMARY/merges-into]
  - merges-into capability отсутствующая в index.yaml добавляется в Warnings
  - creates draft-spec помечается [PRIMARY/creates DRAFT]
  - Summary содержит поля primary_capabilities и merges_into_missing
---

## Scenarios

### Scenario: merges-into в index — PRIMARY-метка в выводе

```bash
python3 skills/sdd/contradiction/scripts/contradiction.py openspec/changes/sdd-declared-deps
```

Ожидаемый результат: строка вида
`--- Capability: contradiction-full-scan (...) [PRIMARY/merges-into] ---`
присутствует в stdout.

### Scenario: creates draft — PRIMARY/creates DRAFT метка

Из того же запуска: строки вида
`--- Capability: contradiction-deps-validation (...) [PRIMARY/creates DRAFT] ---`
присутствуют в stdout (для каждой из 3 creates-capabilities, отсутствующих в index).

### Scenario: Summary содержит новые поля

Из того же запуска: блок `--- Summary ---` содержит:
```
primary_capabilities: 4
merges_into_missing: 0
```
