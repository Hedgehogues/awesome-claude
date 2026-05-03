---
name: sdd:archive
workflow_step: 7
description: >
  Архивировать завершённый change со встроенной L1/L2/L3 spec-верификацией live spec'ов
  (включая REMOVED-инверсию). Проверяет test-plan.md, обновляет .sdd-state.yaml,
  при verify-fail после merge specs выводит red-banner и останавливается без авто-rollback.
  test-plan.md остаётся в архивной директории как историческая запись.
---

0. **Preflight — проверь наличие openspec** через Bash tool:
   ```bash
   which openspec > /dev/null 2>&1 || echo "NOTFOUND"
   ```
   Если вывод содержит `NOTFOUND` — остановись немедленно с сообщением:
   `openspec not found. Install: npm install -g @openspec/cli`

1. Определи имя change из $ARGUMENTS или контекста разговора. Сохрани `<change-dir>` = `openspec/changes/<name>`.

2. **Identity check.** Через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"
   ```
   Прочитай `owner:` из `.sdd.yaml`:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" read "<change-dir>"
   ```
   Если `owner != email` → AskUserQuestion: `⚠ change owner=<owner>, ты <email>. Перезаписать на тебя?`. При согласии:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/_sdd_yaml.py" set-owner "<change-dir>" "<email>"
   ```
   При отказе — остановись.

3. **Проверь `test-plan.md`**: если `<change-dir>/test-plan.md` отсутствует —
   остановись немедленно с сообщением:
   `test-plan.md is missing — required before archiving`

4. **Проверь что `test-plan.md` не является заглушкой**: если YAML front matter содержит
   только placeholder-текст (например `TODO:`) в полях `approach` или `acceptance_criteria` —
   предупреди: `test-plan.md appears unfilled` и запроси подтверждение от автора перед продолжением.

5. Архивируй change через Bash tool:
   ```bash
   openspec archive "<name>" -y
   ```
   После этого шага specs из `<change-dir>/specs/` smerged в `openspec/specs/<cap>/spec.md`.

7. **Inline L1/L2/L3 spec-verification против live spec.md.**
   <!-- KEEP IN SYNC: skills/sdd/apply/skill.md verify section -->

   Никакого внешнего кода — всё делаешь ты, модель, в одном прогоне.

   **Источник Requirements.** Прочитай `.sdd.yaml.creates` из `<change-dir>/.sdd.yaml`. Для каждого `<cap>` читай `openspec/specs/<cap>/spec.md` (только что merged).

   **Requirement parsing.** Из spec.md извлекай все `### Requirement:` блоки.

   Если spec содержит секции-операции (`## ADDED Requirements`, `## REMOVED Requirements`):
   - **ADDED** — стандартная верификация (L1/L2/L3).
   - **REMOVED** — **инвертированная L1**: артефакт MUST отсутствовать. L1 pass = файл НЕ существует; L1 fail = файл существует. L2/L3 → `N/A`.
   - **MODIFIED** → вердикт `human_needed` («MODIFIED delta blocks not supported in v1»).

   Без секций-операций — все Requirements в одной группе «All requirements».

   **Requirement → артефакт:**

   | Признак | Тип | Путь |
   |---|---|---|
   | Путь в backticks (`` `skills/sdd/foo/skill.md` ``) | skill / file | указан явно |
   | Упоминание скилла (`/sdd:foo`, `sdd:foo`) | skill + command | `skills/sdd/foo/skill.md` + `commands/sdd/foo.md` |
   | Секция документа (`CLAUDE.md → <section>`) | document | проверить секцию в файле |
   | Конфиг (`.claude/settings.json`) | config | указан явно |

   Если артефакт не идентифицирован → `human_needed` («could not identify artifact from Requirement text»).
   Runtime-поведение без файла → `human_needed` («requires live run»).

   **Task verification loop.** Для каждого Requirement: L1 → L2 → L3 → вердикт `done | partial | missing | human_needed`.

   Правила остановки:
   - L1 fail (или ADDED L1 fail) → `missing`, L2/L3 пропускаются.
   - L1 fail для REMOVED (файл существует) → `missing` («removal not performed»), L2/L3 = N/A.
   - L2 fail → `partial`, L3 запускается.
   - L3 fail → `partial`.
   - L1+L2+L3 pass → `done`.

   **L2 stub detection.** Файл = заглушка если содержит `<!-- TODO -->`/placeholder/пустые секции/только frontmatter.

   **L3 wiring heuristics:**

   | Тип | Где искать wiring |
   |---|---|
   | skill (`skills/<ns>/<skill>/skill.md`) | упоминание в `CLAUDE.md` + `README.md` |
   | command (`commands/<ns>/<name>.md`) | тело ссылается на скилл `<ns>:<name>` |
   | document | cross-ref из связанных файлов |
   | config | упоминание пути в документации |

   Если wiring неприменим — `L3 = N/A`.

   **Group aggregation:** для каждой `## ADDED/REMOVED` группы — `complete | incomplete | pending`.

   **Verdict:**
   - `passed` — все done;
   - `gaps_found` — есть missing/partial;
   - `human_needed` — нет gaps, есть human_needed.

