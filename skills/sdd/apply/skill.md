---
name: sdd:apply
workflow_step: 6
description: >
  Реализовать задачи из tasks.md текущего change'а с встроенной L1/L2/L3 верификацией.
  Читает test-plan.md как контекст. Обновляет .sdd-state.yaml на каждом подшаге.
  Обновляет openspec/specs/index.yaml для новых capabilities (только при verify-ok).
  OpenSpec CLI устанавливается автоматически по версии из .openspec-version.
---

1. Определи имя change из $ARGUMENTS или контекста разговора. Сохрани `<change-dir>` = `openspec/changes/<name>`.

2. **Identity check.** Через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"
   ```
   Прочитай `owner:` из `.sdd.yaml`:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" read "<change-dir>"
   ```
   Если `owner != email` → warning через AskUserQuestion: `⚠ change owner=<owner>, ты <email>. Перезаписать на тебя?`. При согласии:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" set-owner "<change-dir>" "<email>"
   ```
   При отказе — остановись.

3. **Прочитай `test-plan.md`** если существует в `<change-dir>/test-plan.md`.
   Используй `acceptance_criteria` и `## Scenarios` как контекст при написании тестов.

4. **State transition → applying**:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" transition "<change-dir>/.sdd-state.yaml" applying
   ```

5. Вызови скилл `openspec-apply-change` через Skill tool. Передай аргументы: $ARGUMENTS

6. **State transition → verifying**:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" transition "<change-dir>/.sdd-state.yaml" verifying
   ```

7. **Inline L1/L2/L3 verification против `tasks.md`.**
   <!-- KEEP IN SYNC: skills/sdd/archive/skill.md verify section -->

   Никакого внешнего кода — всё делаешь ты, модель, в одном прогоне.

   **Парсинг задач.** Из `<change-dir>/tasks.md` извлеки все `- [x]` и `- [ ]`. Для каждой задачи:
   - описание артефакта (файл, команда, секция документа, конфигурация);
   - тип артефакта (skill, command, document, config, spec);
   - путь к файлу если упоминается явно, иначе выводи из контекста.

   Если артефакт не идентифицируется → вердикт `human_needed` («could not identify artifact»).

   **Парсинг групп.** `## N.` — границы групп. Каждая задача в ближайшей предыдущей группе.

   **Task verification loop.** Для каждой задачи:
   1. Прогон **L1 Exists → L2 Substantive → L3 Wired**.
   2. Вердикт: `done | partial | missing | human_needed`.

   Правила остановки:
   - L1 fail → `missing`, L2/L3 пропускаются.
   - L2 fail → `partial`, L3 запускается.
   - L3 fail → `partial`.
   - L1+L2+L3 pass → `done`.
   - L3 неприменим → `N/A`, вердикт по L1+L2.

   **L2 stub detection.** Заглушка если содержит `<!-- TODO -->`/placeholder/пустые секции/только frontmatter.

   **L3 wiring heuristics:**

   | Тип | Где искать wiring |
   |---|---|
   | skill (`skills/<ns>/<skill>/skill.md`) | упоминание в `CLAUDE.md` + `README.md` |
   | command (`commands/<ns>/<name>.md`) | тело ссылается на скилл `<ns>:<name>` |
   | document (`README.md`, `CLAUDE.md`) | cross-ref из связанных файлов |
   | config (`.json`, `.yaml`, hooks) | упоминание пути в документации |
   | spec (`specs/**/spec.md`) | упоминание в `design.md` |

   Если wiring неприменим — `L3 = N/A`.

   **Human-needed:** требует live-запуска / визуальной проверки / интеграции с внешним сервисом / артефакт не идентифицирован.

   **Group-level aggregation.** Для каждой `## N.` группы:
   - `complete` — все done или human_needed;
   - `incomplete` — есть partial/missing;
   - `pending` — нет идентифицируемых артефактов.

   **Cross-task convergence** (только если есть partial/missing): подозрительные узлы, каскад, межгрупповая связность, BLOCKER vs RISK.

   **Heuristic optimization:**
   - L1 fail → skip L2/L3 молча;
   - дедупликация чтений одного файла;
   - skip convergence если нет partial/missing;
   - Batch L3 при >20 задачах с пометкой `[optimized: batched L3 for <type>]`.

   **Absence check** (после loop): `git diff --name-only HEAD` — несопоставленные с tasks.md файлы → секция out-of-scope.

   **Coverage smoke review:** Requirement без задачи / capability без задачи → секция coverage gaps.

   **Verdict:**
   - `passed` — все done;
   - `gaps_found` — есть missing/partial;
   - `human_needed` — нет gaps, есть human_needed.

