## MODIFIED Requirements

### Requirement: Change directory contains test-plan.md with YAML front matter and markdown body
Every new change created after implementing this capability SHALL include a `test-plan.md` file combining YAML front matter for structured fields and a markdown body for scenarios. `sdd:propose` creates the stub automatically. Existing changes without `test-plan.md` continue to work.

`test-plan.md` is the **contract** for acceptance criteria. Materialization of `acceptance_criteria` into runnable case files is governed by capability `test-flow` (see `openspec/specs/test-flow/spec.md`), not by this capability. `test-plan-link` describes only the contract format and lifecycle; how acceptance becomes executable is an implementation concern delegated to `test-flow`.

```markdown
---
approach: |
  Describe test approach here
acceptance_criteria:
  - criterion one
  - criterion two
---

## Scenarios

Describe scenarios in prose here.
```

#### Scenario: New change is created
- **WHEN** author creates a new change via `sdd:propose`
- **THEN** `openspec/changes/<name>/test-plan.md` exists
- **THEN** file has YAML front matter with fields: `approach`, `acceptance_criteria`
- **THEN** file has markdown body with `## Scenarios` section

#### Scenario: test-plan.md is missing at archive time
- **WHEN** `sdd:archive` checks the change directory and `test-plan.md` is absent
- **THEN** archive is blocked with: "test-plan.md is missing — required before archiving"

#### Scenario: test-plan.md front matter has unfilled fields at archive time
- **WHEN** `sdd:archive` checks `test-plan.md` and YAML front matter fields contain only stub content
- **THEN** archive warns: "test-plan.md appears unfilled" and prompts author to confirm

#### Scenario: materialization is delegated to test-flow
- **WHEN** developer ищет, как `acceptance_criteria` превращаются в исполняемые тесты
- **THEN** ответ — в spec capability `test-flow`, не `test-plan-link`
- **THEN** `test-plan-link` отвечает только за формат и lifecycle самого `test-plan.md`
