# Proposal: Fix sdd:* skill infinite loop via self-referential command files

## Problem

When a user invokes any `/sdd:*` slash command (e.g. `/sdd:propose`, `/sdd:explore`),
an infinite loop occurs:

1. Claude Code reads `commands/sdd/<skill>.md` and injects its content as a user turn.
2. The content says: `Invoke the 'sdd:<skill>' skill. Pass arguments: $ARGUMENTS`
3. Claude calls `Skill(sdd:<skill>)`.
4. The Skill tool injects the same command file content as another user turn.
5. Claude calls `Skill(sdd:<skill>)` again → loop.

The skill logic in `skill.md` is never reached.

## Root Cause

`commands/sdd/*.md` files use self-referential delegation:
they tell Claude to invoke the same skill whose command file is being read.

`opsx:*` command files do not have this problem — they contain actual instructions.

## Proposed Fix

Change all `commands/sdd/*.md` files so they instruct Claude to read `skill.md` directly
instead of invoking the skill tool recursively. See `design.md → D1` for the exact format
and rationale.

## Scope

All `sdd:*` command files with the self-referential pattern:
- `commands/sdd/propose.md`
- `commands/sdd/explore.md`
- `commands/sdd/apply.md`
- `commands/sdd/archive.md`
- `commands/sdd/contradiction.md`
- `commands/sdd/audit.md`
- `commands/sdd/sync.md`
- `commands/sdd/repo.md`
- `commands/sdd/bump-version.md`

No changes to `skill.md` files or any scripts.

## New Capabilities

_(none — this is a bug fix)_

See `.sdd.yaml` for capability declarations.
