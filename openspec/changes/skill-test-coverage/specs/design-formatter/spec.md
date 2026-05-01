## MODIFIED Requirements

### Requirement: sdd:propose validates design.md structure
`sdd:propose` SHALL check that `design.md` contains all required openspec sections after creation and report any missing sections before proceeding. Required sections are inherited from openspec CLI (`openspec instructions design --json` → `template`):

**Required:** `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`.
**Optional:** `## Migration Plan`, `## Open Questions`.

The previous list (`Technical Approach`, `Architecture Decisions`, `Data Flow`, `File Changes`) declared in sdd-layer-artifacts D5 is replaced — those names do not match the openspec template.

#### Scenario: design.md passes format check
- **WHEN** `sdd:propose` checks `design.md` and all required openspec sections are present
- **THEN** propose proceeds to the next artifact without interruption

#### Scenario: design.md fails format check
- **WHEN** `sdd:propose` checks `design.md` and a required openspec section is missing
- **THEN** propose reports: "design.md is missing section: <section name>"
- **THEN** author is prompted to fix before proceeding

### Requirement: Format rules are documented in SKILL_DESIGN.md
**REPLACED.** `docs/SKILL_DESIGN.md` SHALL document the required openspec structure of `design.md` (inherited from openspec CLI template), not the prior custom list.

#### Scenario: Developer reads SKILL_DESIGN.md
- **WHEN** developer reads the design.md structure section
- **THEN** required sections are listed: `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`
- **THEN** the source of truth is referenced: `openspec instructions design --json`

## ADDED Requirements

### Requirement: check-design.py validates design.md against openspec template
`check-design.py` (at `${CLAUDE_SKILL_DIR}/scripts/check-design.py`) SHALL parse `design.md` and verify presence of the four required openspec sections. On missing section, the script SHALL exit non-zero with a message naming the missing section.

#### Scenario: check-design.py runs in sdd:propose
- **WHEN** `sdd:propose` finishes generating `design.md`
- **THEN** `check-design.py` is invoked with the path to `design.md`
- **THEN** if any required section is absent, propose blocks and reports the missing section
