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
