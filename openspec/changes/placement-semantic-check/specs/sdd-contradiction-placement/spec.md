## MODIFIED Requirements

### Requirement: placement detector runs patterns 1–7 in change-directory mode
`sdd:contradiction` placement detector (3.7) SHALL run seven patterns (not three) when operating in change-directory mode. Patterns 4–7 are appended after the existing three.

Pattern 4: HOW-content in `proposal.md` (см. capability `placement-how-in-proposal`)
Pattern 5: WHY-content in `design.md` (см. capability `placement-why-in-design`)
Pattern 6: `## Context` / `## Why` cross-file semantic duplicate via redundancy sub-detector (см. capability `context-why-redundancy`)
Pattern 7: self-compliance — change directory satisfies its own SHALL requirements (см. capability `self-compliance`)

All new patterns carry severity `warning`. None raise exit code.

#### Scenario: all seven patterns run in change-directory mode
- **WHEN** `sdd:contradiction` runs on a change directory containing `proposal.md` and `design.md`
- **THEN** patterns 1–7 are applied
- **THEN** any hits from patterns 4–7 appear in `--- Soft warnings ---` section

#### Scenario: new patterns skipped in non-change-directory mode
- **WHEN** `sdd:contradiction` runs on a single file or arbitrary directory (no `proposal.md`)
- **THEN** patterns 4–7 are skipped with note `[placement pattern 4–7: N/A — change-directory mode required]`
