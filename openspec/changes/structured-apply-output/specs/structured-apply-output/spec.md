## ADDED Requirements

### Requirement: Three SDD workflow skills produce a fixed-order user-facing report

The skills `sdd:apply`, `sdd:contradiction`, and `sdd:archive` SHALL each produce a final user-facing report whose blocks appear in this exact canonical order, top-to-bottom:

1. `## Технические статусы` (mandatory)
2. `## Описание` (mandatory)
3. `## <per-skill итог>` (mandatory) — per-skill: `## Реализованные фичи` (`sdd:apply`), `## Найденные противоречия` (`sdd:contradiction`), `## Архивированные артефакты` (`sdd:archive`)
4. `## Как проверить` (mandatory only for `sdd:apply`; absent in `sdd:contradiction` and `sdd:archive`)
5. `## Решено самостоятельно` (optional, omitted when empty)
6. `## Прочее` (optional, omitted when empty)
7. `## Вопросы к пользователю` (mandatory, **always last** — see separate Requirement)

No content SHALL appear below `## Вопросы к пользователю`. The block order is identical across the three skills, with the exception that `## Как проверить` exists only in `sdd:apply`.

#### Scenario: sdd:apply final report
- **WHEN** `sdd:apply` finishes implementation for a change with non-empty `.sdd.yaml.creates`
- **THEN** the output contains in order: `## Технические статусы`, `## Описание`, `## Реализованные фичи`, `## Как проверить`, then optionally `## Решено самостоятельно` and `## Прочее`, then finally `## Вопросы к пользователю`
- **THEN** `## Технические статусы` lists facts only (file paths, test results, exit codes, index.yaml updates), no prose
- **THEN** `## Описание` contains 2–5 sentences of prose
- **THEN** `## Реализованные фичи` lists each capability from `.sdd.yaml.creates` with status `done` or `partial`

#### Scenario: sdd:contradiction final report
- **WHEN** `sdd:contradiction` finishes its detector phases for a change directory
- **THEN** the output contains in order: `## Технические статусы`, `## Описание`, `## Найденные противоречия`, then optionally `## Решено самостоятельно` and `## Прочее`, then finally `## Вопросы к пользователю`
- **THEN** `## Технические статусы` contains the existing detailed detector report (Hard issues / Soft warnings / Subjects covered / Summary) verbatim, without modification
- **THEN** `## Найденные противоречия` contains a compact summary of hard issue counts by class and warning counts derived from the detailed report's Summary
- **THEN** if the detailed report has no hard issues, `## Найденные противоречия` contains the literal content `_нет_`

#### Scenario: sdd:archive final report
- **WHEN** `sdd:archive` finishes archiving a completed change with non-empty `.sdd.yaml.creates`
- **THEN** the output contains in order: `## Технические статусы`, `## Описание`, `## Архивированные артефакты`, then optionally `## Решено самостоятельно` and `## Прочее`, then finally `## Вопросы к пользователю`
- **THEN** `## Архивированные артефакты` lists each archived capability from `.sdd.yaml.creates` with paths to `openspec/specs/<capability>/spec.md` and `openspec/specs/<capability>/test-plan.md`

#### Scenario: Nothing appears below the Questions block
- **WHEN** any of the three skills produces the user-facing report
- **THEN** `## Вопросы к пользователю` is the last block in the document
- **THEN** no markdown heading and no prose appears between the last line of `## Вопросы к пользователю` and the end of the report

### Requirement: sdd:apply renders mandatory «Как проверить» block

The `sdd:apply` skill SHALL render a mandatory block `## Как проверить` immediately after `## Реализованные фичи` and before any optional block. The block SHALL provide concrete verification guidance for each implemented capability/feature using a fixed three-field structure: «Что» (what is being verified), «Где» (where: file path / URL / test name / command), and «Как» (how: exact command + expected observable result, or short manual steps).

The block SHALL NOT appear in `sdd:contradiction` or `sdd:archive` final reports.

The structured skeleton (Что / Где) SHALL be derived by `apply_report.py` from `test-plan.md` (`acceptance_criteria` and `## Scenarios`) and `tasks.md` (touched test files and commands). The «Как» field is filled by Claude based on change context; if Claude has to choose between equivalent commands, the chosen command SHALL appear in the same line and the choice SHALL be recorded in `## Решено самостоятельно`.

