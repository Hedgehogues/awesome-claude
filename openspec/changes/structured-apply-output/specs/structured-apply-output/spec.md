## ADDED Requirements

### Requirement: sdd:apply produces four-block final report

After implementation tasks are completed, `sdd:apply` SHALL produce a final report containing exactly four mandatory markdown sections, in this fixed order, with these exact Russian headings: `## Технические статусы`, `## Описание`, `## Вопросы к пользователю`, `## Реализованные фичи`.

#### Scenario: Standard apply with implemented features
- **WHEN** `sdd:apply` finishes implementation for a change with non-empty `.sdd.yaml.creates`
- **THEN** the output contains all four headings in the specified order
- **THEN** `## Технические статусы` lists facts only (file paths, test results, exit codes), no prose
- **THEN** `## Описание` contains 2–5 sentences of prose summarising what happened
- **THEN** `## Реализованные фичи` lists each capability from `.sdd.yaml.creates` with status `done` or `partial`

#### Scenario: No blocking questions for the user
- **WHEN** `sdd:apply` finishes and there are no questions that block the user from proceeding
- **THEN** `## Вопросы к пользователю` is rendered with the literal content `_нет_`
- **THEN** the heading itself is still present (not omitted)

### Requirement: Questions section contains only blocking questions

The `## Вопросы к пользователю` section SHALL contain only questions whose answers are required for the user to proceed. Rhetorical questions, exploratory follow-ups, and non-blocking remarks MUST NOT appear in this section. They MAY appear in an optional `## Прочее` section or be omitted.

#### Scenario: Mixed blocking and non-blocking questions
- **WHEN** `sdd:apply` produces both a question that blocks the user (e.g. "rename capability X to Y?") and a non-blocking remark (e.g. "consider extracting Z later")
- **THEN** only the blocking question appears in `## Вопросы к пользователю`
- **THEN** the non-blocking remark appears in `## Прочее` or is omitted

#### Scenario: Minimal number of questions
- **WHEN** `sdd:apply` produces the user-facing report
- **THEN** the number of questions in `## Вопросы к пользователю` is the minimum required for the user to proceed
- **THEN** each question is short, focused, and answerable without re-reading the report

### Requirement: Implemented features list derives from .sdd.yaml and tasks.md

The `## Реализованные фичи` section SHALL be derived from structured sources, not from prose reconstruction. The list of features SHALL be taken from `.sdd.yaml.creates`. The status of each feature (`done` | `partial`) SHALL be determined by aggregating checkbox state in `tasks.md` across the tasks belonging to that capability.

#### Scenario: All tasks for a capability are checked
- **WHEN** every task in `tasks.md` referencing capability `cap-x` is marked `[x]`
- **THEN** `## Реализованные фичи` lists `cap-x` with status `done`

#### Scenario: Some tasks for a capability are open
- **WHEN** at least one task in `tasks.md` referencing capability `cap-x` is `[ ]`
- **THEN** `## Реализованные фичи` lists `cap-x` with status `partial`

#### Scenario: Empty creates field
- **WHEN** `.sdd.yaml.creates` is `[]` or absent
- **THEN** `## Реализованные фичи` is rendered with the literal content `_нет_`
- **THEN** the heading itself is still present

### Requirement: Structured data accessed via Python script

Reading `.sdd.yaml` and parsing `tasks.md` for the final report SHALL be performed by a Python script (`skills/sdd/scripts/apply_report.py`), not by free-form LLM extraction. This conforms to the `claude-way.md` rule for structured data access.

#### Scenario: Script-driven aggregation
- **WHEN** `sdd:apply` reaches the final-report step
- **THEN** it invokes `apply_report.py` to obtain the structured data (capabilities × statuses, file facts)
- **THEN** the LLM only renders the structured data into the four-block markdown template
