---
approach: |
  Test the skill-test-coverage change by verifying:
  1. Test infrastructure updates (test-skill, test-all) work with new structure
  2. Mock-stubs extended features (files, mock_commands, env) function correctly
  3. TDD coverage policy is enforced and checker works
  4. Test execution lifecycle manages cleanup properly
  5. Documentation is accurate and linked correctly
  6. Skills folder reorganization is complete and consistent

acceptance_criteria:
  - ac-mock-stubs: test-skill materializes files and mock commands in $TMP with correct PATH and env vars
  - ac-tdd-coverage: check-coverage-matrix.py correctly identifies skills with incomplete coverage (< 4 categories)
  - ac-test-lifecycle: RUN_ROOT auto-cleanup via trap EXIT works, status.json created and cleaned up
  - ac-docs-clarity: README.md is <100 lines, CLAUDE_INSTALL.md has explicit Claude instructions, README_DETAILED.md links to installation guide
  - ac-skills-org: All 29 skills at skills/<ns>/<skill>/skill.md, scripts/cases colocated, .claude/skills mirrors exactly
  - ac-paths-updated: test-skill and test-all find cases and skills in new locations
---

## Scenarios

### Scenario 1: Mock-stubs with files and commands work in test-skill

**Setup:** skill:test-skill with case using with-deploy-config stub (has files: Makefile, mock_commands: docker, env: DEPLOY_ENV)

**When:** Test runs and materializes stub

**Then:**
- `$TMP/Makefile` exists with correct content
- `$TMP/.mocks/docker` is executable
- `make deploy` from within $TMP calls mocked docker (not real)
- Environment variables passed to agent (DEPLOY_ENV=staging visible)

### Scenario 2: TDD coverage policy enforcement

**Setup:** Run skill:test-all to check coverage across all skills

**When:** Coverage checker runs after all tests complete

**Then:**
- Scripts identifies skills with coverage < 4 categories
- Output lists missing categories per skill (e.g., "sdd:propose: missing negative-missing-input")
- All 27 non-infrastructure skills have 4-category coverage (verified by manual audit of case files)

### Scenario 3: Test execution cleanup works

**Setup:** Run skill:test-skill with multiple cases

**When:** All cases complete or any case fails

**Then:**
- `$RUN_ROOT` directory auto-deleted on exit (trap EXIT triggered)
- No tmp files remain in /tmp from test run
- `--keep-tmp=all` preserves `$RUN_ROOT` for debugging
- `--keep-tmp=failed-only` copies only failed case dirs to `~/.cache/skill-test/`

### Scenario 4: New skills directory structure is complete

**Setup:** List all skills in hierarchical structure

**When:** User explores skills/ and .claude/skills/

**Then:**
- All 29 skills at `skills/<ns>/<skill>/skill.md` (no flat .md files remain)
- Colocated scripts: `skills/sdd/apply/scripts/test-plan-to-cases.py`, etc.
- Colocated cases: `skills/dev/tdd/cases/tdd.md`, etc.
- `.claude/skills/` mirrors exactly (same file count, same structure)
- test-skill.md and test-all.md find cases at new paths

### Scenario 5: Documentation is clear and linked

**Setup:** User opens README.md and follows installation instructions

**When:** User reads main README and finds installation guide reference

**Then:**
- README.md is concise (< 100 lines) with install command and skill overview
- CLAUDE_INSTALL.md contains explicit bash command for Claude to execute
- docs/README_DETAILED.md linked from README_DETAILED (via CLAUDE_INSTALL.md reference)
- .claude/CLAUDE.md explains how to use awesome-claude after installation

---

## Notes for Test Execution

- Verify skills/<ns>/<skill>/ structure visually: `find skills -name skill.md | wc -l` should show 29
- Check mirror consistency: `diff -r skills/ .claude/skills/` (excluding .manifest files) should show no differences
- Run test:all manually to verify coverage report: `/skill:test-all` should complete without errors
- Manually verify mock execution with deploy skill test case