#### Scenario: Apply with capabilities and test-plan present
- **WHEN** `sdd:apply` finishes for a change with non-empty `.sdd.yaml.creates` and a filled `test-plan.md`
- **THEN** `## Как проверить` is rendered immediately after `## Реализованные фичи`
- **THEN** for each capability listed in `## Реализованные фичи` there is at least one numbered entry in `## Как проверить`
- **THEN** every entry contains all three fields: «Что:», «Где:», «Как:»
- **THEN** the «Как:» field includes either a command (e.g. `make test`, `pytest <path>::<test>`) followed by the expected observable result, or a short numbered list of manual steps with the expected outcome

#### Scenario: Apply with empty creates or missing test-plan
- **WHEN** `.sdd.yaml.creates` is `[]`/absent or `test-plan.md` is missing
- **THEN** `## Как проверить` is rendered with the body `_нет_`
- **THEN** the heading itself is still present

#### Scenario: Block absent in contradiction and archive
- **WHEN** `sdd:contradiction` or `sdd:archive` produces the user-facing report
- **THEN** `## Как проверить` does NOT appear at all (no heading, no body)

#### Scenario: Command choice recorded in autonomous decisions
- **WHEN** Claude has to choose between equivalent verification commands (e.g. `make test` vs direct `pytest`) while filling the «Как» field
- **THEN** the chosen command appears in `## Как проверить`
- **THEN** the choice and its rationale appear as a single line in `## Решено самостоятельно` in the format `<вопрос-кратко> → <решение-кратко>`

### Requirement: Empty fourth-block content renders as «_нет_»

When the data source for the fourth block is empty (no implemented features, no contradictions, no archived artifacts), the heading SHALL still be rendered, and its body SHALL contain the literal content `_нет_`.

#### Scenario: sdd:apply with empty creates
- **WHEN** `.sdd.yaml.creates` is `[]` or absent
- **THEN** `## Реализованные фичи` is rendered with the body `_нет_`
- **THEN** the heading itself is still present

#### Scenario: sdd:contradiction with no hard issues
- **WHEN** the detector phases find zero hard issues
- **THEN** `## Найденные противоречия` is rendered with the body `_нет_`
- **THEN** the heading itself is still present

#### Scenario: sdd:archive with empty creates
- **WHEN** `.sdd.yaml.creates` is `[]` or absent
- **THEN** `## Архивированные артефакты` is rendered with the body `_нет_`
- **THEN** the heading itself is still present

### Requirement: Questions block is last and ends with a mandatory CTA

The `## Вопросы к пользователю` section in all three skills SHALL be the **last block** of the user-facing report. Any content not requiring user reaction (technical facts, prose, per-skill итог, autonomous decisions, miscellaneous notes) SHALL appear above this block.

The section SHALL contain ONLY questions whose answers require knowledge or preferences that Claude does not possess: business priorities, domain decisions, personal user preferences, or trade-offs with equivalent technical consequences. Questions that Claude is able to answer autonomously MUST NOT appear in this section — they belong in `## Решено самостоятельно`. Rhetorical questions and exploratory follow-ups MAY appear in `## Прочее` or be omitted.

The **last line** of the section SHALL be a call-to-action question. The default CTA is the literal string `Продолжаем по флоу? (да / нет)`. When no other user-only questions exist, the section consists of exactly one numbered line: `1. Продолжаем по флоу? (да / нет)`. When user-only questions exist, they are numbered first; the CTA is rendered as the final numbered line.

#### Scenario: All decisions are autonomous
- **WHEN** all forks encountered during the skill's run can be decided by Claude itself
- **THEN** `## Вопросы к пользователю` contains exactly one numbered question: `1. Продолжаем по флоу? (да / нет)`
- **THEN** every autonomous decision appears in `## Решено самостоятельно` instead
- **THEN** the CTA line is the last line of the report

#### Scenario: Mixed user-only and autonomous decisions
- **WHEN** the skill's run yields one user-only fork (e.g. "rename capability X to Y — both options are valid, your call?") and several autonomous forks (e.g. "missing line break after section header — added")
- **THEN** the user-only fork appears in `## Вопросы к пользователю` numbered before the CTA
- **THEN** the CTA `Продолжаем по флоу? (да / нет)` appears as the final numbered line
- **THEN** every autonomous fork appears in `## Решено самостоятельно`
- **THEN** no autonomous fork appears in `## Вопросы к пользователю`

#### Scenario: CTA is always the final line
- **WHEN** any of the three skills produces the user-facing report
- **THEN** the last non-blank line of the report is a call-to-action question
- **THEN** by default this line is `<N>. Продолжаем по флоу? (да / нет)` where `N` equals `1 + count(user-only-questions)`

