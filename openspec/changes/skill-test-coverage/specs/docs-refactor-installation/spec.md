## ADDED Artifacts

### Artifact: README.md (rewritten)
File: `README.md`

Content SHALL be super-minimal (70 lines maximum):
- One-line description: "Your engineering style in Claude Code"
- Quick install instruction: "Ask Claude Code to install..."
- Skills table (3 tables, organized by namespace: dev, sdd, report, research)
- Rules section (reference to detailed docs)
- Customization section (2 bullet points)
- FAQ section (3 Q&As)

Requirement: Immediately understandable for first-time user. No architecture details, no philosophy mindmap.

### Artifact: CLAUDE_INSTALL.md (new)
File: `CLAUDE_INSTALL.md`

Content SHALL contain:
1. Clear instruction: "When user asks to install awesome-claude, execute this bash command:"
2. Exact one-liner (no variations):
   ```bash
   git clone --depth 1 --branch main https://github.com/Hedgehogues/awesome-claude /tmp/ac && \
   cp -r /tmp/ac/.claude . && \
   rm -rf /tmp/ac && \
   echo "✓ awesome-claude installed"
   ```
3. What to tell user after success
4. Section "After Installation": rules, skills, projects, references
5. Section "Reference Files": paths to key files
6. Notes for Claude (don't modify rules, encourage project-specific CLAUDE.md, run tests)

Requirement: Machine-readable for Claude. Explicit actions, no ambiguity.

### Artifact: docs/README_DETAILED.md (archived)
File: `docs/README_DETAILED.md`

Content: Old README.md (465 lines), migrated as-is for reference and historical documentation.

Requirement: Archive old README, link from README.md and CLAUDE_INSTALL.md.

## MODIFIED Artifacts

### Artifact: .claude/CLAUDE.md (if exists, or create)
Content SHALL include:
1. What is awesome-claude (rules, skills, agents)
2. How to use after installation
3. How to create/modify rules
4. How to create/modify skills
5. References to docs/

Requirement: Loaded in .claude/ after user installs awesome-claude. Provides context for Claude in project.

---

## ADDED Requirements

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

## Verification

- [ ] README.md is < 100 lines and readable in < 2 minutes
- [ ] CLAUDE_INSTALL.md contains exact bash command with no variations
- [ ] docs/README_DETAILED.md is identical to old README (just relocated)
- [ ] CLAUDE_INSTALL.md can be read by Claude from GitHub (no auth required)
- [ ] After running install command, .claude/ exists and skills are available
