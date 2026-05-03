---
approach: |
  Запустить contradiction.py и проверить секцию ADJACENT Capabilities в stdout.
  При наличии ченджей с тематически смежными capabilities — проверить их появление.
acceptance_criteria:
  - секция --- ADJACENT Capabilities --- присутствует в выводе всегда
  - при отсутствии совпадений секция содержит (none)
  - Summary содержит поле adjacent_capabilities
---

## Scenarios

### Scenario: ADJACENT секция всегда присутствует

```bash
python3 skills/sdd/contradiction/scripts/contradiction.py openspec/changes/sdd-declared-deps
```

Ожидаемый результат: stdout содержит `--- ADJACENT Capabilities ---`.

### Scenario: adjacent_capabilities в Summary

Из того же запуска: блок `--- Summary ---` содержит строку `adjacent_capabilities: <N>`
где N ≥ 0.

### Scenario: STOP_TOKENS исключают generic-токены

Токены `sdd`, `skill`, `spec`, `test` не засчитываются как значимые пересечения —
проверить что capability с именем `sdd-something` не попадает в ADJACENT только из-за `sdd`.
