# sdd-openspec-cli-guard

## ADDED Requirements

### Requirement: preflight guard before first step

Each `sdd:*` skill (propose, explore, apply, archive) SHALL check for the `openspec` binary before executing any workflow step.

If `openspec` is not found, the skill SHALL stop immediately and output:
`openspec not found. Install: npm install -g @openspec/cli`

#### Scenario: openspec not installed
- **WHEN** user invokes any `sdd:*` skill
- **AND** `which openspec` returns non-zero
- **THEN** skill outputs the install instruction and exits
- **THEN** no workflow steps are executed

#### Scenario: openspec installed
- **WHEN** user invokes any `sdd:*` skill
- **AND** `which openspec` returns zero
- **THEN** skill proceeds to its first workflow step without any guard message

### Requirement: no delegation to unregistered skills

`sdd:*` skills SHALL NOT call `openspec-propose`, `openspec-explore`, `openspec-apply-change`, or `openspec-archive-change` via Skill tool.

Where a direct CLI command exists (`openspec new change`, `openspec archive`), the skill SHALL use it via Bash. Where no CLI command exists (explore, apply), the skill SHALL delegate to the registered `opsx:*` skill.

#### Scenario: sdd:propose creates change directory
- **WHEN** user invokes `sdd:propose <name>`
- **THEN** skill calls `openspec new change "<name>"` via Bash
- **THEN** no `Skill('openspec-propose')` call is made

#### Scenario: sdd:archive archives change
- **WHEN** user invokes `sdd:archive <name>`
- **THEN** skill calls `openspec archive "<name>" -y` via Bash
- **THEN** no `Skill('openspec-archive-change')` call is made
