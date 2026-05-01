---
approach: |
  Тестирование разделено на три уровня:
  1. **Unit-тесты скриптов** (`tests/scripts/`) — `state.py` (transitions, at-first-touch, delete idempotent),
     `identity.py` (mock subprocess для `claude auth status` и `git config`).
  2. **Manual integration** через прогон полного workflow на тестовом change'е:
     /sdd:propose → /sdd:contradiction → /sdd:apply → /sdd:archive с проверкой `.sdd-state.yaml`
     на каждом шаге.
  3. **Edge-case scenarios** для resume (обрыв на verify-failed → перезапуск /sdd:apply),
     ownership (несовпадение identity), merge-dialog (пересечение creates с index.yaml),
     archive-fail (неудачный verify после merge specs → red-banner + ручной rollback).

acceptance_criteria:
  - state.py поддерживает все 4 команды (read/update/transition/delete) с корректными переходами
  - identity.py возвращает email из claude auth status при loggedIn=true; fallback на git config; exit≠0 при недоступности обоих
  - .sdd-state.yaml создаётся в /sdd:propose, обновляется на каждом sdd-шаге, удаляется только при успешном archive
  - identity-check срабатывает в contradiction/apply/archive с warning при несовпадении и opt-in перезаписью
  - merge-dialog в /sdd:propose вызывает AskUserQuestion для каждого пересечения creates ∩ index.yaml.specs
  - red-banner выводится при verify-fail после merge specs; state остаётся archive-failed; файлы specs не откатываются автоматически
  - старые команды /sdd:change-verify и /sdd:spec-verify удалены полностью (skills + commands)
  - resume работает: повторный /sdd:apply после обрыва на verifying не повторяет реализацию
  - .gitignore содержит **/.sdd-state.yaml; git status не показывает state-файлы
  - workflow_step индексы в frontmatter обновлены (apply=6, archive=7); /sdd:help выводит pipeline без verify-узлов
  - после archive файлы в openspec/specs/<cap>/spec.md НЕ содержат поля owner: (assertion: grep -L "^owner:" openspec/specs/**/spec.md)
  - /sdd:propose НЕ модифицирует openspec/specs/index.yaml (assertion: git diff --exit-code openspec/specs/index.yaml после propose возвращает 0)
---

## Scenarios

### Scenario: Полный happy-path workflow

**Setup:** чистый репозиторий, пользователь залогинен в Claude Code.

**Steps:**
1. `/sdd:propose test-feature` — создаётся change с `.sdd-state.yaml stage=proposed`, `.sdd.yaml owner=<email>`.
2. Пользователь правит artifacts вручную.
3. `/sdd:contradiction` — нет hard issues; state переходит в `contradiction-ok`.
4. `/sdd:apply` — реализация → verify (все done) → state = `verify-ok` → `index.yaml` обновлён.
5. `/sdd:archive` — merge specs → spec-verify (все done) → copy test-plan → state удалён → change в `archive/`.

**Expected:** `.sdd-state.yaml` отсутствует после archive; change-директория в `openspec/changes/archive/`; `openspec/specs/<cap>/` содержит spec'ы и test-plan'ы.

### Scenario: Resume после обрыва на verify

**Setup:** change в состоянии `applying` (реализация почти завершена), сессия прервана.

**Steps:**
1. `state.py read` показывает `stage: applying`.
2. Пользователь запускает `/sdd:apply <name>` повторно.
3. Скилл читает state, видит `applying`, продолжает реализацию (или сразу переходит в verify, если все задачи в tasks.md уже отмечены `[x]`).
4. Verify прогоняется; result сохраняется в state.

**Expected:** скилл не дублирует уже выполненные задачи; resume точечный.

### Scenario: Identity mismatch warning и opt-in

**Setup:** change с `owner: a@x` создан коллегой; текущий пользователь `b@x`.

**Steps:**
1. `b@x` запускает `/sdd:contradiction`.
2. Скилл вызывает `identity.py` → `b@x` ≠ `a@x`.
3. Выводит warning + AskUserQuestion «перезаписать на тебя?».
4a. Если «да» — `.sdd.yaml owner: b@x`, продолжает.
4b. Если «нет» — стоп с сообщением «работа над чужим change'ем отклонена», state не меняется.

**Expected:** silent override никогда не происходит.

### Scenario: Merge-dialog для существующей capability

**Setup:** `openspec/specs/index.yaml` содержит `capability: existing-cap`. Пользователь делает `/sdd:propose <name>`, в `.sdd.yaml creates:` попадает `existing-cap`.

