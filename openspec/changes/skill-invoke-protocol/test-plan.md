---
approach: |
  Запустить `/sdd:change-verify` и проверить что отчёт верификации появился в выводе
  (не просто "Launching skill"). Для структурных проверок — grep по command-файлам
  и проверка наличия rules-файла.
acceptance_criteria:
  - post-Skill execution produces skill output, not just "Launching skill" string
  - all command files use two-step template (no legacy "Invoke the `" lines)
  - rule file exists at .claude/rules/skill-invoke-protocol.md without paths: frontmatter
  - sdd:propose generates command files by new template
---

## Scenarios

- User calls `/sdd:change-verify PATH` → output contains verification report, not silence
- User calls any `/ns:skill` → model reads skill.md and executes (not returns after "Launching skill")
- grep `.claude/commands/**/*.md` → no lines matching `^Invoke the \``
- cat `.claude/rules/skill-invoke-protocol.md` → exists, no `paths:` in frontmatter
- sdd:propose creates new skill → command.md contains `Read \`.claude/skills/`
