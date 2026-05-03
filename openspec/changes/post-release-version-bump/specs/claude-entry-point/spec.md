## ADDED Requirements

### Requirement: bump-namespace.sh adds awesome-claude section to user CLAUDE.md on first install
On the first installation of any namespace, `bump-namespace.sh` SHALL add an `## awesome-claude` section to the user's `CLAUDE.md` file if one does not already exist.

#### Scenario: First namespace install adds section
- **WHEN** developer installs any namespace for the first time (no awesome-claude section in CLAUDE.md)
- **THEN** `CLAUDE.md` gains a new `## awesome-claude` section
- **THEN** section contains the source URL `https://github.com/Hedgehogues/awesome-claude`
- **THEN** section contains a reference to `.claude/awesome-claude/index.md`

#### Scenario: Subsequent installs do not duplicate section
- **WHEN** developer installs a second namespace and CLAUDE.md already has the section
- **THEN** existing section is not duplicated or modified

#### Scenario: CLAUDE.md does not exist
- **WHEN** `CLAUDE.md` does not exist in the project
- **THEN** script creates `CLAUDE.md` with the `## awesome-claude` section

### Requirement: index.md lists all installed namespaces
`.claude/awesome-claude/index.md` SHALL be created or updated on each namespace install, listing only the installed namespaces with their paths.

#### Scenario: index.md updated after install
- **WHEN** developer installs namespace `dev`
- **THEN** `.claude/awesome-claude/index.md` contains an entry for `dev` pointing to `.claude/skills/dev/`
- **THEN** uninstalled namespaces are not listed
