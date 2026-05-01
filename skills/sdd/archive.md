---
name: sdd:archive
workflow_step: 8
description: >
  Архивировать завершённый change, синкнуть delta specs в openspec/specs/.
  Проверяет наличие test-plan.md. Копирует test-plan.md в specs/.
  OpenSpec CLI устанавливается автоматически по версии из .openspec-version.
---

1. Определи имя change из $ARGUMENTS или контекста разговора.

2. **Проверь `test-plan.md`**: если `openspec/changes/<name>/test-plan.md` отсутствует —
   остановись немедленно с сообщением:
   `test-plan.md is missing — required before archiving`

3. **Проверь что `test-plan.md` не является заглушкой**: если YAML front matter содержит
   только placeholder-текст (например `TODO:`) в полях `approach` или `acceptance_criteria` —
   предупреди: `test-plan.md appears unfilled` и запроси подтверждение от автора перед продолжением.

4. Вызови скилл `openspec-archive-change` через Skill tool. Передай аргументы: $ARGUMENTS

5. **После архивирования**: прочитай `openspec/changes/<name>/.sdd.yaml`.
   Для каждой capability в поле `creates`:
   - Скопируй `openspec/changes/<name>/test-plan.md` → `openspec/specs/<capability>/test-plan.md`
   Если `.sdd.yaml` отсутствует или `creates` пуст — пропусти этот шаг.
