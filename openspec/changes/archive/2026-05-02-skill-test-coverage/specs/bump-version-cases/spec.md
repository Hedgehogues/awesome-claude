## ADDED Requirements

### Requirement: bump-version skills have semantic test cases
Each `bump-version` skill (in namespaces `sdd`, `dev`, `report`, `research`) SHALL have a corresponding test case file at `skills/skill/cases/<ns>/bump-version.md`. Each case file SHALL contain at least 2 cases: a happy-path case and an edge case (e.g. missing `.versions` file).

#### Scenario: All four bump-version skills are covered
- **WHEN** developer lists `skills/skill/cases/<ns>/bump-version.md` for each of `sdd`, `dev`, `report`, `research`
- **THEN** all four files exist
- **THEN** each file contains a `# Test: <ns>:bump-version` header
- **THEN** each file contains at least 2 `## Case:` sections

#### Scenario: Cases are mirrored to .claude/
- **WHEN** developer lists `.claude/skills/skill/cases/<ns>/bump-version.md`
- **THEN** all four mirror files exist with identical content to source

### Requirement: Cases reference dependency resolution behavior
Cases for `bump-version` SHALL reference the dependency-resolution behavior introduced in commit 1dafd1b: namespace-level bump computes correct propagation order across `.versions` and `.manifest` files.

#### Scenario: Happy-path case asserts dependency resolution
- **WHEN** `skill:test-skill` runs the happy-path case for any `<ns>:bump-version`
- **THEN** semantic assertions verify: bump traversal order is correct, dependent versions are updated transitively
