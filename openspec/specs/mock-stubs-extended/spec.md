## Purpose
Extension of stub format with files, mock_commands, and env fields for unit-level testing of deploy and infrastructure skills.
## Requirements
### Requirement: Stub format supports files, mock_commands, env fields
Stubs at `skills/skill/stubs/<name>.md` SHALL support three additional YAML fields beyond `git`, `skills`, `openspec`:

- `files:` — map of `path: content`. Each entry SHALL be materialized as a file at `$TMP/<path>` during stub setup.
- `mock_commands:` — map of `command: shim-script-body`. Each entry SHALL be created as an executable file at `$TMP/.mocks/<command>` during stub setup.
- `env:` — map of `KEY: VALUE`. Each entry SHALL be exported into the subagent's environment.

#### Scenario: Stub with files materializes them
- **WHEN** `skill:test-skill` runs a case with stub containing `files: { Makefile: "deploy:\n\techo ok" }`
- **THEN** `$TMP/Makefile` exists with the specified content before the subagent is launched

#### Scenario: Stub with mock_commands creates executable shims
- **WHEN** `skill:test-skill` runs a case with stub containing `mock_commands: { docker: "echo docker mock: $@" }`
- **THEN** `$TMP/.mocks/docker` exists, is executable, and contains the specified shim body
- **THEN** subagent's `PATH` is prefixed with `$TMP/.mocks` so `docker` invocations hit the shim

#### Scenario: Stub with env exports variables
- **WHEN** `skill:test-skill` runs a case with stub containing `env: { DEPLOY_TOKEN: "fake" }`
- **THEN** subagent receives `DEPLOY_TOKEN=fake` in its environment

### Requirement: Tests stay isolated — no integration scope
Mock infrastructure (`files`, `mock_commands`, `env`) SHALL be used only for unit-level isolation with bootstrapped fakes. End-to-end integration tests (real Docker, real cloud APIs, real external services) are explicitly out of scope of `skill:test-skill`.

#### Scenario: Real external calls are not made
- **WHEN** a case uses `mock_commands` to fake a CLI tool
- **THEN** the shim returns a fixed/scripted output and never invokes the real binary
- **THEN** no network calls or external side effects occur during test execution

#### Scenario: Integration tests use a separate mechanism
- **WHEN** a developer needs to verify real deployment, real API calls, or real infrastructure behavior
- **THEN** `skill:test-skill` is NOT used for that verification
- **THEN** a separate integration-test mechanism (CI pipeline, manual run) is used; `skill:test-skill` remains unit-level

### Requirement: skill:test-skill processes new fields in stub setup
`skills/skill/test-skill.md` step 3b SHALL parse `files`, `mock_commands`, `env` fields and apply them to `$TMP` before launching the subagent.

#### Scenario: All three fields applied together
- **WHEN** stub contains all three fields
- **THEN** files are materialized first, shims second, env third
- **THEN** subagent prompt includes "Working directory: $TMP", `PATH=$TMP/.mocks:$PATH`, and exported env vars

