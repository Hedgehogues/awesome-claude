## REORGANIZED Artifacts

### Artifact: skills/ directory structure

**Current (flat):**
```
skills/dev/
├── tdd.md
├── fix-bug.md
├── commit.md
└── scripts/
    └── some-script.py

skills/sdd/
├── propose.md
├── apply.md
└── scripts/
    ├── contradiction.py
    ├── check-design.py
    └── test-plan-to-cases.py
```

**New (hierarchical):**
```
skills/dev/
├── tdd/
│   ├── skill.md
│   └── cases/ (optional)
├── fix-bug/
│   ├── skill.md
│   └── cases/ (optional)
├── commit/
│   └── skill.md
└── ...

skills/sdd/
├── propose/
│   ├── skill.md
│   └── cases/
├── apply/
│   ├── skill.md
│   ├── scripts/
│   │   └── test-plan-to-cases.py
│   └── cases/
├── contradiction/
│   ├── skill.md
│   ├── scripts/
│   │   └── contradiction.py
│   └── cases/
└── ...
```

**All namespaces affected:**
- `skills/dev/` — 9 skills
- `skills/sdd/` — 11 skills  
- `skills/report/` — 2 skills
- `skills/research/` — 1 skill
- `skills/skill/` — 2 skills (test infrastructure)

**Mirror in .claude/skills/:**
Identical structure copied to `.claude/skills/` for offline use.

---

## ADDED Requirements

### Requirement: Each skill is self-contained in its folder
Every skill SHALL be located in `skills/<namespace>/<skill>/skill.md` with:
- `skill.md` — the skill itself
- `scripts/` — if skill has helper scripts (optional)
- `cases/` — if skill has test cases (optional)

#### Scenario: Finding a skill's resources
- **WHEN** developer needs to locate skill `dev:tdd`
- **THEN** all artifacts live in `skills/dev/tdd/`
- **THEN** related scripts are in `skills/dev/tdd/scripts/`
- **THEN** test cases are in `skills/dev/tdd/cases/`

### Requirement: Scripts are colocated with skills
Script files SHALL live in the same folder hierarchy as the skill that uses them, not in a top-level `scripts/` directory.

#### Scenario: Adding a script to a skill
- **WHEN** skill `sdd:apply` needs a new helper script
- **THEN** script goes in `skills/sdd/apply/scripts/` 
- **THEN** not in `skills/sdd/scripts/` or `skills/scripts/`

### Requirement: Folder structure is consistent across all namespaces
All 4 namespaces (dev, sdd, report, research) SHALL use the same hierarchy: `skills/<ns>/<skill>/`.

#### Scenario: Adding a new skill to report namespace
- **WHEN** creating `/report:new-skill`
- **THEN** location is `skills/report/new-skill/skill.md`
- **THEN** same pattern as dev, sdd, research

---

## Verification

- [ ] All 16 skills are in `skills/<ns>/<skill>/skill.md` format (no flat .md files remain)
- [ ] All scripts are in `skills/<ns>/<skill>/scripts/` (no top-level scripts/ directory used)
- [ ] All cases are in `skills/<ns>/<skill>/cases/` or `skills/skill/cases/` (consistent choice)
- [ ] `.claude/skills/` mirrors the structure exactly
- [ ] Test infrastructure (test-skill, test-all) still locates skills correctly
- [ ] No broken references to skill paths in documentation or code
