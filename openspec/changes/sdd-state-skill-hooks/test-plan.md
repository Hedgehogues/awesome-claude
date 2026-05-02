---
approach: |
  Тестирование на трёх уровнях:
  1. **Smoke-тест state_hook.py**: прогон скрипта с фейковым stdin JSON, проверка
     что вызывается корректный state.py transition.
  2. **Manual integration**: полный workflow propose→contradiction→apply→archive
     с включённым hook'ом — проверка автоматических transitions без ручных вызовов.
  3. **Edge cases**: hook без change-name (silent fail), невалидный transition,
     verify_status=failed маршрут.

acceptance_criteria:
  - "state_hook.py парсит stdin JSON и резолвит change-name через args или freshest state-file"
  - "state_hook.py маппит sdd:apply + verify_status=ok → state.py transition verify-ok"
  - "state_hook.py exit 0 во всех ошибочных сценариях (нерезолвенный change, невалидный transition)"
  - "PostToolUse hook сконфигурирован в .claude/settings.json с матчером Skill"
  - "skill.md файлы НЕ содержат прямых state.py transition вызовов"
  - "skill.md файлы apply/archive/contradiction содержат state.py update verify_status перед завершением"
  - "verify_status поле валидируется state.py (значения ok/failed/n/a)"
  - "End-to-end workflow propose→contradiction→apply→archive с hook'ом — все transitions автоматические"
  - "Workflow без hook (settings.json пуст) — скиллы функционально работают, но state не обновляется"
  - "/sdd:archive с verify_status=ok → hook ставит archived → state-file удаляется"
  - "/sdd:archive с verify_status=failed → hook ставит archive-failed → state-file сохраняется"
---

## Scenarios

### Scenario: state_hook.py резолвит change через args

**Setup:** `openspec/changes/foo/.sdd-state.yaml` существует со `stage: contradiction-ok, verify_status: ok`.

**Steps:**
1. Подать на stdin state_hook.py JSON: `{"tool_name": "Skill", "tool_input": {"skill": "sdd:apply", "args": "foo"}, "tool_response": {"success": true}}`
2. Hook резолвит change = foo, читает verify_status = ok.
3. Hook вызывает `state.py transition openspec/changes/foo/.sdd-state.yaml verify-ok`.

**Expected:** state.yaml.stage = verify-ok после прогона.

### Scenario: state_hook.py fallback на freshest state-file

**Setup:** Только один активный change `openspec/changes/foo/.sdd-state.yaml`. Skill вызвана без args.

**Steps:**
1. Подать stdin без change-name в args.
2. Hook ищет all `openspec/changes/*/.sdd-state.yaml`, выбирает freshest по last_step_at.
3. Hook применяет transition к найденному.

**Expected:** stage обновлён в foo's state-file.

### Scenario: state_hook.py silent fail на нерезолвенном change

**Setup:** Нет ни одного `.sdd-state.yaml` в `openspec/changes/`.

**Steps:**
1. Подать stdin с `tool_input.skill: sdd:apply`, args без change-name.
2. Hook не находит change, выводит warning в stderr.
3. Hook exit 0.

**Expected:** harness не валится; пользователь видит warning.

### Scenario: Полный workflow с hook'ом

**Setup:** `.claude/settings.json` содержит PostToolUse hook на Skill matcher.

**Steps:**
1. `/sdd:propose test-hook` → hook автоматически ставит state в `proposed`.
2. `/sdd:contradiction` → hook читает `verify_status` (после прогона детекторов скилл записал ok), ставит `contradiction-ok`.
3. `/sdd:apply` → скилл прогоняет inline verify, записывает `verify_status: ok`, hook ставит `verify-ok`.
4. `/sdd:archive` → скилл прогоняет spec-verify, записывает `verify_status: ok`, hook ставит `archived`.
5. `.sdd-state.yaml` удалён в финале.

**Expected:** Ни одного ручного `state.py transition` вызова от пользователя. Все transitions через hook.

### Scenario: verify-failed маршрут

**Setup:** Change с заведомо missing artifact в tasks.md.

**Steps:**
1. `/sdd:apply <change>` — inline verify обнаруживает missing.
2. Скилл записывает `verify_status: failed`.
3. Hook читает `verify_status`, маппит apply+failed → `verify-failed`.
4. State.stage = `verify-failed`. `index.yaml` НЕ обновляется.

**Expected:** State корректно отражает fail; пользователь чинит и перезапускает.

### Scenario: archive-failed с red-banner

**Setup:** Change с инвалидным spec.md (Requirement не реализован).

**Steps:**
1. `/sdd:archive <change>` — merge specs прошёл; spec-verify fail.
2. Скилл выводит red-banner, записывает `verify_status: failed`.
3. Hook ставит `archive-failed`.
4. `.sdd-state.yaml` НЕ удаляется.

**Expected:** Пользователь видит red-banner и может починить руками.

### Scenario: Workflow без hook (settings.json пуст)

**Setup:** `.claude/settings.json` без PostToolUse Skill hook.

**Steps:**
1. `/sdd:propose test → /sdd:apply test`.
2. Скиллы выполняются полностью; `verify_status` записывается.
3. Hook не вызывается → state.stage не обновляется автоматически.

**Expected:** Workflow функционально работает, state остаётся в начальном `unknown` или последнем явно установленном. Документировано как known limitation.
