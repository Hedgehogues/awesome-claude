---
name: sdd:archive
workflow_step: 8
description: >
  Архивировать завершённый change, синкнуть delta specs в openspec/specs/.
  Проверяет наличие test-plan.md. test-plan.md остаётся в архивной директории
  как историческая запись (не копируется в openspec/specs/<capability>/).
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

5. **test-plan.md остаётся в архивной директории**: после переезда change'а в
   `openspec/changes/archive/<date>-<name>/`, `test-plan.md` остаётся там как историческая запись.
   НЕ копируется в `openspec/specs/<capability>/`. Semantic test cases для capabilities
   генерируются скриптом `test-plan-to-cases.py` на этапе `sdd:apply`.
