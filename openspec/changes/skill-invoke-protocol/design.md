## Context

Скиллы в awesome-claude реализованы через трёхзвенную цепочку:

1. Пользователь вводит `/ns:skill args`
2. Claude Code читает `.claude/commands/ns/skill.md`, там написано `Invoke the \`ns:skill\` skill. Pass arguments: $ARGUMENTS`
3. Модель вызывает `Skill("ns:skill", args="...")`
4. Харнесс возвращает `"Launching skill: ns:skill"`
5. (предполагается) Модель читает `.claude/skills/ns/skill/skill.md` и выполняет инструкции

Шаг 5 нигде явно не предписан. Модель должна «догадаться», что `"Launching skill"` — это уведомление, а не результат. В нескольких наблюдаемых случаях модель не выполняла этот шаг и просто возвращала ответ пользователю.

## Goals / Non-Goals

**Goals:**
- Сделать исполнение скиллов надёжным без изменения харнесса и Skill tool
- Зафиксировать правило в файлах проекта, а не полагаться на интуицию модели
- Обновить все command-файлы по единому шаблону

**Non-Goals:**
- Изменение механизма Skill tool или харнесса (вне scope)
- Inline-embedding полного содержимого skill.md в command-файлы (избыточно, ломает DRY)
- Исправление проблем с конкретными скиллами (это symptom, не cause)

## Decisions

**D1: Где хранить правило?**

Варианты:
- В `CLAUDE.md` — всегда загружается, но растёт размер
- В отдельном `.claude/rules/skill-invoke-protocol.md` без `paths:` frontmatter — загружается всегда, изолирован

Решение: отдельный rules-файл без `paths:` scope. Правило применимо глобально, изоляция помогает найти его при отладке.

**D2: Насколько явным делать command.md?**

Варианты:
- Только правило в rules/ (command.md не трогать)
- Правило в rules/ + явный 2-шаговый command.md

Решение: оба. Rules-файл — страховка на случай отсутствия command.md в контексте. Явный command.md — первичный механизм (всегда в контексте при вызове скилла).

**D3: Шаблон command.md**

```markdown
1. Call the Skill tool: name `ns:skill`, arguments: $ARGUMENTS (hook for harness).
2. Read `.claude/skills/ns/skill/skill.md` and execute all instructions, substituting $ARGUMENTS.
```

Короткий, явный, не дублирует содержимое skill.md.

## Risks / Trade-offs

- **Drift**: если новый скилл создаётся без обновления command.md по шаблону — правило нарушается. Митигация: добавить в `sdd:propose` шаг генерации command.md по новому шаблону.
- **Path changes**: если скилл переезжает в другую директорию — путь в command.md устаревает. Митигация: путь выводится из имени скилла по соглашению `skills/<ns>/<skill>/skill.md`.
- **Context compression**: правило из rules/ может быть вытеснено при сжатии. Митигация: явный command.md как основной источник.
