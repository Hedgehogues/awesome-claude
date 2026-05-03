---
name: sdd:propose
workflow_step: 4
description: >
  Предложить новый change: сгенерировать proposal, design, specs, tasks за один шаг.
  Создаёт .sdd.yaml с owner, .sdd-state.yaml (stage=proposed), test-plan.md стабы.
  Проверяет структуру design.md, ссылку на .sdd.yaml в proposal.md, и предлагает
  переключить пересекающиеся capabilities из creates в merges-into.
---

0. **Preflight — проверь наличие openspec** через Bash tool:
   ```bash
   which openspec > /dev/null 2>&1 || echo "NOTFOUND"
   ```
   Если вывод содержит `NOTFOUND` — остановись немедленно с сообщением:
   `openspec not found. Install: npm install -g @openspec/cli`

1. **Определи имя change** из $ARGUMENTS:
   - Если $ARGUMENTS — kebab-case имя (напр. `my-change`) → используй как есть
   - Если $ARGUMENTS — текстовое описание → выведи kebab-case имя (напр. "add user auth" → `add-user-auth`)
   - Если $ARGUMENTS пуст → спроси через AskUserQuestion: "Как назвать change? (kebab-case)"

   Затем создай директорию через Bash tool:
   ```bash
   openspec new change "<name>"
   ```

2. Получи имя change и путь к директории из результата шага 1.
   Директория: `openspec/changes/<name>/`

3. **Получи identity** через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"
   ```
   Сохрани вывод в переменной `<email>`. Если скрипт вернул exit ≠ 0 — остановись с сообщением скрипта (пользователю нужно выполнить `claude auth login` или настроить `git config user.email`).

4. **Создай `.sdd.yaml`** в директории change. Поле `creates:` автозаполни именами capabilities из секции `### New Capabilities` proposal.md (формат: `- capability-name: …` или `- \`capability-name\`: …`). Если секции нет или она пуста — оставь `creates: []`. Поле `merges-into: []`. Поле `owner: ""` (заполнит шаг 6).

   Пример заполненного:
   ```yaml
   creates:
     - my-capability
     - other-capability
   merges-into: []
   owner: ""
   ```

   После записи `creates:` — если хотя бы одна запись остаётся строкой (без поля `title`) — выведи подсказку:
   «Рекомендуется добавить `title` для удобочитаемого отображения в `sdd:apply`. Например: `{name: capability-name, title: "Понятное название"}`. Без title будет использован kebab-case идентификатор.»
   Не блокировать выполнение — подсказка информационная.

5. **Создай `.sdd-state.yaml`** через скрипт:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" update "openspec/changes/<name>/.sdd-state.yaml" owner "<email>"
   python3 "${CLAUDE_SKILL_DIR}/../../scripts/state_manager.py" --ns sdd --skill propose --step proposed --state-file "openspec/changes/<name>/.sdd-state.yaml"
   ```
   PostToolUse hook применит переход `unknown → proposed` автоматически.

6. **Установи owner в `.sdd.yaml`** через скрипт:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" set-owner "openspec/changes/<name>" "<email>"
   ```

7. **Создай `test-plan.md` stub** в директории change:
   ```markdown
   ---
   approach: |
     TODO: describe test approach here
   acceptance_criteria:
     - TODO: criterion one
   ---

   ## Scenarios

   TODO: describe scenarios here.
   ```

8. **Merge-dialog для пересечений `creates:` с `openspec/specs/index.yaml`.**
   Прочитай существующие capability через Bash tool (read-only):
   ```bash
   python3 -c "import yaml; data = yaml.safe_load(open('openspec/specs/index.yaml')) if __import__('os').path.exists('openspec/specs/index.yaml') else {}; print('\n'.join(s.get('capability','') for s in (data or {}).get('specs', [])))"
   ```
   Прочитай `creates:` через `_sdd_yaml.py read`. Для каждого имени из пересечения вызови **AskUserQuestion** с двумя опциями:
   - `Оставить в creates` — capability будет создана как новая (предупреди о namespace clash при archive).
   - `Переключить в merges-into` — расширение существующей.

   При выборе «merges-into» вызови:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" move-capability "openspec/changes/<name>" <cap-name> creates merges-into
   ```

   **MUST NOT** изменять `openspec/specs/index.yaml` — read-only access.

9. **Проверь структуру `design.md`** — вызови `check-design.py` через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/check-design.py" "openspec/changes/<name>"
   ```
   Скрипт проверяет наличие 4 обязательных openspec-секций (наследуется от `openspec instructions design --json`):
   `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`.
   Если скрипт возвращает non-zero exit и сообщает о missing section → запроси исправление от автора и повтори проверку.

10. **Проверь что `proposal.md` ссылается на `.sdd.yaml`**.
    Если ссылки нет → выведи: `proposal.md does not reference .sdd.yaml`
    и запроси добавление ссылки (например: "See `.sdd.yaml` for capability declarations").

11. **Создай stub-кейсы для новых скиллов** (если применимо).

    Если в `## What Changes` или `## Capabilities → New Capabilities` proposal.md упоминается создание нового `skills/<ns>/<skill>/skill.md` (или аналогичного):

    Для каждого нового скилла `<ns>:<skill>` создай файл `skills/<ns>/<skill>/cases/<skill>.md`:

    ```markdown
    ## Case: positive-happy-<skill>-base
    stub: fresh-repo
    contains:
      - "TODO: expected success output"

    ## Case: positive-corner-<skill>-edge
    stub: fresh-repo
    contains:
      - "TODO: edge case output"

    ## Case: negative-missing-input-<skill>-no-artifact
    stub: fresh-repo
    contains:
      - "TODO: missing artifact error"

    ## Case: negative-invalid-input-<skill>-bad-input
    stub: fresh-repo
    contains:
      - "TODO: invalid input error"
    ```

    Сообщи: `Created stub cases for <ns>:<skill> at skills/<ns>/<skill>/cases/<skill>.md — fill in TODO fields before shipping`.

    Если новых скиллов нет — шаг пропускается без вывода.

12. **Запись лога** через Bash tool:
    ```bash
    TS=$(date +%Y%m%dT%H%M%S)
    mkdir -p ".logs/<name>"
    # Записать в .logs/<name>/propose-${TS}.md:
    # frontmatter (change, skill, timestamp, owner)
    # ## Steps — результаты каждого шага (identity, .sdd.yaml created, design-check, capability intersections found/resolved, test-plan created)
    # ## Capability Intersections — что нашлось в index.yaml, как разрешено
    # ## Checks — design structure ok/fail, proposal→.sdd.yaml reference ok/fail
    ```
    В конец финального вывода добавь строку:
    `→ Подробный технический отчёт: .logs/<name>/propose-<TS>.md`
