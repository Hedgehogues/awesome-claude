## ADDED Requirements

### Requirement: contradiction.py resides in skills/sdd/scripts/
`contradiction.py` SHALL reside at `skills/sdd/scripts/contradiction.py`. The file SHALL NOT exist at `skills/sdd/contradiction.py`. `skills/sdd/contradiction.md` SHALL reference the script via `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`.

#### Scenario: script at correct location
- **WHEN** developer looks for `contradiction.py`
- **THEN** it is found at `skills/sdd/scripts/contradiction.py`
- **THEN** it is NOT present at `skills/sdd/contradiction.py`

#### Scenario: skill references correct path
- **WHEN** `skills/sdd/contradiction.md` is read
- **THEN** the path `${CLAUDE_SKILL_DIR}/scripts/contradiction.py` is used
- **THEN** no hardcoded absolute path appears