#### Scenario: Minimum question count
- **WHEN** any of the three skills produces the user-facing report
- **THEN** the number of questions in `## Вопросы к пользователю` is the minimum: exactly one (the CTA) when no user-only forks exist, or `1 + N` where `N` is the count of true user-only forks
- **THEN** each question is short, focused, and answerable without re-reading the report

#### Scenario: Empty section is forbidden
- **WHEN** any of the three skills produces the user-facing report
- **THEN** `## Вопросы к пользователю` is never empty and is never rendered with `_нет_`
- **THEN** at minimum the default `1. Продолжаем по флоу? (да / нет)` CTA line is present

### Requirement: Autonomous decisions block

A new optional section `## Решено самостоятельно` SHALL appear after the per-skill итог block (and after `## Как проверить` in `sdd:apply`), and before `## Прочее` and `## Вопросы к пользователю`, when at least one autonomous decision was taken during the skill's run. Each line in the section SHALL follow the format `<вопрос-кратко> → <решение-кратко>`. The section SHALL be omitted entirely when no autonomous decisions were taken.

#### Scenario: Autonomous decision taken
- **WHEN** Claude resolves a fork autonomously during the run (e.g. "spec references absent file — added a creation task in tasks.md instead of removing the reference")
- **THEN** `## Решено самостоятельно` is rendered after the per-skill итог block (after `## Как проверить` in `sdd:apply`) and before `## Вопросы к пользователю`
- **THEN** the resolved fork appears as a single line in the format `<вопрос-кратко> → <решение-кратко>`

#### Scenario: No autonomous decisions
- **WHEN** Claude takes no autonomous decisions during the run
- **THEN** `## Решено самостоятельно` is omitted from the output entirely
- **THEN** the heading itself is not rendered

#### Scenario: Section is distinct from `## Прочее`
- **WHEN** a thought has no associated decision (a follow-up idea, a rhetorical observation)
- **THEN** it appears in `## Прочее`, not in `## Решено самостоятельно`
- **THEN** `## Решено самостоятельно` contains only entries with an explicit `→ <решение>` part

### Requirement: Fourth-block content derives from structured sources

The content of the fourth block SHALL be derived from structured sources, not from prose reconstruction. Per skill:

- `sdd:apply` uses `.sdd.yaml.creates` for the capability list and `tasks.md` checkbox state for the `done`/`partial` status.
- `sdd:contradiction` uses the Summary section of the existing detailed detector report (numerical counters per class).
- `sdd:archive` uses `.sdd.yaml.creates` and on-disk presence of `openspec/specs/<capability>/spec.md` and `openspec/specs/<capability>/test-plan.md`.

#### Scenario: apply — all tasks for a capability are checked
- **WHEN** every task in `tasks.md` referencing capability `cap-x` is marked `[x]`
- **THEN** `## Реализованные фичи` lists `cap-x` with status `done`

#### Scenario: apply — some tasks for a capability are open
- **WHEN** at least one task in `tasks.md` referencing capability `cap-x` is `[ ]`
- **THEN** `## Реализованные фичи` lists `cap-x` with status `partial`

#### Scenario: contradiction summary derives from detailed report
- **WHEN** the detailed detector report's Summary line shows `hard: 3 (numeric=1, semantic=2)` and `warnings: 5`
- **THEN** `## Найденные противоречия` reflects those counts compactly (e.g. `hard=3 (numeric=1, semantic=2), warnings=5, residual_risk=...`)

#### Scenario: archive — capability files exist on disk
- **WHEN** `.sdd.yaml.creates` contains `cap-x` and both `openspec/specs/cap-x/spec.md` and `openspec/specs/cap-x/test-plan.md` exist after archiving
- **THEN** `## Архивированные артефакты` lists `cap-x` with both paths

### Requirement: Structured data accessed via Python scripts

Reading `.sdd.yaml`, parsing `tasks.md`, parsing the detailed detector report's Summary, and checking on-disk file presence SHALL be performed by Python scripts in `skills/sdd/scripts/`, not by free-form LLM extraction. This conforms to the `claude-way.md` rule for structured-data access.

#### Scenario: apply uses apply_report.py
- **WHEN** `sdd:apply` reaches the final-report step
- **THEN** it invokes `apply_report.py` to obtain the structured data (capabilities × statuses, file facts)
- **THEN** the LLM only renders the structured data into the four-block markdown template

