## ADDED Requirements

### Requirement: sdd:propose validates design.md structure
`sdd:propose` SHALL check that `design.md` contains all required openspec sections after creation and report any missing sections before proceeding.

Required sections: `## Technical Approach`, `## Architecture Decisions`, `## Data Flow`, `## File Changes`.

#### Scenario: design.md passes format check
- **WHEN** `sdd:propose` checks `design.md` and all required sections are present
- **THEN** propose proceeds to the next artifact without interruption

#### Scenario: design.md fails format check
- **WHEN** `sdd:propose` checks `design.md` and a required section is missing
- **THEN** propose reports: "design.md is missing section: <section name>"
- **THEN** author is prompted to fix before proceeding
- **THEN** after fix, format check runs again

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
`docs/SKILL_DESIGN.md` SHALL document the required structure of `design.md` and the `.sdd.yaml` reference requirement in `proposal.md`.

#### Scenario: Developer reads SKILL_DESIGN.md
- **WHEN** developer reads the design.md structure section
- **THEN** required sections are listed: `## Technical Approach`, `## Architecture Decisions`, `## Data Flow`, `## File Changes`
- **THEN** `.sdd.yaml` format and fields are documented
