---
name: sdd:apply
workflow_step: 6
description: >
  Реализовать задачи из tasks.md текущего change'а с встроенной L1/L2/L3 верификацией.
  Читает test-plan.md как контекст. Обновляет .sdd-state.yaml на каждом подшаге.
  Обновляет openspec/specs/index.yaml для новых capabilities (только при verify-ok).
---

0. **Preflight — проверь наличие openspec** через Bash tool:
   ```bash
   which openspec > /dev/null 2>&1 || echo "NOTFOUND"
   ```
   Если вывод содержит `NOTFOUND` — остановись немедленно с сообщением:
   `openspec not found. Install: npm install -g @openspec/cli`

1. **Determine Change.**

   Если `$ARGUMENTS` непуст — используй как имя ченджа.

   Если `$ARGUMENTS` пуст:

   **Режим A — контекст очевиден.**
   Если в текущем разговоре уже обсуждался конкретный чендж — НЕ вызывай никаких инструментов. Через `AskUserQuestion` покажи список:
   1. Продолжить с `<name>` (наиболее вероятный)
   2. Выбрать другой чендж

   Если пользователь выбрал вариант 2 — переходи к режиму B.

   **Режим B — контекст неоднозначен.**
   Выполни через Bash tool:
   ```bash
   git branch --show-current
   git status --short
   ls openspec/changes/
   ```
   Сканируй `openspec/changes/`, ранжируй кандидатов по трём сигналам (убыв. приоритет): совпадение имени ветки, наличие изменённых файлов в директории ченджа, директория не архивирована. Через `AskUserQuestion` покажи нумерованный список до 7 кандидатов. Дождись выбора.

   Сохрани `<change-dir>` = `openspec/changes/<name>`.

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

3a. **Загрузи спеки `merges-into` как read-only контекст.**

    Прочитай поле `merges-into` из `.sdd.yaml`:
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" read "<change-dir>"
    ```
    Для каждой capability из `merges-into`:
    1. Найди её `path` в `openspec/specs/index.yaml` (поле `path` записи с совпадающим `capability`)
    2. Прочитай файл `openspec/specs/<path>` через Read tool

    Передай загруженные спеки Claude как **«Existing capability contracts (read-only context)»** — явный блок перед реализацией задач. Используй только для сверки: реализация не должна нарушать существующие контракты.

    Если `merges-into` пуст или отсутствует — шаг пропускается без вывода.

    Если capability из `merges-into` не найдена в `index.yaml` — выведи предупреждение и продолжи:
    `⚠ merges-into capability '<name>' not found in index.yaml — skipping context load`

4. Вызови скилл `opsx:apply` через Skill tool. Передай аргументы: $ARGUMENTS

5. **Inline L1/L2/L3 verification против `tasks.md`.**
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

6. **Запиши pending_transitions для hook'а** (сразу после verify):
   ```bash
   # passed:
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state_manager.py" --ns sdd --skill apply --step start --state-file "<change-dir>/.sdd-state.yaml"
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state_manager.py" --ns sdd --skill apply --step verify-start --state-file "<change-dir>/.sdd-state.yaml"
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state_manager.py" --ns sdd --skill apply --step verify-passed --state-file "<change-dir>/.sdd-state.yaml"

   # gaps_found или human_needed:
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state_manager.py" --ns sdd --skill apply --step start --state-file "<change-dir>/.sdd-state.yaml"
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state_manager.py" --ns sdd --skill apply --step verify-failed --state-file "<change-dir>/.sdd-state.yaml"
   ```
   PostToolUse hook прочитает поле и применит переходы автоматически.

7. **Update `openspec/specs/index.yaml` (только если verify verdict=passed)**:
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

   При verify verdict=failed — пропусти шаг полностью и переходи к финальному отчёту с verdict failed.

8. **Сгенерируй semantic test cases из test-plan.md** (только если verify verdict=passed):
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/scripts/test-plan-to-cases.py" "<change-dir>"
    ```
    Скрипт читает `test-plan.md` (front matter `acceptance_criteria`) и `.sdd.yaml` (`creates`), генерирует `skills/skill/cases/<ns>/<cap>/<ac_id>.md` для каждого критерия.

