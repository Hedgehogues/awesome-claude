# Spec: sdd-command-dispatch

## Purpose

Defines correct dispatch behavior for `sdd:*` slash commands: command files SHALL instruct
Claude to read `skill.md` directly, not invoke themselves via Skill tool.

## Requirements

### Requirement: sdd command files do not self-invoke

Each file in `commands/sdd/*.md` SHALL contain an instruction to read and follow
`skills/sdd/<skill>/skill.md`, not an instruction to invoke the same sdd skill.

#### Scenario: User invokes /sdd:propose
- **WHEN** user types `/sdd:propose <args>`
- **THEN** Claude Code reads `commands/sdd/propose.md`
- **THEN** the injected message instructs Claude to read `skills/sdd/propose/skill.md`
- **THEN** Claude follows skill.md steps — preflight, identity, openspec new change…
- **THEN** no "Invoke the skill" message reappears as a second user turn

#### Scenario: User invokes /sdd:contradiction
- **WHEN** user types `/sdd:contradiction`
- **THEN** Claude reads `skills/sdd/contradiction/skill.md` and runs detectors
- **THEN** no infinite loop occurs

### Requirement: CLAUDE_SKILL_DIR remains available

Bash scripts referenced in `skill.md` via `${CLAUDE_SKILL_DIR}` SHALL resolve correctly
after the dispatch change, because the harness sets this variable at slash-command
invocation time regardless of which tool Claude uses internally.

#### Scenario: identity.py resolves via CLAUDE_SKILL_DIR
- **WHEN** sdd:propose runs and calls `python3 "${CLAUDE_SKILL_DIR}/../scripts/identity.py"`
- **THEN** the script executes without "No such file or directory" error
