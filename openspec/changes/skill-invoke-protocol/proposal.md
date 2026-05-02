## Why

Вызов `/ns:skill` в Claude Code проходит через цепочку: slash-command → `Skill` tool → `"Launching skill: <name>"`. На этом цепочка обрывается: модель видит результат инструмента и считает задачу выполненной, вместо того чтобы прочитать `skill.md` и выполнить инструкции.

Симптом воспроизводим: три последовательных вызова `/sdd:change-verify` вернули только строку `"Launching skill"` без исполнения скилла. Скилл заработал только после того, как `skill.md` был прочитан вручную.

Причина: нигде в проекте нет явного правила, что Skill tool — уведомление, а не исполнитель. Модель трактует `"Launching skill"` как сигнал завершения.

См. `.sdd.yaml` для capability-декларации.

## What Changes

- Добавить **`skill-invoke-protocol`** — явное правило исполнения скиллов:
  после того как Skill tool вернул `"Launching skill: <name>"`, модель обязана прочитать файл `.claude/skills/<ns>/<skill>/skill.md` и выполнить все инструкции из него с подстановкой `$ARGUMENTS`.
- Обновить **шаблон command.md файлов**: вместо одной строки `Invoke the \`ns:skill\` skill. Pass arguments: $ARGUMENTS` — явный 2-шаговый паттерн:
  1. вызов `Skill` tool (hook для харнесса);
  2. чтение + исполнение `skill.md`.
- Обновить все существующие `.claude/commands/<ns>/<skill>.md` файлы по новому шаблону.

## Capabilities

### New Capabilities

- `skill-invoke-protocol`: явное правило post-Skill execution — модель всегда читает и выполняет skill.md после Skill tool call

### Modified Capabilities

<!-- Нет изменений существующих спек -->

## Impact

**`.claude/CLAUDE.md`** или новый файл `.claude/rules/skill-invoke-protocol.md` — добавляется раздел «Skill Execution Protocol» с обязательным алгоритмом post-Skill.

**`.claude/commands/<ns>/<skill>.md`** — все command-файлы переписываются по новому шаблону (2 явных шага вместо 1 строки). Количество файлов: см. `.claude/commands/`.

**`skills/`** — зеркало изменений в `.claude/` (если применимо).
