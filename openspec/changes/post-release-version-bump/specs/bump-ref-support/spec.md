## ADDED Requirements

### Requirement: bump-namespace.sh accepts --ref flag
`bump-namespace.sh` SHALL accept an optional `--ref <value>` flag accepting a git tag, branch name, or commit SHA. Without `--ref`, behaviour is unchanged (latest tag). With `--ref`, the script clones the repo at the specified ref instead of the latest tag.

#### Scenario: Install with branch ref
- **WHEN** developer runs `bump-namespace.sh dev --ref release-0.7.0`
- **THEN** script clones the repo at branch `release-0.7.0`
- **THEN** script prints a WARNING that the ref is not a tag and may be unstable
- **THEN** namespace files are installed from that branch

#### Scenario: Install with commit SHA ref
- **WHEN** developer runs `bump-namespace.sh dev --ref a3f9c12`
- **THEN** script clones the repo at commit `a3f9c12`
- **THEN** script prints a WARNING that the ref is not a tag
- **THEN** namespace files are installed from that commit

#### Scenario: Install without --ref uses latest tag
- **WHEN** developer runs `bump-namespace.sh dev` without --ref
- **THEN** script resolves the latest tag from remote and uses it
- **THEN** no WARNING is printed

### Requirement: Dependencies not auto-updated when using --ref
When `--ref` is provided, `bump-namespace.sh` SHALL skip automatic dependency updates.

#### Scenario: Dependency skip with --ref
- **WHEN** developer runs `bump-namespace.sh sdd --ref release-0.7.0`
- **THEN** dependent namespaces listed in `.manifest` are NOT automatically updated
- **THEN** script prints a notice that dependency auto-update is skipped
