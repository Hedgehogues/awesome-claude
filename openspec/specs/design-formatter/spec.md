## Purpose
Validation and documentation of design.md structure to ensure consistent artifact quality.
## Requirements
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

### Requirement: sdd:propose validates proposal.md references .sdd.yaml
`sdd:propose` SHALL check that `proposal.md` contains a reference to `.sdd.yaml` and report if it is absent.

#### Scenario: proposal.md has .sdd.yaml reference
- **WHEN** `sdd:propose` checks `proposal.md` and a reference to `.sdd.yaml` is present
- **THEN** propose proceeds without interruption

#### Scenario: proposal.md is missing .sdd.yaml reference
- **WHEN** `sdd:propose` checks `proposal.md` and no reference to `.sdd.yaml` is found
- **THEN** propose reports: "proposal.md does not reference .sdd.yaml"
- **THEN** author is prompted to add the reference before proceeding

### Requirement: Format rules are documented in SKILL_DESIGN.md
`docs/SKILL_DESIGN.md` SHALL document the required openspec structure of `design.md` (inherited from openspec CLI template), not the prior custom list.

#### Scenario: Developer reads SKILL_DESIGN.md
- **WHEN** developer reads the design.md structure section
- **THEN** required sections are listed: `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`
- **THEN** the source of truth is referenced: `openspec instructions design --json`

### Requirement: check-design.py validates design.md against openspec template
`check-design.py` (at `${CLAUDE_SKILL_DIR}/scripts/check-design.py`) SHALL parse `design.md` and verify presence of the four required openspec sections. On missing section, the script SHALL exit non-zero with a message naming the missing section.

#### Scenario: check-design.py runs in sdd:propose
- **WHEN** `sdd:propose` finishes generating `design.md`
- **THEN** `check-design.py` is invoked with the path to `design.md`
- **THEN** if any required section is absent, propose blocks and reports the missing section

