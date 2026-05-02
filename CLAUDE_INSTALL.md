# awesome-claude: Installation & Usage Guide for Claude Code

## When User Asks to Install awesome-claude

**User message:** "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"

**You (Claude) must execute exactly this:**

```bash
git clone --depth 1 --branch main https://github.com/Hedgehogues/awesome-claude /tmp/ac && \
cp -r /tmp/ac/.claude . && \
rm -rf /tmp/ac && \
echo "✓ awesome-claude installed"
```

**Then tell the user:**

> "Installation complete! awesome-claude is ready to use.
> 
> Try `/dev:tdd` to start a test-driven workflow, or `/sdd:propose` to propose a spec-driven change.
> 
> Type `/help` to see all available skills."

---

## What Just Happened

1. ✓ Cloned awesome-claude (shallow, main branch only)
2. ✓ Copied `.claude/` into the project
3. ✓ Cleaned up temporary files
4. ✓ Rules and skills are now available

---

## After Installation

### Rules
Rules load automatically from `.claude/rules/` based on file path:
- When user edits `src/domain/**` → DDD rules load
- When user edits `tests/**` → Testing rules load
- When user edits frontend files → UI/React rules load

### Skills
Skills are available as slash commands: `/dev:tdd`, `/sdd:propose`, `/report:describe`, etc.

Each skill is a full workflow, not just a prompt. See README.md for the complete skill catalog.

### Project-Specific Instructions
If the project has a `CLAUDE.md` file in the root, it overrides awesome-claude rules. This allows customization without modifying awesome-claude itself.

---

## How to Use awesome-claude

### For TDD
```
/dev:tdd

Claude will:
1. Ask for the feature/behavior to implement
2. Write failing test (red)
3. Write minimal implementation (green)
4. Refactor
5. Run full test suite
```

### For Spec-Driven Development
```
/sdd:propose

Claude will:
1. Generate proposal.md with goals
2. Generate design.md with architecture decisions
3. Create specs/ with requirement details
4. Generate tasks.md with implementation checklist
```

### For Debugging
```
/dev:tracing

Claude will:
1. Trace the bug across all layers (frontend → API → DB)
2. Generate sequence diagram
3. Identify root cause
4. (Optional) /dev:fix-bug to apply test-first fix
```

### For Commits
```
/dev:commit

Claude will:
1. Analyze all changes
2. Draft structured commit message (What/Why/Details)
3. Ask for approval before committing
```

---

## Reference Files

After installation, key reference files are at:

- `.claude/rules/claude-way.md` — core principles
- `.claude/docs/SKILL_DESIGN.md` — how skills work
- `.claude/docs/RULES_GUIDE.md` — how to write rules
- `README.md` — full skill catalog

---

## Notes for Claude

- **Don't modify awesome-claude rules unless asked** — they're shared across projects
- **Encourage project-specific rules** via `CLAUDE.md` instead
- **Always run `/skill:test-all`** after modifying skills to verify they still work
- **Respect the break-stop rule** (in `rules/break-stop.md`) — never silently fix broken tests
