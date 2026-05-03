# Design: Fix sdd:* skill infinite loop

## Context

`sdd:*` skills use a two-level architecture:
- `commands/sdd/<skill>.md` — entry point read by Claude Code harness when user invokes `/sdd:<skill>`
- `skills/sdd/<skill>/skill.md` — actual skill logic

The intended flow:
1. Harness injects command file content as user turn
2. Claude calls `Skill(sdd:<skill>)`
3. Skill tool provides skill.md context
4. Claude follows skill.md steps

The actual flow:
1. Harness injects `commands/sdd/<skill>.md` content as user turn: `"Invoke the 'sdd:<skill>' skill..."`
2. Claude calls `Skill(sdd:<skill>)`
3. Skill tool injects `commands/sdd/<skill>.md` content again as a new user turn
4. Claude calls `Skill(sdd:<skill>)` again → loop

## Goals / Non-Goals

**Goals:**
- Break the infinite loop in all `sdd:*` skills
- Preserve the two-level architecture (command file is thin, logic stays in skill.md)
- Preserve `${CLAUDE_SKILL_DIR}` availability for bash scripts in skill.md

**Non-Goals:**
- Changing `skill.md` logic
- Changing `opsx:*` command files (they work correctly)
- Changing how `${CLAUDE_SKILL_DIR}` is set

## Decisions

**D1: Command files instruct Claude to read skill.md directly**

New format for all `commands/sdd/<skill>.md`:
```
Read and follow the instructions in `skills/sdd/<skill>/skill.md`. Arguments: $ARGUMENTS
```

When injected as a user turn, Claude uses the Read tool to read skill.md and follows
its steps. The Skill tool is not invoked for the sdd wrapper — only for downstream
skills (e.g. `opsx:explore`) as instructed by skill.md.

**D2: CLAUDE_SKILL_DIR is safe**

The harness sets `CLAUDE_SKILL_DIR` to the skill directory path at slash-command
invocation time. It does not depend on which tool Claude uses internally to process
the skill. Bash scripts in skill.md will continue to resolve paths correctly.

**D3: No skill.md changes**

The fix is confined to command files only. Skill logic, preflight checks, and
`opsx:*` delegations in skill.md remain unchanged.

## Risks / Trade-offs

**Risk**: The Skill tool description in system-reminder still says
`"Invoke the sdd:<skill> skill"` for sdd:* skills. Claude might still try to use
the Skill tool proactively. Mitigation: the command file content will be different,
and Claude will follow the Read-based flow when the command is actually invoked.

**Trade-off**: Claude reads skill.md via Read tool on every invocation (one extra
tool call). This is negligible in practice.
