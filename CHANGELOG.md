# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.7.0] - 2026-05-04

### Added

- **`manifest.yaml` namespaces section** — canonical namespace registry (`dev`, `sdd`, `report`, `research`, `skill`, `opsx`) with `public` flag and skill lists; used by `recommend-skills.md` rule and bump-version skills.
- **SDD state hook** — `PostToolUse` hook (`skills/sdd/scripts/state_hook.py`) applies pending state transitions automatically; no more manual `state.py transition` calls inside skill files.
- **Declarative state router** — `skills/scripts/state_manager.py` reads per-skill `state.yaml`, validates step against `current_stage`, accumulates `pending_transitions`; skills now declare transitions instead of imperating them.
- **Per-skill `state.yaml`** — `skills/sdd/{apply,archive,contradiction,propose}/state.yaml` declare allowed stages and transitions for each skill step.
- **`sre:` namespace** — new `sre:incident-mr` skill for GitLab incident MR workflow.
- **`dev:install` skill** — automates awesome-claude installation flow.
- **`skills/scripts/` shared scripts** — `state_manager.py` extracted as reusable cross-skill utility.
- **New test cases** — `skills/skill/cases/sdd/` and `skills/skill/cases/skill/` covering apply, archive, contradiction, contradiction-deps, human-friendly output, namespace recommendations, and more.
- **OpenSpec changes archived** — 20+ completed changes moved to `openspec/changes/archive/`.

### Changed

- **SDD skills updated** — `sdd:apply`, `sdd:archive`, `sdd:contradiction`, `sdd:explore`, `sdd:propose` updated to use declarative state transitions via `state_manager.py`.
- **`sdd:audit` skill** — updated to reflect new state hook architecture.
- **bump-version skills** — `dev:`, `sdd:`, `report:`, `research:` bump-version updated with namespaces-aware logic.
- **`skills/skill/setup`** — updated manifest handling after namespaces section added.

### Removed

- **`/sdd:help`** — removed in prior commit (0.7.0 branch); namespace listing replaced by `recommend-skills` rule.

## [0.6.0] - 2026-05-02

### BREAKING

- **Skills hierarchy**: flat `skills/<ns>/SKILL.md` → nested `skills/<ns>/<skill>/skill.md`. All skill paths changed.
- **`install.sh` removed** — replaced by Claude-driven init mode (Claude reads README and detects context).
- **`skills/ui/`** removed — UI skill retired.
- **`/sdd:change-verify`** removed — verify logic inlined into `/sdd:apply` (L1/L2/L3 step).
- **`/sdd:spec-verify`** removed — spec-verify logic inlined into `/sdd:archive`.
- **`commands/` namespace conflict fix** — flat `commands/sdd.md` / `commands/dev.md` / `commands/research.md` / `commands/skill.md` removed; replaced by `commands/<ns>/help.md` (→ `/<ns>:help`).

### Added

- **install-modes**: two operating modes for awesome-claude:
  - *User mode* — Claude reads `README.md` at session start, detects context, and operates without setup.
  - *Dev mode* — contributor runs `skill:setup` to create `ln -sfn $(pwd)/skills .claude/skills`, edits take effect immediately.
- **`skill:` namespace** — contributor toolchain (4 new skills):
  - `skill:setup` — create dev-mode symlink with idempotency and real-dir guard.
  - `skill:deps` — validate `manifest.yaml`, install declared tools, sync repos; read-only guarantee.
  - `skill:onboarding` — read symlink + active changes state, print full 9-step workflow, highlight next action.
  - `skill:release` — check clean tree, bump version in `manifest.yaml`, commit + tag.
- **`manifest.yaml`** at repo root — canonical version store: `version`, `tools` (openspec etc.), `repos`.
- **`sdd:` namespace** — full spec-driven development workflow (9 skills):
  - `sdd:propose` (step 4), `sdd:contradiction` (step 5), `sdd:apply` (step 6), `sdd:archive` (step 7) — core pipeline.
  - `sdd:sync` (step 2), `sdd:repo` (step 3), `sdd:audit`, `sdd:explore` — supporting tools.
