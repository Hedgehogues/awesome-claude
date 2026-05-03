# contributor-workflow Specification

## Purpose
TBD - created by archiving change install-modes. Update Purpose after archive.
## Requirements
### Requirement: skill:onboarding shows the full contributor path through Claude skills
`/skill:onboarding` SHALL check the current dev setup state and display the complete contributor workflow with the next recommended step highlighted.

#### Scenario: Fresh contributor without dev setup
- **WHEN** developer invokes `/skill:onboarding` and `.claude/skills` is not a symlink
- **THEN** skill shows the full workflow path: `skill:setup` → `skill:deps` → `sdd:explore` → `sdd:contradiction` → `sdd:propose` → `sdd:apply` → `sdd:change-verify` → `skill:test-skill` → `sdd:archive` → `sdd:spec-verify` → `skill:release`
- **THEN** skill highlights step 1 (setup) as the next action: "Run `/skill:setup` to link repo files"

#### Scenario: Dev setup done, no active changes
- **WHEN** symlinks are in place and `openspec/changes/` has no active changes
- **THEN** skill highlights step 2: "Run `/sdd:propose` to start a new skill change"

#### Scenario: Active change exists
- **WHEN** `openspec/changes/` contains at least one change directory
- **THEN** skill lists active changes by name
- **THEN** skill highlights next step based on change state (apply or test)

### Requirement: skill:onboarding does not auto-invoke other skills
`/skill:onboarding` SHALL only display guidance and status — it SHALL NOT automatically run `/skill:setup`, `/sdd:propose`, or any other skill.

#### Scenario: User reads the workflow
- **WHEN** developer invokes `/skill:onboarding`
- **THEN** no other skill is invoked automatically
- **THEN** user receives a readable summary with explicit skill invocation hints

