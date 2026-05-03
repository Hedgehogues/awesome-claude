# Spec: contradiction-deps-validation

## Overview

`contradiction.py` явно валидирует capabilities из `.sdd.yaml` (`creates` и `merges-into`) и маркирует их как PRIMARY в пакете анализа.

---

## ADDED Requirements

### Requirement: merges-into-validation

contradiction.py SHALL валидировать каждую capability из `.sdd.yaml.merges-into` против `openspec/specs/index.yaml`:

- Если capability **присутствует** в `openspec/specs/index.yaml` — SHALL загружаться и помечаться суффиксом `[PRIMARY/merges-into]` в разделителе: `--- Capability: <name> (<path>) [PRIMARY/merges-into] ---`
- Если capability **отсутствует** в `openspec/specs/index.yaml` — SHALL добавляться в `warnings` с текстом: `merges-into capability '<name>' not found in index.yaml`; в основной пакет не включается

#### Scenario: merges-into capability присутствует в index

```
GIVEN .sdd.yaml.merges-into = ["existing-cap"]
  AND "existing-cap" присутствует в index.yaml с path "existing-cap/spec.md"
WHEN contradiction.py выполняется
THEN stdout содержит "--- Capability: existing-cap (existing-cap/spec.md) [PRIMARY/merges-into] ---"
 AND "existing-cap" загружается до начала background capabilities
```

#### Scenario: merges-into capability отсутствует в index

```
GIVEN .sdd.yaml.merges-into = ["ghost-cap"]
  AND "ghost-cap" отсутствует в index.yaml
WHEN contradiction.py выполняется
THEN stdout содержит "merges-into capability 'ghost-cap' not found in index.yaml" в секции Warnings
 AND "ghost-cap" не появляется в пакете как загруженная capability
```

---

### Requirement: creates-primary-labeling

Capability из `.sdd.yaml.creates`, загруженная как live spec (уже в index.yaml), SHALL помечаться `[PRIMARY/creates]`.

Capability из `.sdd.yaml.creates`, загруженная как draft spec, SHALL помечаться `[PRIMARY/creates DRAFT]` (вместо текущего `[DRAFT]`).

#### Scenario: creates capability — live

```
GIVEN .sdd.yaml.creates = ["new-cap"]
  AND "new-cap" присутствует в index.yaml
WHEN contradiction.py выполняется
THEN stdout содержит "--- Capability: new-cap (...) [PRIMARY/creates] ---"
```

#### Scenario: creates capability — draft

```
GIVEN .sdd.yaml.creates = ["draft-cap"]
  AND "draft-cap" отсутствует в index.yaml
  AND openspec/changes/<name>/specs/draft-cap/spec.md существует
WHEN contradiction.py выполняется
THEN stdout содержит "--- Capability: draft-cap (...) [PRIMARY/creates DRAFT] ---"
```

---

### Requirement: summary-primary-count

В секции Summary скрипта SHALL присутствовать поле:
```
primary_capabilities: <N>
merges_into_missing: <M>
```

где N = количество успешно загруженных PRIMARY capabilities, M = количество merges-into не найденных в index.

#### Scenario: Summary содержит поля primary_capabilities и merges_into_missing

```
GIVEN .sdd.yaml с непустыми creates и merges-into
WHEN contradiction.py выполняется
THEN stdout содержит строку "primary_capabilities: <N>"
 AND stdout содержит строку "merges_into_missing: <M>"
```