- **SDD state machine** — 11-stage lifecycle (`proposed → contradiction-ok → applying → verifying → verify-ok → archiving → archived`); managed by `skills/sdd/scripts/state.py` via `.sdd-state.yaml` (gitignored).
- **Identity resolution** — `skills/sdd/scripts/identity.py`: resolves owner email from `claude auth status` with `git config user.email` fallback.
- **Eval framework** in `skill:test-skill` — k=5 bootstrap, ≥4/5 pass threshold, real-time progress `[case] N/5 ✓`, LLM-judge for semantic assertions, `RESULTS_FILE` output in `test-results/`.
- **Test stubs** — `skills/skill/test-skill/stubs/with-change.md` for harness testing with active change + manifest.
- **Namespace listing commands** — `/dev:help`, `/research:help`, `/skill:help` (list all skills in namespace).
- **7-block structured apply output** + Python report scripts for sdd:apply.
- **OpenSpec changes pipeline** — `openspec/changes/` with proposed follow-up work:
  - `unified-test-flow` — architecture for behavioral vs acceptance test distinction.
  - `sdd-propose-fallback` — fallback flow when `openspec-propose` skill unavailable.
  - `dev-skill-input-guards`, `sdd-apply-tdd-cycle`, `skill-local-stubs`, `skill-test-dynamic-execution`, `skill-test-runner-script` — staged proposed changes.
- **`test-results/`** directory for eval output (`.gitkeep`).
- **`__pycache__/`** added to `.gitignore`.

### Changed

- **README.md** — rewritten with three sections: `## Init` (Claude mode detection instructions), `## Quick Start` (user mode, no curl|bash), `## Contributing` (dev mode: skill:setup → skill:deps → sdd workflow).
- **`/sdd:apply`** — identity check, state transitions (`applying → verifying → verify-ok|verify-failed`), inline L1/L2/L3 verification; updates `openspec/specs/index.yaml` only on `verify-ok`.
- **`/sdd:archive`** — identity check, state transitions (`archiving → archived|archive-failed`), inline L1/L2/L3 spec-verify with REMOVED-inversion; deletes `.sdd-state.yaml` on success; red-banner on verify-fail.
- **`/sdd:propose`** — initializes `.sdd-state.yaml` (`stage=proposed`), sets `owner:` in `.sdd.yaml`, runs merge-dialog when `creates:` intersects existing capabilities.
- **`/sdd:contradiction`** — identity check at start, transitions state to `contradiction-ok|contradiction-failed`.
- **`openspec/specs/index.yaml`** — 41 capabilities (was 31): added dev-mode, install-modes, dev-setup-skill, manifest, deps-skill, contributor-workflow, claude-init-mode, sdd-test-coverage, skill-eval-framework, skill-release.

## sdd 0.7.0 (release-0.6.0 branch)

### BREAKING

- Removed `/sdd:change-verify` skill and command — verify logic inlined into `/sdd:apply` as mandatory L1/L2/L3 step against `tasks.md`.
- Removed `/sdd:spec-verify` skill and command — spec-verify logic (including REMOVED-inversion) inlined into `/sdd:archive` as mandatory step after merge specs.

### Added

- `skills/sdd/scripts/state.py` — read/update/transition/delete `.sdd-state.yaml` with at-first-touch creation and 11-stage state machine.
- `skills/sdd/scripts/identity.py` — resolve email via `claude auth status` with `git config user.email` fallback.
- `skills/sdd/scripts/_sdd_yaml.py` extended with CLI commands `read`, `move-capability`, `set-owner` for safe `.sdd.yaml` mutation.
- `.sdd-state.yaml` lifecycle: created at-first-touch by any sdd skill, gitignored via `**/.sdd-state.yaml`, deleted only on successful archive (last step).
- `owner:` field in `.sdd.yaml` — single email, identity from `claude auth status` (primary) or `git config user.email` (fallback).
- `/sdd:propose` merge-dialog: when `creates:` intersects with existing capability in `openspec/specs/index.yaml`, asks user via AskUserQuestion to switch to `merges-into:`.
- `/sdd:archive` red-banner: on verify-fail after merge specs, emits exact red-banner with manual rollback instruction; no automatic rollback.
- 60+ semantic test case files generated at `skills/skill/cases/sdd/<cap>/` for new capabilities.
- 6 new test stubs (change-other-owner, change-verifying-state, change-verify-failed, change-with-removed-req-no-file, change-with-removed-req-file-present, creates-collision) and 19 new case scenarios across apply/archive/propose/contradiction/help.
- 4 cross-spec deltas (sdd-change-verify-cases REMOVED, sdd-remaining-cases MODIFIED, sdd-apply-cases ADDED, sdd-archive-cases ADDED) to migrate downstream specs.

### Changed

