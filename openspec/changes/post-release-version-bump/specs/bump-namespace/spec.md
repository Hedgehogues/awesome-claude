## MODIFIED Requirements

### Requirement: .versions stores type:label@sha format
`.versions` SHALL store installed namespace versions in `type:label@sha` format. The SHA part is always a resolved git commit SHA. The type prefix is one of `tag:`, `branch:`, or `sha:`.

#### Scenario: Tag install format
- **WHEN** developer installs namespace `dev` from tag `v0.7.0`
- **THEN** `.versions` contains `dev=tag:v0.7.0@<resolved-sha>`

#### Scenario: Branch install format
- **WHEN** developer installs namespace `dev` from branch `release-0.7.0`
- **THEN** `.versions` contains `dev=branch:release-0.7.0@<resolved-sha>`

#### Scenario: SHA install format
- **WHEN** developer installs namespace `dev` from explicit SHA `a3f9c12`
- **THEN** `.versions` contains `dev=sha:a3f9c12`

### Requirement: already-installed check compares SHA only
`bump-namespace.sh` SHALL determine whether a namespace is up to date by comparing only the SHA part of the stored value, not the full string.

#### Scenario: Up to date by SHA
- **WHEN** `.versions` contains `dev=branch:release-0.7.0@a3f9c12` and remote HEAD resolves to `a3f9c12`
- **THEN** script reports namespace is already up to date and exits without updating

#### Scenario: Outdated branch
- **WHEN** `.versions` contains `dev=branch:release-0.7.0@a3f9c12` and remote HEAD resolves to `b4e8d23`
- **THEN** script proceeds with the update
