---
name: sdd:propose
workflow_step: 4
description: >
  Предложить новый change: сгенерировать proposal, design, specs, tasks за один шаг.
  Создаёт .sdd.yaml и test-plan.md стабы. Проверяет структуру design.md и proposal.md.
  OpenSpec CLI устанавливается автоматически по версии из .openspec-version.
---

1. Вызови скилл `openspec-propose` через Skill tool. Передай аргументы: $ARGUMENTS

2. Получи имя change и путь к директории (из вывода openspec-propose или из $ARGUMENTS).
   Директория: `openspec/changes/<name>/`

3. **Создай `.sdd.yaml`** в директории change. Поле `creates:` автозаполни именами capabilities из секции `### New Capabilities` proposal.md (формат: `- capability-name: …` или `- \`capability-name\`: …`). Если секции нет или она пуста — оставь `creates: []`.

   Пример заполненного:
   ```yaml
   creates:
     - my-capability
     - other-capability
   merges-into: []
   ```

   Пример пустого (нет New Capabilities):
   ```yaml
   creates: []
   merges-into: []
   ```

4. **Создай `test-plan.md` stub** в директории change:
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

5. **Проверь структуру `design.md`** — вызови `check-design.py` через Bash tool:
   ```bash
   python3 "${CLAUDE_SKILL_DIR}/scripts/check-design.py" "openspec/changes/<name>"
   ```
   Скрипт проверяет наличие 4 обязательных openspec-секций (наследуется от `openspec instructions design --json`):
   `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`.
   Если скрипт возвращает non-zero exit и сообщает о missing section → запроси исправление от автора и повтори проверку.

6. **Проверь что `proposal.md` ссылается на `.sdd.yaml`**.
   Если ссылки нет → выведи: `proposal.md does not reference .sdd.yaml`
   и запроси добавление ссылки (например: "See `.sdd.yaml` for capability declarations").
