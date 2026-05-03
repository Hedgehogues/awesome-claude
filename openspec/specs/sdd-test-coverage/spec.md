# sdd-test-coverage Specification

## Purpose
TBD - created by archiving change install-modes. Update Purpose after archive.
## Requirements
### Requirement: Each sdd skill has a test spec next to its skill.md
Каждый скилл `sdd:<name>` SHALL иметь test-spec по фиксированному пути `skills/sdd/<name>/cases/<name>.md`. Файл SHALL содержать минимум один `## Case:` с полями `stub`, `contains` и (опционально) `semantic`. На момент creation этого change такие файлы существуют для всех 10 скиллов в `skills/sdd/`: `apply`, `archive`, `audit`, `bump-version`, `contradiction`, `explore`, `help`, `propose`, `repo`, `sync`. Capability требует расширить их до 4 категорий покрытия (см. ниже).

#### Scenario: every sdd skill has a test spec
- **WHEN** `skill:test-skill sdd:<name>` is invoked for any sdd skill
- **THEN** `skills/sdd/<name>/cases/<name>.md` is found
- **THEN** at least one Case is executed against a materialized stub

#### Scenario: propose test spec covers 4 categories
- **WHEN** `skill:test-skill sdd:propose` is invoked
- **THEN** `skills/sdd/propose/cases/propose.md` contains cases for all four categories (positive-happy, positive-corner, negative-missing-input, negative-invalid-input)

#### Scenario: apply test spec covers 4 categories
- **WHEN** `skill:test-skill sdd:apply` is invoked
- **THEN** `skills/sdd/apply/cases/apply.md` contains cases for all four categories

### Requirement: sdd test specs use appropriate stubs
`propose`, `sync`, `help`, `explore`, `repo`, `bump-version` test specs SHALL use the `fresh-repo` stub (or a stub without active openspec changes) for their happy-path case. `apply`, `archive`, `audit`, `contradiction` test specs SHALL use a stub that includes at least one entry in `openspec.changes` (e.g. the new `with-change` stub introduced by this change).

#### Scenario: propose case uses fresh-repo stub
- **WHEN** `sdd:propose` happy-path case is materialized
- **THEN** the stub has no `openspec.changes` entries
- **THEN** the case verifies that proposal creation output appears

#### Scenario: apply case uses stub with existing change
- **WHEN** `sdd:apply` happy-path case is materialized
- **THEN** the stub contains at least one name in `openspec.changes`
- **THEN** the case verifies that task listing or implementation output appears

