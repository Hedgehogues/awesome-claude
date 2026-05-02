---
capability: skill-invoke-protocol
description: >
  Явное правило post-Skill execution: модель читает и выполняет skill.md
  после того как Skill tool вернул "Launching skill: <name>".
---

### Requirement: Post-Skill tool execution is mandatory

После вызова `Skill` tool и получения результата `"Launching skill: <name>"` модель ОБЯЗАНА:
1. Определить путь к файлу скилла: `.claude/skills/<ns>/<skill>/skill.md`
2. Прочитать файл через `Read` tool
3. Выполнить все инструкции из файла, подставив `$ARGUMENTS`

Ни при каких условиях модель не должна возвращать ответ пользователю сразу после `"Launching skill"` без исполнения skill.md.

**Testable contract:** при вызове `/sdd:change-verify structured-apply-output` в выводе модели присутствует отчёт верификации (не просто строка `"Launching skill"`).

---

### Requirement: Command files use explicit two-step template

Каждый файл `.claude/commands/<ns>/<skill>.md` ДОЛЖЕН содержать явные два шага:

```
1. Call the Skill tool: name `<ns>:<skill>`, arguments: $ARGUMENTS (hook for harness).
2. Read `.claude/skills/<ns>/<skill>/skill.md` and execute all instructions, substituting $ARGUMENTS.
```

Однострочный формат `Invoke the \`ns:skill\` skill. Pass arguments: $ARGUMENTS` является устаревшим и не допускается в новых command-файлах.

**Testable contract:** grep по `.claude/commands/**/*.md` не находит строки, начинающиеся с `Invoke the \`` (старый шаблон).

---

### Requirement: Rule file exists and is globally scoped

Файл `.claude/rules/skill-invoke-protocol.md` существует, не имеет `paths:` frontmatter (загружается всегда), содержит:
- алгоритм post-Skill execution (те же 3 шага)
- правило для command-файлов (2-шаговый шаблон)

**Testable contract:** файл существует, frontmatter не содержит поля `paths`.

---

### Requirement: sdd:propose generates command file by new template

Скилл `sdd:propose` при создании нового скилла генерирует `.claude/commands/<ns>/<skill>.md` по 2-шаговому шаблону, а не по старому однострочному.

**Testable contract:** после запуска `sdd:propose` для change'а с новым скиллом — созданный command.md содержит строку `Read \`.claude/skills/`.
