# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
- `/sdd:help` — pipeline shrunk from 10 to 8 numbered steps; workflow_step indices updated (apply=6, archive=7, audit=[8]).
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

[0.2.0]: https://github.com/Hedgehogues/awesome-claude/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Hedgehogues/awesome-claude/releases/tag/v0.1.0
