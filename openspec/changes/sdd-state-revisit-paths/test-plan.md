---
approach: |
  Минимальное тестирование: 4 новых перехода через прямой вызов state.py.
  Покрытие через скилл-кейсы избыточно — это патч на 3 строки в ALLOWED_TRANSITIONS dict.

acceptance_criteria:
  - "state.py transition contradiction-ok proposed возвращается с exit 0 (раньше отвергался)"
  - "state.py transition verify-ok verifying возвращается с exit 0"
  - "state.py transition verify-ok applying возвращается с exit 0"
  - "state.py transition archive-failed verify-ok возвращается с exit 0"
  - "state.py transition archived <anything> по-прежнему отвергается (terminal сохранён)"
  - "Существующие переходы (proposed→contradiction-ok, verifying→verify-ok и т.д.) продолжают работать"
  - ".sdd-state.yaml после нового перехода содержит обновлённый stage и last_step_at"
---

## Scenarios

### Scenario: verify-ok → verifying re-verify

**Setup:** `.sdd-state.yaml stage=verify-ok`.

**Steps:**
1. `state.py transition <path> verifying`
2. Проверить exit code 0 и содержимое state-file.

**Expected:** stage=verifying, last_step_at обновлён.

### Scenario: verify-ok → applying re-implement

**Setup:** `.sdd-state.yaml stage=verify-ok`.

**Steps:**
1. `state.py transition <path> applying`

**Expected:** stage=applying, exit 0.

### Scenario: contradiction-ok → proposed re-edit

**Setup:** `.sdd-state.yaml stage=contradiction-ok`.

**Steps:**
1. `state.py transition <path> proposed`

**Expected:** stage=proposed, exit 0.

### Scenario: archive-failed → verify-ok external resolve

**Setup:** `.sdd-state.yaml stage=archive-failed`.

**Steps:**
1. `state.py transition <path> verify-ok`

**Expected:** stage=verify-ok, exit 0.

### Scenario: archived остаётся terminal

**Setup:** `.sdd-state.yaml stage=archived`.

**Steps:**
1. `state.py transition <path> verify-ok` → ожидаем exit ≠ 0.
2. `state.py transition <path> archiving` → ожидаем exit ≠ 0.

**Expected:** оба отвергнуты с `not allowed`.

### Scenario: Регрессии не возникло

**Setup:** Существующие тестовые сценарии (если были) или ручной прогон существующих переходов.

**Steps:**
1. `state.py transition <path> proposed → contradiction-ok` — работает.
2. `state.py transition <path> applying → verifying → verify-ok` — работает.

**Expected:** Все existing happy-path переходы сохранены.
