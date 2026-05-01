## ADDED Requirements

### Requirement: placement detector flags WHY content in design.md
`sdd:contradiction` placement detector (3.7) SHALL flag WHY-content found in `design.md` outside the `## Context` section. WHY-content markers: section header `## Goals` or `## Objectives` with motivational body (not referencing proposal); paragraphs containing motivation markers (`потому что`, `проблема`, `пользователи хотят`, `problem is`, `users need`) outside `## Context`.

#### Scenario: Goals section in design without proposal reference
- **WHEN** `design.md` contains `## Goals` section whose body does not reference `proposal.md`
- **THEN** detector emits `[warning] placement: WHY-content ('## Goals') found in design.md — motivation belongs in proposal.md`

#### Scenario: Goals section in design that references proposal is allowed
- **WHEN** `design.md ## Goals` body contains pointer "см. proposal.md" or equivalent
- **THEN** detector does NOT flag — reference makes it a navigation aid, not duplicate WHY

#### Scenario: Context section as single-line bridge is allowed
- **WHEN** `design.md ## Context` contains one short sentence or a pointer to proposal.md
- **THEN** detector does NOT flag
