---
name: sdd:apply
workflow_step: 6
description: >
  Реализовать задачи из tasks.md текущего change'а.
  Читает test-plan.md как контекст для написания тестов.
  Обновляет openspec/specs/index.yaml для новых capabilities.
  OpenSpec CLI устанавливается автоматически по версии из .openspec-version.
---

1. Определи имя change из $ARGUMENTS или контекста разговора.

2. **Прочитай `test-plan.md`** если существует в `openspec/changes/<name>/test-plan.md`.
   Используй `acceptance_criteria` и `## Scenarios` как контекст при написании тестов.

3. Вызови скилл `openspec-apply-change` через Skill tool. Передай аргументы: $ARGUMENTS

4. **После завершения реализации**: прочитай `openspec/changes/<name>/.sdd.yaml`.
   Для каждой capability в поле `creates` — добавь или обнови запись в `openspec/specs/index.yaml`:
   ```yaml
   specs:
     - capability: <name>
       description: <краткое описание из proposal.md → Capabilities>
       path: <capability>/spec.md
       test_plan: <capability>/test-plan.md
   ```
   Если `openspec/specs/index.yaml` не существует — создай его с корневым ключом `specs:`.
   Если `.sdd.yaml` отсутствует или `creates` пуст — пропусти этот шаг.

5. **Сгенерируй semantic test cases из test-plan.md**: вызови через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/test-plan-to-cases.py" "openspec/changes/<name>"
   ```
   Скрипт читает `test-plan.md` (front matter `acceptance_criteria`) и `.sdd.yaml` (`creates`),
   генерирует `skills/skill/cases/<ns>/<cap>/<ac_id>.md` для каждого критерия.
   Если `test-plan.md` или `.sdd.yaml` отсутствуют — скрипт ничего не делает.

6. **Финальный отчёт**: вызови через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/../scripts/apply_report.py" "openspec/changes/<name>"
   ```
   Скрипт возвращает JSON `{capabilities[], file_facts[], verify[]}`.
   Используй его как источник данных для рендера отчёта в **строгом порядке блоков**:

   ```markdown
   ## Технические статусы
   <буллеты: пути файлов, результаты тестов, exit codes, обновления index.yaml — только факты, без прозы>

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
