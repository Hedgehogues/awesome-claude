## Purpose
Documentation restructuring: minimal README.md, CLAUDE_INSTALL.md for Claude, and detailed docs/ for reference.
## Requirements
### Requirement: README is user-first, not technical
README.md SHALL be readable in < 2 minutes. Content SHALL prioritize:
1. What this is (one sentence)
2. How to install (one command)
3. What's available (tables)
4. Where to learn more (link to detailed docs)

No architecture diagrams, philosophy mindmap, code examples, or technical rationale.

#### Scenario: First-time user reads README
- **WHEN** user opens awesome-claude GitHub page
- **THEN** README immediately answers: "What is this?" and "How do I use it?"
- **THEN** user can copy-paste install command
- **THEN** user knows what skills are available

### Requirement: CLAUDE_INSTALL.md is Claude-executable
CLAUDE_INSTALL.md SHALL be written as explicit instructions for Claude Code execution.

#### Scenario: User asks Claude to install
- **WHEN** user asks: "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"
- **THEN** Claude reads CLAUDE_INSTALL.md (from GitHub)
- **THEN** Claude extracts bash one-liner and executes it
- **THEN** installation completes, user sees success message

### Requirement: Documentation scope is clear
README.md SHALL NOT contain:
- Architecture patterns (link to docs/README_DETAILED.md instead)
- Philosophy sections
- Detailed skill descriptions (one-liner per skill in table)
- Historical context or rationale

All detailed content SHALL live in docs/README_DETAILED.md.

#### Scenario: User wants architecture deep-dive
- **WHEN** user reads README.md and wants to understand more
- **THEN** link "see docs/README_DETAILED.md" leads to full documentation
- **THEN** detailed README contains all original content: architecture, philosophy, extended examples, FAQ

---

