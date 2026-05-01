## ADDED Requirements

### Requirement: placement detector flags HOW content in proposal.md
`sdd:contradiction` placement detector (3.7) SHALL flag HOW-content found in `proposal.md` outside the `## Impact` section. HOW-content markers: section headers `## Implementation`, `## Technical Details`, `## Architecture`, `## How`; delegation chain patterns (`→ SKILL.md`, `delegates to`, `calls skill`); technical parameters (method names, config paths, protocol names) in paragraph context.

#### Scenario: delegation chain in proposal body
- **WHEN** `proposal.md` contains a paragraph with delegation patterns (e.g. `skill → SKILL.md`) outside `## Impact`
- **THEN** detector emits `[warning] placement: HOW-content (delegation chain) found in proposal.md outside ## Impact`

#### Scenario: implementation section header in proposal
- **WHEN** `proposal.md` contains a section header `## Implementation` or `## Technical Details`
- **THEN** detector emits `[warning] placement: HOW-section header '## <name>' found in proposal.md`

#### Scenario: technical detail inside ## Impact is allowed
- **WHEN** `proposal.md ## Impact` lists affected files and skills with technical names
- **THEN** detector does NOT flag — ## Impact is the permitted HOW-boundary in proposal