8. **State transition по результату verify**:
   ```bash
   # passed → verify-ok
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" transition "<change-dir>/.sdd-state.yaml" verify-ok

   # gaps_found или human_needed → verify-failed
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" transition "<change-dir>/.sdd-state.yaml" verify-failed
   ```

9. **Update `openspec/specs/index.yaml` (только если stage=verify-ok)**:
   Если verify прошёл успешно — прочитай `<change-dir>/.sdd.yaml`. Для каждой capability в поле `creates` — добавь или обнови запись в `openspec/specs/index.yaml`:
   ```yaml
   specs:
     - capability: <name>
       description: <краткое описание из proposal.md → Capabilities>
       path: <capability>/spec.md
       test_plan: <capability>/test-plan.md
   ```
   Если `openspec/specs/index.yaml` не существует — создай его с корневым ключом `specs:`.
   Если `.sdd.yaml` отсутствует или `creates` пуст — пропусти этот шаг.

   При `stage=verify-failed` — пропусти шаг полностью и переходи к финальному отчёту с verdict failed.

10. **Сгенерируй semantic test cases из test-plan.md** (только если stage=verify-ok):
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/scripts/test-plan-to-cases.py" "<change-dir>"
    ```
    Скрипт читает `test-plan.md` (front matter `acceptance_criteria`) и `.sdd.yaml` (`creates`), генерирует `skills/skill/cases/<ns>/<cap>/<ac_id>.md` для каждого критерия.

11. **Финальный отчёт**: вызови через Bash tool:
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/../scripts/apply_report.py" "<change-dir>"
    ```
    Скрипт возвращает JSON `{capabilities[], file_facts[], verify[]}`.
    Используй его как источник данных для рендера отчёта в **строгом порядке блоков**:

    ```markdown
    ## Технические статусы
    <буллеты: пути файлов, результаты тестов, exit codes, обновления index.yaml, verify verdict, текущая stage в .sdd-state.yaml — только факты, без прозы>

    ## Описание
    <2–5 предложений прозы: что реализовано на уровне фич>

    ## Реализованные фичи
    <для каждого capability из JSON.capabilities: имя + статус done|partial>
    <если JSON.capabilities пусто — тело `_нет_`, заголовок остаётся>

    ## Как проверить
    <для каждой фичи из JSON.verify — три поля:>
    1. **<capability-name>**
       - **Что:** <scenario из verify[].scenario>
       - **Где:** <verify[].where>
       - **Как:** `<команда>` → ожидание: <наблюдаемый результат>
    <если JSON.capabilities пуст или test-plan.md отсутствует — тело `_нет_`, заголовок остаётся>

    ## Решено самостоятельно
    <опционально; только если принимались автономные решения; формат: «вопрос → решение»; опускается если пусто>

    ## Прочее
    <опционально; риторические замечания, follow-up идеи без принятого решения; опускается если пусто>

    ## Вопросы к пользователю
    <только реальные user-only вопросы нумерованным списком; если таких нет — ровно одна строка: `Продолжаю.`>
    <синтетический CTA «Продолжаем по флоу?» ЗАПРЕЩЁН>
    <этот блок — последний; после него нет заголовков и прозы>
    ```

    **Правила коммуникационного стиля:**
    1. **По умолчанию — действие, не вопрос.** Любую развилку, которую можно закрыть разумным предположением, закрывай автономно и фиксируй в `## Решено самостоятельно`. В `## Вопросы к пользователю` — только если ответ физически невозможно вывести без знания/преференции пользователя.
    2. **Форма ответа = форма запроса.** Семиблочный формат — только в этом финальном выводе. В промежуточной переписке (уточнения, мета-вопросы внутри работы скилла) — проза, 2–3 предложения, без markdown-секций.
    3. **Действие первое, отчёт после.** Edit/Write выполняются до отчётности; pre-action narration разрешена только для деструктивных/долгих операций.
    4. **Ноль внутреннего жаргона в user-facing полях.** В `## Описание` и `## Решено самостоятельно` SHALL NOT появляться: `hard issue`, `drift_score`, `residual_risk`, `SSOT`, `pointer-rewrite`, `Mandatory-блок N`. Использовать простой язык.