8. **При verify failed (gaps_found): red-banner и стоп.**

   Если verdict ≠ `passed` (есть `missing` или `partial` Requirements в live spec):

   Выведи **точно** такой banner:
   ```
   🔴 SPECS MODIFIED — manual rollback required
   🔴 Run: git restore openspec/specs/
   🔴 OR: start a new change via /sdd:propose
   ```

   Запиши pending_transitions для hook'а:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" update "<change-dir>/.sdd-state.yaml" pending_transitions "archiving,archive-failed"
   ```

   **Остановись немедленно.** MUST NOT удалять `.sdd-state.yaml`. MUST NOT откатывать файлы автоматически. MUST NOT выполнять шаги 9–10.

9. **При verify passed: запиши pending_transitions**:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/state.py" update "<change-dir>/.sdd-state.yaml" pending_transitions "archiving,archived"
   ```
   PostToolUse hook применит переходы. Если последний переход = `archived`, hook также удалит `.sdd-state.yaml`.

10. **test-plan.md остаётся в архивной директории**: после переезда change'а в
    `openspec/changes/archive/<date>-<name>/`, `test-plan.md` остаётся там как историческая запись.
    НЕ копируется в `openspec/specs/<capability>/`. Semantic test cases для capabilities
    генерируются скриптом `test-plan-to-cases.py` на этапе `sdd:apply`.

11. **Запись лога и финальный отчёт**:

    Сначала запиши лог через Bash tool:
    ```bash
    TS=$(date +%Y%m%dT%H%M%S)
    mkdir -p ".logs/<name>"
    # Записать в .logs/<name>/archive-${TS}.md:
    # frontmatter (change, skill, timestamp, verify_verdict)
    # ## Archived Files — список файлов перемещённых openspec archive
    # ## Spec Verification — L1/L2/L3 результаты по каждому Requirement из live specs
    # ## State — финальная stage, факт удаления .sdd-state.yaml
    ```

    Затем вызови финальный отчёт через Bash tool:
    ```bash
    python3 "${CLAUDE_SKILL_DIR}/../scripts/archive_report.py" "<change-dir>"
    ```
    Скрипт возвращает JSON `{archived[]}`. Используй его для рендера отчёта в **строгом порядке блоков**:

    ```markdown
    ## Описание
    <2–5 предложений прозы: что заархивировано и где теперь находится>

    ## Архивированные артефакты
    <для каждого capability из JSON.archived:>
    - **<name>**: spec готов — да/нет, test-plan — да/нет
    <если JSON.archived пусто — тело `_нет_`, заголовок остаётся>

    ## Решено самостоятельно
    <опционально; формат: «вопрос → решение»; опускается если пусто>

    ## Прочее
    <опционально; риторические замечания; опускается если пусто>

    ## Вопросы к пользователю
    <обычно ровно одна строка: `Продолжаю.`>
    <синтетический CTA «Продолжаем по флоу?» ЗАПРЕЩЁН>
    <этот блок — последний; после него нет заголовков и прозы>
    <блок `## Как проверить` НЕ рендерится — он только в sdd:apply>
    → Подробный технический отчёт: .logs/<name>/archive-<TS>.md
    ```

    **Правила коммуникационного стиля:**
    1. **По умолчанию — действие, не вопрос.** Развилки закрывай автономно, фиксируй в `## Решено самостоятельно`. В `## Вопросы к пользователю` — только реальные user-only вопросы.
    2. **Форма ответа = форма запроса.** Пятиблочный формат — только в этом финальном выводе. В промежуточной переписке — проза, 2–3 предложения, без markdown-секций.
    3. **Действие первое, отчёт после.** Операции archiving выполняются первыми.
    4. **Ноль внутреннего жаргона в user-facing полях.** В `## Описание` и `## Решено самостоятельно` SHALL NOT появляться имена файлов, детекторный жаргон или технические идентификаторы. Весь технический дамп — только в лог-файле.

    **Write-then-replay:** После рендера отчёта запиши весь форматированный вывод (`## Описание`, `## Архивированные артефакты`, `## Решено самостоятельно` если есть, `## Прочее` если есть, `## Вопросы к пользователю`, строку `→ Подробный технический отчёт: ...`) в файл `.logs/<name>/archive-${TS}-output.md` через Write tool. Затем выведи содержимое:
    ```bash
    cat ".logs/<name>/archive-${TS}-output.md"
    ```
