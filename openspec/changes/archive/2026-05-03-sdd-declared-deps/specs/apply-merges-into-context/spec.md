# Spec: apply-merges-into-context

## Overview

`sdd:apply` загружает спеки capabilities из поля `merges-into` в `.sdd.yaml` как read-only контекст перед реализацией задач из `tasks.md`.

---

## ADDED Requirements

### Requirement: merges-into-context-load

После чтения `test-plan.md` (шаг 3) и до начала реализации `sdd:apply` SHALL:

1. Прочитать поле `merges-into` из `<change-dir>/.sdd.yaml`
2. Для каждой capability из `merges-into`:
   - Найти запись в `openspec/specs/index.yaml` по полю `capability`
   - Загрузить файл по полю `path` относительно `openspec/specs/`
3. Передать загруженные спеки Claude как «Existing capability contracts (read-only context)» — явный блок контекста перед реализацией

Если `merges-into` пуст или отсутствует — шаг пропускается без вывода.

#### Scenario: merges-into загружается как контекст

```
GIVEN .sdd.yaml.merges-into = ["contradiction-full-scan"]
  AND "contradiction-full-scan" присутствует в index.yaml
  AND openspec/specs/contradiction-full-scan/spec.md существует
WHEN sdd:apply выполняется
THEN Claude получает содержимое contradiction-full-scan/spec.md
  как read-only контекст с меткой "Existing capability contracts"
 AND реализация tasks.md выполняется с учётом этого контракта
```

---

### Requirement: merges-into-missing-warning

Если capability из `merges-into` не найдена в `index.yaml` — `sdd:apply` SHALL вывести предупреждение и продолжить реализацию без блокировки:

```
⚠ merges-into capability '<name>' not found in index.yaml — skipping context load
```

#### Scenario: missing merges-into не блокирует apply

```
GIVEN .sdd.yaml.merges-into = ["ghost-cap"]
  AND "ghost-cap" отсутствует в index.yaml
WHEN sdd:apply выполняется
THEN выводится предупреждение о missing capability
 AND реализация задач продолжается
 AND apply НЕ останавливается с ошибкой
```

---

### Requirement: merges-into-readonly

Спеки, загруженные из `merges-into`, SHALL использоваться только как контекст — только для чтения. `sdd:apply` SHALL NOT изменять файлы в `openspec/specs/<merges-into-cap>/` в рамках этого шага.

#### Scenario: merges-into спеки не изменяются в ходе apply

```
GIVEN .sdd.yaml.merges-into = ["contradiction-full-scan"]
  AND openspec/specs/contradiction-full-scan/spec.md существует
WHEN sdd:apply выполняется
THEN openspec/specs/contradiction-full-scan/spec.md не изменяется
 AND файл доступен только как read-only контекст
```
