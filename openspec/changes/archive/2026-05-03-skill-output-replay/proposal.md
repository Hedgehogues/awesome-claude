## Why

Когда SDD-скиллы (`sdd:apply`, `sdd:contradiction`, `sdd:archive`) запускаются внутри Agent tool, суб-агент возвращает только краткое summary — форматированные блоки `## Описание`, `## Что делать` и т.д. теряются. Пользователь видит неполный вывод или вовсе его не видит. Лог-файл в `.log/` остаётся на диске, но пользовательский отчёт недоступен.

## What Changes

- Добавить в `sdd:apply`, `sdd:contradiction`, `sdd:archive` финальную фазу **write-then-replay**: форматированный пользовательский вывод (все блоки `## …`) записывается в `.log/<skill>-<ts>-output.md`, затем скилл выводит полный текст этого файла как последний шаг.
- Добавить правило в `claude-way.md`: скиллы с форматированным финальным выводом SHALL использовать write-then-replay паттерн.
- `.sdd.yaml` в `skill-output-replay` ссылается на создаваемые capability.

## Capabilities

### New Capabilities
- `write-then-replay-output`: финальная фаза скилла — запись форматированного вывода в файл и его воспроизведение через `cat`; гарантирует сохранность вывода при запуске через Agent tool
- `claude-way-agent-guard`: правило в `claude-way.md`, требующее write-then-replay для скиллов с форматированным финальным выводом

### Modified Capabilities
- `skill-run-log-archiving`: добавляется `-output.md` suffix для файла пользовательского вывода (отдельно от технического лога)

## Impact

- `.claude/skills/sdd/apply/skill.md` — финальный шаг расширяется write-then-replay
- `.claude/skills/sdd/contradiction/skill.md` — финальный шаг расширяется write-then-replay
- `.claude/skills/sdd/archive/skill.md` — финальный шаг расширяется write-then-replay
- `.claude/rules/claude-way.md` — добавляется секция про write-then-replay
- Зеркала `skills/sdd/*/skill.md` синхронизируются
- `.sdd.yaml` этого change

See `.sdd.yaml` for capability declarations.