#### Scenario: contradiction uses contradiction_summary.py
- **WHEN** `sdd:contradiction` reaches the final-report step
- **THEN** it invokes `contradiction_summary.py` to extract counts from the detailed report's Summary
- **THEN** the LLM only renders the four-block wrapper

#### Scenario: archive uses archive_report.py
- **WHEN** `sdd:archive` reaches the final-report step
- **THEN** it invokes `archive_report.py` to obtain the list of archived capabilities and their on-disk paths
- **THEN** the LLM only renders the four-block markdown template

### Requirement: Communication style in the three workflow skill reports

The skills `sdd:apply`, `sdd:contradiction`, and `sdd:archive` SHALL follow these communication-style rules in their final user-facing report:

1. **Action over question (default).** Forks resolvable by reasonable assumption SHALL be resolved autonomously and recorded in `## Решено самостоятельно`. A question SHALL appear in `## Вопросы к пользователю` only when answering it requires knowledge or preferences Claude does not possess.
2. **Output shape matches request shape.** The seven-block report format SHALL be used ONLY for the final output of these three skills. Intermediate exchanges (clarifications, partial updates, meta-questions inside the skill's run) SHALL use plain prose of 2–3 sentences without markdown section headings.
3. **Action before narration.** When a skill performs `Edit`/`Write` on the user's behalf and the user did not explicitly request a plan, the skill SHALL execute the action first and report a 1–2 line summary afterwards. Pre-action narration is permitted only for destructive or long-running side-effecting operations (push, deploy, schema drop).
4. **No internal jargon in user-facing blocks.** The `## Описание` and `## Решено самостоятельно` blocks MUST NOT contain detector-internal terminology such as `hard issue`, `drift_score`, `residual_risk`, `SSOT`, `pointer-rewrite`, `Mandatory-блок N`, `convergence`, or `decision gate`. Such terms MAY appear inside `## Технические статусы` of `sdd:contradiction` (where the detailed detector report is embedded verbatim). User-facing blocks SHALL paraphrase in plain language.

#### Scenario: Autonomous fork resolution
- **WHEN** during a skill's run there is a fork with a clearly preferable choice based on context (e.g. file naming convention, available command, structural consistency)
- **THEN** the skill resolves the fork without asking the user
- **THEN** the resolved fork appears as a single line in `## Решено самостоятельно`
- **THEN** `## Вопросы к пользователю` does not contain a question for that fork

#### Scenario: Intermediate prose response
- **WHEN** the user sends a clarification or meta-question inside the skill's run (before the final report is produced)
- **THEN** the skill replies in plain prose of 2–3 sentences
- **THEN** no `## Технические статусы` / `## Описание` / `## Вопросы к пользователю` headings are emitted in that intermediate reply

#### Scenario: Action before narration on Edit/Write
- **WHEN** the skill needs to perform `Edit` or `Write` to fulfil the user's request and the request did not explicitly ask for a plan
- **THEN** the skill performs the `Edit`/`Write` first
- **THEN** the skill emits a 1–2 line summary after the action ("file X updated", "section Y replaced")

#### Scenario: Plain-language paraphrase of detector findings
- **WHEN** `sdd:contradiction` produces the user-facing wrapper and a hard issue exists inside the detailed detector report
- **THEN** the `## Описание` block describes the issue in plain language ("одна строка в design.md устарела после вставки нового блока — нумерация разъехалась")
- **THEN** terms like `hard issue`, `numeric detector`, `drift_score` do NOT appear in `## Описание` or `## Решено самостоятельно`
- **THEN** those terms MAY still appear inside `## Технические статусы` (the embedded detailed report is verbatim and unmodified)

### Requirement: Existing sdd:contradiction detector report is preserved verbatim

The existing detailed detector report format produced by `sdd:contradiction` (Hard issues / Soft warnings / Subjects covered / Summary, defined in `skills/sdd/contradiction.md` → "Report format") SHALL be preserved without modification. The new four-block user-facing wrapper SHALL embed the existing report verbatim inside the `## Технические статусы` section.

#### Scenario: detailed report embedded verbatim
- **WHEN** `sdd:contradiction` produces both the existing detailed report and the new user-facing wrapper
- **THEN** the existing report's headings (`--- Hard issues ---`, `--- Soft warnings ---`, `--- Summary ---` etc.) appear unchanged inside `## Технические статусы`
- **THEN** no detector output is moved, deduplicated, or reformatted between the two layers
