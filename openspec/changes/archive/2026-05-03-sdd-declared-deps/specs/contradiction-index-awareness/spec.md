# Spec: contradiction-index-awareness

## Overview

`contradiction.py` после загрузки основного пакета выполняет index awareness scan — находит capabilities в `index.yaml`, тематически смежные с `creates ∪ merges-into`, и выводит их отдельной секцией.

---

## ADDED Requirements

### Requirement: adjacent-detection

После загрузки PRIMARY и background capabilities скрипт SHALL выполнить index awareness scan:

1. Собрать токены из имён capabilities в `creates ∪ merges-into` (split по `-`, `_`, пробелам; lowercase; фильтр: длина > 3, не в стоп-листе)
2. Для каждой capability из index.yaml, **не входящей** в `creates ∪ merges-into`:
   - Вычислить пересечение её токенов (из имени capability) с токенами шага 1
   - Если |пересечение| ≥ 2 — capability считается ADJACENT
3. ADJACENT capabilities выводятся в отдельной секции `--- ADJACENT Capabilities ---` одной строкой на capability: `<name>: shared tokens [<tok1>, <tok2>, ...]`

**Стоп-лист токенов** (не считаются как значимые): `sdd`, `skill`, `spec`, `test`, `change`, `draft`, `with`, `from`, `into`, `that`, `this`, `from`

#### Scenario: есть ADJACENT capabilities

```
GIVEN .sdd.yaml.creates = ["contradiction-deps-validation"]
  AND index.yaml содержит capability "contradiction-full-scan"
  AND "contradiction-full-scan" не в creates/merges-into
  AND shared tokens = ["contradiction"] (только 1 — порог не достигнут)
WHEN contradiction.py выполняется
THEN "contradiction-full-scan" НЕ выводится как ADJACENT
```

```
GIVEN .sdd.yaml.creates = ["contradiction-index-aware"]
  AND index.yaml содержит capability "contradiction-full-scan"
  AND shared non-trivial tokens = ["contradiction", "full"] (≥2)
WHEN contradiction.py выполняется
THEN stdout содержит секцию "--- ADJACENT Capabilities ---"
 AND секция содержит строку "contradiction-full-scan: shared tokens [contradiction, full]"
```

#### Scenario: нет ADJACENT capabilities

```
GIVEN .sdd.yaml.creates = ["sre-gitlab-pr"]
  AND все capabilities в index.yaml не имеют ≥2 shared non-trivial tokens
WHEN contradiction.py выполняется
THEN секция "--- ADJACENT Capabilities ---" либо отсутствует, либо содержит "(none)"
```

---

### Requirement: summary-adjacent-count

В секции Summary SHALL присутствовать поле:
```
adjacent_capabilities: <K>
```

где K = количество обнаруженных ADJACENT capabilities (0 если нет).

#### Scenario: поле присутствует при K=0

```
GIVEN нет ADJACENT capabilities
WHEN contradiction.py выполняется
THEN stdout содержит "adjacent_capabilities: 0"
```
