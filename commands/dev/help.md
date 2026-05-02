---
description: List all skills in the dev: namespace with one-line descriptions.
allowed-tools: Bash, Read
---

# Dev Skills

List all skills in the `dev:` namespace.

## Steps

1. List directories in `skills/dev/` (one per skill).
2. For each skill directory, read `skills/dev/<name>/skill.md` and extract from YAML frontmatter:
   - `name` (e.g. `dev:tdd`)
   - first 1-2 lines of `description`
3. Output:

```
=== dev: namespace ===

   /dev:<name>  — <description first line>
   ...
```

## Fallback

- If `skills/dev/` directory missing → `ERROR: skills/dev/ not found`
- If a `skill.md` is unreadable → skip with `[skip: unreadable]` next to skill name
