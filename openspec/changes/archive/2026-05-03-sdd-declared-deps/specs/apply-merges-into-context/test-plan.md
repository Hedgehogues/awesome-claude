---
approach: |
  Запустить sdd:apply на ченже с заполненным merges-into и проверить,
  что спеки merges-into capabilities появляются в контексте до реализации задач.
acceptance_criteria:
  - sdd:apply загружает spec.md для каждой capability из merges-into
  - при missing merges-into capability выводится warning и apply продолжается
  - loaded specs помечены как read-only context
---

## Scenarios

### Scenario: merges-into spec загружается как контекст

Запустить sdd:apply на ченже с merges-into = ["contradiction-full-scan"].
Ожидаемый результат: `sdd:apply` читает `openspec/specs/contradiction-full-scan/spec.md`
и передаёт его Claude перед реализацией задач под меткой
«Existing capability contracts (read-only context)».

### Scenario: missing merges-into — warning, не блокировка

Запустить sdd:apply на ченже с merges-into = ["ghost-capability"] (не в index.yaml).
Ожидаемый результат: в выводе присутствует предупреждение
`⚠ merges-into capability 'ghost-capability' not found in index.yaml`
и реализация задач продолжается.
