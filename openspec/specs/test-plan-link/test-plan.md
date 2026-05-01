---
approach: |
  Manual verification via skill invocation and file inspection.
  Each capability is tested by exercising the relevant skill (sdd:propose, sdd:apply,
  sdd:archive, sdd:contradiction) and checking the resulting artifacts on disk.
  The Python script (contradiction.py) is also tested directly with controlled fixture
  directories to validate its output format and edge-case handling.
acceptance_criteria:
  - sdd:propose creates .sdd.yaml and test-plan.md stubs for every new change
  - sdd:propose reports missing sections in design.md before proceeding
  - sdd:propose reports absent .sdd.yaml reference in proposal.md before proceeding
  - sdd:apply reads test-plan.md as context alongside specs and design.md
  - sdd:apply adds entries to openspec/specs/index.yaml for each capability in .sdd.yaml creates
  - sdd:archive blocks when test-plan.md is missing
  - sdd:archive copies test-plan.md to openspec/specs/<capability>/test-plan.md
  - sdd:archive updates openspec/specs/index.yaml with correct path and test_plan fields
  - contradiction.py reads index.yaml and .sdd.yaml, outputs a structured package with per-capability spec content
  - contradiction.py reports missing files without crashing and includes warnings in output
  - contradiction.py reports if index.yaml or .sdd.yaml are absent and exits cleanly
  - Contradiction report produced by Claude states "Analyzed: N capabilities" and lists all contradictions found
---

## Scenarios

### test-plan-link

**Scenario: sdd:propose creates test-plan.md stub**
Run `sdd:propose` to create a new change. After generation, verify that
`openspec/changes/<name>/test-plan.md` exists, contains YAML front matter with
`approach` and `acceptance_criteria` fields, and includes a `## Scenarios` section
in the markdown body.

**Scenario: test-plan.md is missing at archive time**
Remove `test-plan.md` from a change directory. Run `sdd:archive` on that change.
Verify that archiving is blocked with the message "test-plan.md is missing — required
before archiving" and no files are moved to `openspec/specs/`.

**Scenario: test-plan.md front matter appears unfilled at archive time**
Leave `test-plan.md` with only stub content (e.g., `approach: "Describe test approach
here"`). Run `sdd:archive`. Verify that the skill warns "test-plan.md appears unfilled"
and prompts the author to confirm before proceeding.

**Scenario: sdd:apply reads test-plan as context**
Run `sdd:apply` on a change that has a filled `test-plan.md`. Verify that the skill
reads the file (visible in tool calls or confirmation output) and that generated test
code aligns with the acceptance criteria listed in the front matter.

**Scenario: sdd:archive copies test-plan.md to specs**
Run `sdd:archive` on a change with a valid `test-plan.md`. After archiving, verify
that `openspec/specs/<capability>/test-plan.md` exists and its content matches the
source file in the change directory.

### design-formatter

**Scenario: design.md passes format check**
Create a `design.md` containing all four required sections (`## Technical Approach`,
`## Architecture Decisions`, `## Data Flow`, `## File Changes`). Run `sdd:propose`.
Verify that the skill proceeds without any "missing section" warning.

**Scenario: design.md fails format check — missing section**
Create a `design.md` omitting one required section (e.g., `## Data Flow`). Run
`sdd:propose`. Verify that the skill reports "design.md is missing section: ## Data
Flow" and prompts the author to fix it before proceeding.

**Scenario: format check reruns after fix**
After the author adds the missing section, verify that `sdd:propose` reruns the format
check and proceeds without interruption.

**Scenario: proposal.md is missing .sdd.yaml reference**
Create a `proposal.md` without any mention of `.sdd.yaml`. Run `sdd:propose`. Verify
that the skill reports "proposal.md does not reference .sdd.yaml" and prompts the
author to add the reference.

### proposal-merge-deps

**Scenario: sdd:propose creates .sdd.yaml stub**
Run `sdd:propose` to create a new change. Verify that
`openspec/changes/<name>/.sdd.yaml` exists and contains both `creates` and
`merges-into` fields (even if empty lists).

**Scenario: .sdd.yaml declares creates and merges-into**
For a change that adds new capabilities and modifies existing ones, fill `.sdd.yaml`
with `creates: [new-cap]` and `merges-into: [existing-cap]`. Verify that
`sdd:contradiction` reads both fields and includes specs for all listed capabilities
in the analysis package.

**Scenario: proposal.md has .sdd.yaml reference**
After running `sdd:propose`, open the generated `proposal.md` and verify that a
reference to `.sdd.yaml` is present (e.g., "See `.sdd.yaml` for capability
declarations").

### spec-index-yaml

**Scenario: index.yaml contains all capabilities after apply**
Run `sdd:apply` on a change with `creates: [my-capability]` in `.sdd.yaml`. After
apply, read `openspec/specs/index.yaml` and verify that an entry for `my-capability`
exists with `capability`, `description`, `path`, and `test_plan` fields.

**Scenario: index.yaml references missing file**
Manually add an entry to `index.yaml` pointing to a non-existent `spec.md`. Run
`contradiction.py`. Verify that the script outputs "missing file: <path>" in the
warnings section and continues processing remaining entries.

**Scenario: sdd:archive updates index.yaml**
Run `sdd:archive` on a change. Verify that `openspec/specs/index.yaml` is updated
with correct `path` (e.g., `my-capability/spec.md`) and `test_plan` (e.g.,
`my-capability/test-plan.md`) for all capabilities in `.sdd.yaml` `creates`.

**Scenario: index.yaml is the single registry**
Read `openspec/specs/index.yaml` and verify that every subdirectory present under
`openspec/specs/` (excluding `index.yaml` itself) has a corresponding entry in the
file.

### contradiction-full-scan

**Scenario: full scan discovers all capabilities from index**
Run `sdd:contradiction` on a change that has a `.sdd.yaml`. Verify that
`contradiction.py` reads `index.yaml`, discovers all registered capabilities, loads
their `spec.md` files, and outputs a structured package with each capability's
content.

**Scenario: package contains per-capability spec content**
Inspect the stdout of `contradiction.py`. Verify that for each loaded capability the
output contains a header (`--- Capability: <name> (<path>) ---`) followed by the full
`spec.md` content.

**Scenario: summary block is correct**
Inspect the summary section of the `contradiction.py` output. Verify that
`total_discovered`, `total_loaded`, and `skipped` counts are accurate relative to
the entries in `index.yaml` and any missing files.

**Scenario: missing spec.md is reported without crash**
Remove a `spec.md` referenced in `index.yaml`. Run `contradiction.py`. Verify that
the script includes "missing file: <path>" in warnings and exits with code 0.

**Scenario: index.yaml absent — clean exit**
Run `contradiction.py` against a project root that has no `openspec/specs/index.yaml`.
Verify that the script prints an informational message ("openspec/specs/index.yaml
not found") and exits cleanly without a stack trace.

**Scenario: .sdd.yaml absent — falls back to full index scan**
Run `contradiction.py` against a change directory that has no `.sdd.yaml`. Verify
that the script prints an informational message and proceeds to scan all capabilities
from `index.yaml`.

**Scenario: Claude contradiction report shows coverage**
After `contradiction.py` outputs its package, Claude analyzes it and produces a
report. Verify that the report header states "Analyzed: N capabilities" where N
matches `total_loaded`, lists all detected contradictions with the capabilities
involved, and lists any skipped capabilities separately.
