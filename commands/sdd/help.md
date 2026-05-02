---
description: List all skills in the sdd: namespace with one-line descriptions.
allowed-tools: Bash, Read
---

# SDD Skills

List all skills in the `sdd:` namespace.

## Steps

1. List directories in `skills/sdd/` (one per skill, plus `scripts/` which is not a skill).
2. For each skill directory, read `skills/sdd/<name>/skill.md` and extract from YAML frontmatter:
   - `name` (e.g. `sdd:propose`)
   - first 1-2 lines of `description`
   - `workflow_step` if present
3. Output:

```
=== sdd: namespace ===

Workflow skills (in order):
 N. /sdd:<name>  — <description first line>

Other skills:
   /sdd:<name>  — <description>
```

Skills with `workflow_step` go to the workflow section sorted by step number; skills without — to "Other skills".

## Fallback

- If `skills/sdd/` directory missing → `ERROR: skills/sdd/ not found`
- If a `skill.md` is unreadable → skip with `[skip: unreadable]` next to skill name