- `/sdd:apply` — now performs identity check, state transitions (`applying → verifying → verify-ok|verify-failed`), inline L1/L2/L3 verify; only updates `openspec/specs/index.yaml` on `verify-ok`.
- `/sdd:archive` — now performs identity check, state transitions (`archiving → archived|archive-failed`), inline L1/L2/L3 spec-verify with REMOVED-inversion; deletes `.sdd-state.yaml` on success.
- `/sdd:propose` — initializes `.sdd-state.yaml` (`stage=proposed`), sets `owner:` in `.sdd.yaml`, runs merge-dialog.
- `/sdd:contradiction` — performs identity check at start, transitions state to `contradiction-ok|contradiction-failed` at end.
- `bump-namespace.sh` — accepts optional `<ref>` second argument (tag or branch); falls back to latest tag if omitted.
- `docs/README_DETAILED.md` — mermaid diagram and command table updated to reflect merged verify.

## [0.2.0] - 2026-03-25

### Added

- **Skill: `/triz`** -- TRIZ problem-solving engineer applying ARIZ-85V algorithm: contradiction analysis, Ideal Final Result, 40 inventive principles, vepole analysis, resource mobilization, structured resolution. Full 9-step workflow with RVS operator and invention level assessment.
- **Skill: `/pipe`** -- Meta-skill orchestrator that chains arbitrary skills into a sequential pipeline. Each phase runs in a dedicated Agent with full prompt weight. Supports any combination: `triz,ui`, `tracing,tdd`, `triz,tdd,ui`.
- **Rule: `VISUAL_COHESION.md`** -- UI areas operating on the same aggregate with the same domain operation must use one layout pattern, one CSS class, one alignment axis. Includes cohesion/coupling checklists and concrete CSS examples.
- FAQ section in README with 6 common questions
- Mermaid diagram showing how `.claude/` loads into Claude Code
- ASCII philosophy block with 7 core principles
- Detailed `/pipe` usage examples with visual flow

### Changed

- **README.md** -- Complete rewrite: new structure with value proposition lead, detailed skill/agent documentation, collapsible rule categories, customization guide, FAQ
- **Skills badge** updated from 8 to 10
- **`skills/ui/SKILL.md`** -- Added Visual Cohesion & Coupling section (domain-driven layout rules), Quality over Speed section, two new anti-patterns (CSS-override instead of unified JSX, invisible refactoring before visible UX fixes)
- **`rules/frontend-design.md`** -- Added Visual Cohesion cross-reference to `arch/VISUAL_COHESION.md`
- **`rules/arch/README.md`** -- Added `VISUAL_COHESION.md` to index

### Fixed

- Removed project-specific `currentDate` injection from `rules/frontend-design.md` (was leaking session context into universal rules)

## [0.1.0] - 2026-03-25

### Added

Initial release with 79 files:

**Rules (60+ files)**
- Architecture & DDD: aggregates, commands, events, queries, domain purity, shared kernel, state ownership, services, views
- Database design: migrations, indexes, constraints, normal forms, transactions, versioning, read/write models, performance, retention, security, seeds
- 12-Factor App: all 12 factors (codebase, dependencies, config, backing services, build-release-run, processes, port binding, concurrency, disposability, dev-prod parity, admin processes) + Makefile conventions
- Code quality & refactoring: change breakers, inflators, trashers, dependency management, OOP design, conditions, data structures, functions, generalizations, methods, simplification
- Workflow: break-stop rule (hard stop on test failure), git commit conventions, meta-rules, frontend testing (Vitest + RTL + Playwright), frontend design (icons-first, accessibility), monorepo structure, UI component library (4-layer architecture), LLM security, unit test philosophy, structured logging, monitoring, architecture tests

**Skills (8 slash commands)**
- `/tdd` -- Full TDD cycle with PlantUML diagrams, multi-layer test coverage
- `/commit` -- Structured git commits with What/Why/Details
- `/tracing` -- Bug tracing across all layers with sequence diagrams
- `/ui` -- UI/UX engineering with TDD-first approach
- `/test-all` -- Complete test suite runner with statistics
- `/session-report` -- Product-focused change summary
- `/deploy` -- Docker rebuild + migrations
- `/describe` -- Quick project overview

**Agents (3 sub-agents)**
- Planner -- requirement analysis and implementation planning
- Code Review Sentinel -- code review with test quality focus
- UI/UX Engineer -- frontend development with TDD

**Infrastructure**
- MIT License
- `.gitignore` for plans, worktrees, agent-memory, local settings

[0.6.0]: https://github.com/Hedgehogues/awesome-claude/compare/v0.2.0...v0.6.0
[0.2.0]: https://github.com/Hedgehogues/awesome-claude/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Hedgehogues/awesome-claude/releases/tag/v0.1.0