9. **Запись лога и финальный отчёт**:

    Сначала запиши лог через Bash tool:
    ```bash
    TS=$(date +%Y%m%dT%H%M%S)
    mkdir -p ".logs/<name>"
    # Записать в .logs/<name>/apply-${TS}.md:
    # frontmatter (change, skill, timestamp, verify_verdict, stage)
    # ## Task Verification Results — вердикт L1/L2/L3 по каждой задаче
    # ## Coverage Gaps — missing/partial задачи
    # ## Index Updates — добавленные capabilities в index.yaml
    ```

    Затем вызови финальный отчёт через Bash tool:
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/../scripts/apply_report.py" "<change-dir>"
    ```
    Скрипт возвращает JSON `{capabilities[], file_facts[], verify[]}`.
    Используй его как источник данных для рендера отчёта в **строгом порядке блоков**:

    ```markdown
    ## Описание
    <2–5 предложений прозы: что реализовано на уровне фич>

    ## Реализованные фичи
    <для каждого capability из JSON.capabilities:
      - отображаемое имя: title если задан (JSON.capabilities[i].title), иначе name
      - статус: done → «готово», partial → «частично (N задач не завершено)»
        где N = incomplete_count из JSON.capabilities[i].incomplete_count>
    <если JSON.capabilities пусто — тело `_нет_`, заголовок остаётся>

    ## Как проверить
    <для каждой фичи из JSON.verify — три поля:>
    1. **<title если задан (verify[i].title), иначе name>**
       - **Что:** <ожидаемое поведение с точки зрения пользователя — что пользователь видит или ощущает; без имён файлов, скриптов и технических инвариантов>
       - **Где:** <verify[].where>
       - **Как:** <сначала предложение на русском с ожидаемым результатом («После запуска apply state-файл содержит…»); если нужна команда — идёт следом как уточнение; поле НЕ начинается с голой shell-команды>
    <если JSON.capabilities пуст или test-plan.md отсутствует — тело `_нет_`, заголовок остаётся>

    ## Решено самостоятельно
    <опционально; только если принимались автономные решения; формат: «вопрос → решение»; опускается если пусто>

    ## Прочее
    <опционально; риторические замечания, follow-up идеи без принятого решения; опускается если пусто>

    ## Вопросы к пользователю
    <только реальные user-only вопросы нумерованным списком; если таких нет — ровно одна строка: `Продолжаю.`>
    <синтетический CTA «Продолжаем по флоу?» ЗАПРЕЩЁН>
    <этот блок — последний; после него нет заголовков и прозы>
    → Подробный технический отчёт: .logs/<name>/apply-<TS>.md
    ```

    **Правила коммуникационного стиля:**
    1. **По умолчанию — действие, не вопрос.** Любую развилку, которую можно закрыть разумным предположением, закрывай автономно и фиксируй в `## Решено самостоятельно`. В `## Вопросы к пользователю` — только если ответ физически невозможно вывести без знания/преференции пользователя.
    2. **Форма ответа = форма запроса.** Шестиблочный формат — только в этом финальном выводе. В промежуточной переписке (уточнения, мета-вопросы внутри работы скилла) — проза, 2–3 предложения, без markdown-секций.
    3. **Действие первое, отчёт после.** Edit/Write выполняются до отчётности; pre-action narration разрешена только для деструктивных/долгих операций.
    4. **Ноль внутреннего жаргона в user-facing полях.** В `## Описание` и `## Решено самостоятельно` SHALL NOT появляться: `hard issue`, `drift_score`, `residual_risk`, `SSOT`, `pointer-rewrite`, `Mandatory-блок N`. Использовать простой язык.

    **Write-then-replay:** После рендера отчёта запиши весь форматированный вывод (`## Описание`, `## Реализованные фичи`, `## Как проверить`, `## Решено самостоятельно` если есть, `## Прочее` если есть, `## Вопросы к пользователю`, строку `→ Подробный технический отчёт: ...`) в файл `.logs/<name>/apply-${TS}-output.md` через Write tool. Затем выведи содержимое:
    ```bash
    cat ".logs/<name>/apply-${TS}-output.md"
    ```
