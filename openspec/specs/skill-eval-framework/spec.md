# skill-eval-framework Specification

## Purpose
TBD - created by archiving change install-modes. Update Purpose after archive.
## Requirements
### Requirement: skill:test-skill creates results file before running any cases
When `skill:test-skill` is invoked, it SHALL create `test-results/YYYY-MM-DD-HHMMSS.md` immediately — before executing any test case. Each case result SHALL be appended to the file as it completes.

#### Scenario: Results file exists before first case runs
- **WHEN** `skill:test-skill` is invoked
- **THEN** `test-results/<timestamp>.md` is created
- **THEN** the file exists before the first case result is written

#### Scenario: Each result is appended immediately
- **WHEN** a bootstrap run completes for a case
- **THEN** the result (status + LLM-judge reason) is appended to the results file
- **THEN** subsequent runs append their results without overwriting previous ones

### Requirement: skill:test-skill evaluates assertions via contains and LLM-judge
Each test case SHALL define assertions of two kinds: `contains:` (deterministic string checks) and `semantic:` (evaluated by a separate LLM call). The LLM-judge SHALL answer "yes/no + reason" for each semantic assertion.

#### Scenario: contains assertion passes
- **WHEN** the skill output includes all strings listed under `contains:`
- **THEN** the contains assertion passes

#### Scenario: semantic assertion evaluated by LLM-judge
- **WHEN** a `semantic:` assertion is present
- **THEN** a separate LLM call is made with the output and the assertion criterion
- **THEN** the LLM-judge returns yes/no and a one-line reason
- **THEN** the reason is recorded in the results file

### Requirement: skill:test-skill uses bootstrap k=5 with ≥4/5 threshold
Each test case SHALL be executed k=5 times. A case PASSES if assertions hold in ≥4 of 5 runs. Fewer than 4 passes produces a WARN result.

#### Scenario: Case passes at 4/5
- **WHEN** 4 out of 5 bootstrap runs satisfy all assertions
- **THEN** case result is PASS

#### Scenario: Case warns at 3/5
- **WHEN** only 3 out of 5 bootstrap runs satisfy all assertions
- **THEN** case result is ⚠ WARN

### Requirement: skill:test-skill displays per-run progress in real time
During execution, progress SHALL be printed for each case as runs complete: `[case-name] 1/5 ✓  2/5 ✗  …  → PASS 4/5` or `→ ⚠ WARN 3/5`.

#### Scenario: Progress printed per run
- **WHEN** bootstrap run N completes for a case
- **THEN** `N/5 ✓` or `N/5 ✗` is printed immediately
- **THEN** after all 5 runs the final verdict is printed on the same line

