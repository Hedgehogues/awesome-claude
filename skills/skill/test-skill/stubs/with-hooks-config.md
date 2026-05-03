---
name: with-hooks-config
description: >
  Project with .claude/settings.json containing a PostToolUse hook on Skill matcher
  that invokes skills/sdd/scripts/state_hook.py.
---

## Files

### `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "python3 ${CLAUDE_PROJECT_DIR}/skills/sdd/scripts/state_hook.py"
          }
        ]
      }
    ]
  }
}
```

### `openspec/changes/test-hook/.sdd-state.yaml`

```yaml
stage: contradiction-ok
last_step_at: '2026-05-01T00:00:00Z'
owner: test@example.com
```

### `openspec/changes/test-hook/.sdd.yaml`

```yaml
creates: []
merges-into: []
owner: test@example.com
```
