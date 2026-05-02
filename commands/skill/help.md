---
description: List all skills in the skill: namespace (contributor toolchain) with one-line descriptions.
allowed-tools: Bash, Read
---

# Skill Skills (contributor toolchain)

List all skills in the `skill:` namespace — these are skills used by contributors developing awesome-claude itself.

## Steps

1. List directories in `skills/skill/` (one per skill; ignore `cases/` if present at root level — that's not a skill).
2. For each skill directory, read `skills/skill/<name>/skill.md` and extract from YAML frontmatter:
   - `name` (e.g. `skill:setup`)
   - first 1-2 lines of `description`
3. Output:

```
=== skill: namespace (contributor toolchain) ===

   /skill:<name>  — <description first line>
   ...
```

## Fallback

- If `skills/skill/` directory missing → `ERROR: skills/skill/ not found`
- If a `skill.md` is unreadable → skip with `[skip: unreadable]` next to skill name
