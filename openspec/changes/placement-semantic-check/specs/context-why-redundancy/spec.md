## ADDED Requirements

### Requirement: redundancy detector catches Context/Why cross-file semantic duplicate
`sdd:contradiction` redundancy detector (3.5) SHALL flag `design.md ## Context` and `proposal.md ## Why` as a semantic duplicate when they share ≥3 normalised subject terms. SSOT is `proposal.md`. Pointer-rewrite: replace `## Context` body with a single-line reference to `proposal.md → ## Why`.

#### Scenario: Context body duplicates Why content
- **WHEN** `design.md ## Context` and `proposal.md ## Why` share ≥3 normalised subject terms
- **THEN** detector emits `[warning] redundancy: '## Context' in design.md semantically duplicates '## Why' in proposal.md (suggested SSOT: proposal.md, heuristic)`
- **THEN** pointer-rewrite suggestion: `design.md ## Context → "см. proposal.md → ## Why"`

#### Scenario: Context is a single-line bridge — no flag
- **WHEN** `design.md ## Context` body is ≤2 sentences or already contains a pointer to proposal.md
- **THEN** detector does NOT flag
