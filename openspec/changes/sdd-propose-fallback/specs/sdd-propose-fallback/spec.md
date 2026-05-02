## ADDED Requirements

### Requirement: sdd:propose has preflight check for openspec-propose availability
`sdd:propose` SHALL perform a preflight check at the start of its workflow to determine whether the external skill `openspec-propose` is callable through the Skill tool. The check SHALL distinguish three states: available, unavailable (Unknown skill error), and ambiguous (other error). Behaviour:

- available → proceed with existing workflow (step 1: invoke `openspec-propose`).
- unavailable → switch to fallback path (built-in template generation).
- ambiguous → halt and report the underlying error to the user.

#### Scenario: openspec-propose is registered and callable
- **WHEN** `sdd:propose` is invoked in an environment with `openspec-propose` registered
- **THEN** preflight succeeds without observable side effects
- **THEN** existing step 1 (delegate to openspec-propose) executes normally

#### Scenario: openspec-propose is not registered
- **WHEN** `sdd:propose` is invoked in an environment that returns `Unknown skill: openspec-propose`
- **THEN** preflight detects the unavailability
- **THEN** workflow switches to fallback path (template-based generation)
- **THEN** user is notified explicitly with a WARN block

#### Scenario: ambiguous error during preflight
- **WHEN** preflight call returns an error other than `Unknown skill` (e.g. permission, network)
- **THEN** workflow halts
- **THEN** the underlying error is shown to the user

### Requirement: Fallback path generates change artifacts from templates
When the fallback path is taken, `sdd:propose` SHALL create the standard change artifacts using built-in templates instead of delegating to `openspec-propose`. The templates SHALL reside in `skills/sdd/propose/templates/` as `.md.tmpl` files and SHALL produce structurally valid artifacts (passing `check-design.py` and conforming to `proposal.md` reference requirement).

#### Scenario: fallback creates four artifact files
- **WHEN** fallback path is taken with arguments `<name> <description>`
- **THEN** `openspec/changes/<name>/proposal.md` is created from `proposal.md.tmpl` with `{{name}}` and `{{description}}` substituted
- **THEN** `openspec/changes/<name>/design.md` is created from `design.md.tmpl` with all 4 required sections present
- **THEN** `openspec/changes/<name>/tasks.md` is created from `tasks.md.tmpl`
- **THEN** `openspec/changes/<name>/specs/<name>-placeholder/spec.md` is created from `spec.md.tmpl`

#### Scenario: fallback-generated design passes check-design.py
- **WHEN** `check-design.py` is run against fallback-generated `design.md`
- **THEN** exit code is 0
- **THEN** all 4 required sections (`## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`) are detected

#### Scenario: fallback-generated proposal references .sdd.yaml
- **WHEN** fallback-generated `proposal.md` is checked
- **THEN** it contains a reference to `.sdd.yaml` (per `design-formatter` capability)

### Requirement: Fallback emits explicit diagnostic block
When the fallback path is taken, `sdd:propose` SHALL emit a WARN block to the user containing: (a) the reason (`openspec-propose unavailable`), (b) the source of templates, (c) the list of generated files, (d) a hint to fill TODO sections before next workflow step.

#### Scenario: WARN block format
- **WHEN** fallback path runs to completion
- **THEN** output contains string `WARN: openspec-propose unavailable`
- **THEN** output lists `Templates source: skills/sdd/propose/templates/`
- **THEN** output enumerates each generated file path
- **THEN** output ends with hint about filling TODO before `/sdd:contradiction`

### Requirement: Fallback path completes the rest of sdd:propose workflow
After fallback-generation of artifacts, `sdd:propose` SHALL continue with steps 3–11 of its workflow (identity, .sdd.yaml, .sdd-state.yaml, owner, test-plan.md, merge-dialog, design-check, proposal-reference-check, stub-cases). The fallback path differs from the existing path only at step 1 (artifact generation source); steps 3–11 are identical.

#### Scenario: post-fallback workflow runs to completion
- **WHEN** fallback-generation completes successfully
- **THEN** `sdd:propose` proceeds to step 3 (identity check)
- **THEN** `.sdd.yaml`, `.sdd-state.yaml`, `test-plan.md` are created via existing scripts
- **THEN** owner is set, design-check is performed, proposal-reference-check is performed
- **THEN** workflow ends in the same state as the non-fallback path
