---
description: List all skills in the research: namespace with one-line descriptions.
allowed-tools: Bash, Read
---

# Research Skills

List all skills in the `research:` namespace.

## Steps

1. List directories in `skills/research/` (one per skill).
2. For each skill directory, read `skills/research/<name>/skill.md` and extract from YAML frontmatter:
   - `name` (e.g. `research:triz`)
   - first 1-2 lines of `description`
3. Output:

```
=== research: namespace ===

   /research:<name>  — <description first line>
   ...
```

## Fallback

- If `skills/research/` directory missing → `ERROR: skills/research/ not found`
- If a `skill.md` is unreadable → skip with `[skip: unreadable]` next to skill name
