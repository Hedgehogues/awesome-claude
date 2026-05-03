---
approach: |
  Invoke each fixed sdd:* slash command and verify it reaches skill.md logic
  without looping. Key signal: the skill's first real step executes (preflight
  or identity check) rather than the same "Invoke the skill" message appearing again.
acceptance_criteria:
  - /sdd:propose <name> creates change directory without looping
  - /sdd:explore <topic> enters explore mode without looping
  - /sdd:apply <change> reads apply skill.md without looping
  - /sdd:archive <change> reads archive skill.md without looping
  - CLAUDE_SKILL_DIR resolves correctly in bash scripts called from skill.md
---

## Scenarios

### Happy path: /sdd:propose runs to completion
Invoke `/sdd:propose test-change`. Verify: preflight executes, openspec new change
runs, .sdd.yaml is created. No repeated "Invoke the skill" message in transcript.

### Happy path: /sdd:explore enters explore mode
Invoke `/sdd:explore some topic`. Verify: preflight executes, opsx:explore skill
activates with its actual instructions visible in the response.

### Edge: CLAUDE_SKILL_DIR still resolves
Within a sdd:propose run, verify that `python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"`
executes without "No such file" errors.