**Steps:**
1. `/sdd:propose` после генерации сравнивает `creates:` с `index.yaml`.
2. Detected конфликт по `existing-cap`.
3. AskUserQuestion: «creates» или «merges-into»?
4. При выборе «merges-into»: `sdd_yaml.py move-capability` → `creates: [...]` без `existing-cap`, `merges-into: [existing-cap]`.

**Expected:** `.sdd.yaml` корректно обновлён; повторный run propose не задаёт вопрос для уже-merged capabilities.

### Scenario: Archive fail после merge specs (red-banner)

**Setup:** change с `spec.md`, который ссылается на скилл, не созданный реализацией (бажная имплементация). `/sdd:apply` прошёл с verify-ok (tasks.md был корректен), но live-spec расходится.

**Steps:**
1. `/sdd:archive` — merge specs прошёл; specs в `openspec/specs/` обновлены.
2. Inline spec-verify обнаружил Requirement с `verdict: missing`.
3. Скилл выводит red-banner с двумя опциями (`git restore` или новый change).
4. State обновляется на `archive-failed`; файл НЕ удаляется.
5. Скилл останавливается; не пытается откатить `openspec/specs/`.

**Expected:** пользователь сам решает, чинить руками или начать новый change.

### Scenario: REMOVED Requirement и удаление файла

**Setup:** change удаляет старый скилл; spec содержит `## REMOVED Requirements` с упоминанием `skills/sdd/old.md`.

**Steps:**
1. Реализация удаляет файл `skills/sdd/old.md`.
2. `/sdd:archive` → spec-verify с REMOVED-инверсией.
3. L1 inverted: файл не существует → pass; verdict `done`.

**Expected:** REMOVED-блоки корректно обрабатываются; verdict не `missing` несмотря на физическое отсутствие файла.

### Scenario: At-first-touch для legacy change без state

**Setup:** старый change в `openspec/changes/legacy-change/` без `.sdd-state.yaml`.

**Steps:**
1. Пользователь запускает `/sdd:apply legacy-change`.
2. `state.py` обнаруживает отсутствие файла, создаёт его со `stage: unknown`, `owner: <current email>`.
3. Скилл продолжает workflow; следующий `state.py transition applying` обновит stage.

**Expected:** legacy-change'и не ломаются; state-system самовосстанавливается.

### Scenario: Identity недоступна (CI/automation)

**Setup:** `claude` CLI отсутствует, `git config user.email` не задан.

**Steps:**
1. Любой sdd-скилл вызывает `identity.py`.
2. Скрипт пробует `claude auth status` → fail; пробует `git config user.email` → пусто.
3. Exit с ненулевым кодом и сообщением.
4. SDD-скилл останавливается с инструкцией пользователю.

**Expected:** скилл не молча подставляет фейковую identity; явная ошибка.

### Scenario: Owner живёт только в change-уровне (live spec не получает owner)

**Setup:** change `feature-x` с `owner: user@example.com` в `.sdd.yaml`, capability `feature-x` в `creates:`. Полный workflow до archive завершён успешно.

**Steps:**
1. После `/sdd:archive feature-x` проверить `openspec/specs/feature-x/spec.md`.
2. Прогнать assertion: `grep -c "^owner:" openspec/specs/feature-x/spec.md` → 0.
3. Прогнать assertion для всех live-spec'ов: `grep -l "^owner:" openspec/specs/**/spec.md` → пусто.
4. Открыть архив `openspec/changes/archive/<date>-feature-x/.sdd.yaml` — там `owner:` сохранён.

**Expected:** owner присутствует только в `.sdd.yaml` (включая архивированную версию); в live `openspec/specs/` ни один файл не содержит поле `owner:`.

### Scenario: Index.yaml read-only в /sdd:propose

**Setup:** репозиторий с непустым `openspec/specs/index.yaml`. Текущая HEAD чистая.

**Steps:**
1. Запустить `/sdd:propose new-change-x` (включая merge-dialog при наличии пересечений).
2. После завершения propose выполнить: `git diff --exit-code openspec/specs/index.yaml`.
3. Команда MUST возвращать exit-code 0 (нет изменений).
4. Проверить, что новые записи в `index.yaml` появляются ТОЛЬКО после `/sdd:apply` (для `creates:`) или `/sdd:archive` (для `merges-into:` sync).

**Expected:** propose не модифицирует index.yaml ни при каком сценарии (включая выбор «merges-into» в merge-dialog — запись в index.yaml откладывается до apply/archive).
