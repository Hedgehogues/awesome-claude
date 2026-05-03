# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.7.0] - 2026-05-04

### BREAKING

- **`/sdd:help` removed** — namespace listing is now handled by the `recommend-skills` rule. Skills listing is no longer a skill invocation.
- **`openspec` CLI now required explicitly** — all core SDD skills (`sdd:propose`, `sdd:apply`, `sdd:archive`, `sdd:contradiction`) perform a preflight check (`which openspec`) at step 0 and stop with an install hint if not found. Previously, skills attempted auto-installation from `.openspec-version`. If you rely on auto-install, run `npm install -g @openspec/cli` manually before using SDD skills.
- **`sdd:propose` and `sdd:archive` no longer delegate to `opsx` skills** — they call `openspec new change` and `openspec archive` directly via Bash. The `opsx:` dependency at runtime is removed for these two skills.

### Added

**SDD state automation via `PostToolUse` hook:**

- **`skills/sdd/scripts/state_hook.py`** — new `PostToolUse` hook. Fires after every `Skill` tool use, reads `pending_transitions` from the freshest `.sdd-state.yaml`, applies each stage via `state.py transition` in order, then clears the field. If the final stage is in `FINAL_STAGES` (currently `archived`), the hook deletes `.sdd-state.yaml`. The hook is fully decoupled — it knows no skill names, only reads the state file.
- **`skills/scripts/state_manager.py`** — declarative state router. Takes `--ns`, `--skill`, `--step`, `--state-file`. Reads `skills/<ns>/<skill>/state.yaml`, validates the requested step against `current_stage` (last entry in `pending_transitions`, or `stage` field if empty), then appends `sets_stage` to `pending_transitions` via accumulation. Skills call this instead of `state.py transition` directly.
- **Per-skill `state.yaml`** — declarative transition tables for each SDD skill:
  - `sdd/apply/state.yaml`: steps `start → applying`, `verify-start → verifying`, `verify-passed → verify-ok`, `verify-failed → verify-failed`; allowed_from guards prevent out-of-order transitions.
  - `sdd/archive/state.yaml`: steps `start → archiving`, `archived → archived`, `archive-failed → archive-failed`.
  - `sdd/contradiction/state.yaml`: steps `ok → contradiction-ok`, `failed → contradiction-failed`.
  - `sdd/propose/state.yaml`: step `proposed → proposed` (initialisation).
- **`skills/sdd/state.yaml`** — top-level namespace state declaration.
- **`manifest.yaml` namespaces section** — canonical namespace registry (`dev`, `sdd`, `report`, `research`, `skill`, `opsx`) with `public` flag and skill lists. Used by `recommend-skills.md` and bump-version skills to discover which skills belong to which namespace.
- **`sre:` namespace** — new `skills/sre/incident-mr/` skill for GitLab incident MR workflow (creates MR from incident template, fills description, assigns reviewers).
- **`dev:install` skill** — `skills/dev/install/` automates the awesome-claude installation flow.
- **`skills/scripts/` shared directory** — `state_manager.py` is now a cross-skill shared utility, separate from the `sdd`-specific `skills/sdd/scripts/`.
- **New test cases (10+)**:
  - `skills/skill/cases/sdd/`: `apply-merges-into-context`, `archive-merges-into-support`, `contradiction-deps-validation`, `contradiction-draft-specs`, `contradiction-index-awareness`, `human-friendly-features-section`, `human-friendly-skill-output`, `namespace-skill-recommendations`, `scripts-access-via-mcp`, `sdd-openspec-cli-guard`, `sdd-state-archived-in-sdd`, `sdd-state-skill-hooks`, `skill-run-log-archiving`.
  - `skills/skill/cases/skill/`: `bump-version`, `post-release`.
  - `skills/sdd/scripts/cases/state_hook.md` — test case for `state_hook.py`.
  - `skills/skill/test-skill/stubs/with-hooks-config.md` — stub for harness testing with `PostToolUse` hook active.
- **OpenSpec changes archived (20+)** — completed changes moved to `openspec/changes/archive/`: `sdd-openspec-cli-guard`, `skill-run-logs`, `human-friendly-features-section`, `install-modes`, `recommend-namespace-usage`, `rules-index`, `sdd-declared-deps`, `sdd-implicit-change-selection`, `sdd-merges-into-gaps`, `sdd-skill-logs-to-repo-root`, `sdd-state-manager`, `sdd-state-merge-on-archive`, `sdd-state-skill-hooks`, `skill-output-replay`, `structured-apply-output`, and others.
- **30+ new OpenSpec specs** in `openspec/specs/`: `apply-merges-into-context`, `archive-merges-into-support`, `contradiction-deps-validation`, `contradiction-draft-specs`, `contradiction-index-awareness`, `human-friendly-features-section`, `human-friendly-skill-output`, `namespace-skill-recommendations`, `sdd-implicit-change-selection`, `sdd-state-archived-in-sdd`, `sdd-state-declarations`, `sdd-state-manager`, `skill-run-log-archiving`, `write-then-replay-output`, `claude-way-agent-guard`, and others.
- **`docs/SKILL_DESIGN.md`** — new section documenting the `PostToolUse` hook pattern and `state_manager.py` accumulation model with code examples.

### Changed

**SDD core skills:**

- **`sdd:apply`** — added step 0 openspec preflight. Added "Determine Change" logic: Режим A (context obvious — ask to confirm) and Режим B (context ambiguous — scan `openspec/changes/`, rank by branch name match + git status + non-archived, show list via `AskUserQuestion`). Added step 3a: loads `merges-into` specs as read-only context before implementation. State transitions now use `state_manager.py` accumulation instead of direct `state.py transition` calls.
- **`sdd:archive`** — added step 0 openspec preflight. Replaced `opsx:openspec-archive-change` Skill invocation with direct `openspec archive "<name>" -y` Bash call. State transitions now write `pending_transitions` field; `PostToolUse` hook applies them. Hook deletes `.sdd-state.yaml` on `archived` stage automatically.
- **`sdd:contradiction`** — added step 0 openspec preflight. Added "Determine Change" logic (same Режим A/B as apply). Added `SCOPE CONSTRAINT` section: all edits are confined to `openspec/changes/<name>/`; MUST NOT touch `skills/`, `.claude/`, `openspec/specs/`. Updated `contradiction.py` output format: capabilities now labelled `[PRIMARY/merges-into]`, `[PRIMARY/creates]`, `[PRIMARY/creates DRAFT]`, or unlabelled background; added `--- ADJACENT Capabilities ---` section for thematically related capabilities outside the declared scope (informational only, not included in analysis). Summary fields extended: `draft_specs_loaded`, `primary_capabilities`, `merges_into_missing`, `adjacent_capabilities`. Log now written to `.logs/<name>/contradiction-<TS>.md`.
- **`sdd:propose`** — added step 0 openspec preflight. Replaced `opsx:openspec-propose` Skill invocation with direct `openspec new change "<name>"` Bash call. Added `title` hint when `creates:` entries lack a `title` field. State initialisation uses `state_manager.py`.
- **`sdd:explore`** — minor update.
- **`sdd:audit`** — updated to reflect new state hook architecture; verifies `state_hook.py` and per-skill `state.yaml` files.
- **`sdd/scripts/_sdd_yaml.py`** — extended to read `merges-into` field and support `title` in `creates` entries.
- **`sdd/scripts/apply_report.py`** and **`archive_report.py`** — updated for new `.sdd.yaml` schema.

**Infrastructure:**

- **bump-version skills** (`dev:`, `sdd:`, `report:`, `research:`) — updated with namespaces-aware logic reading `manifest.yaml` namespaces section.
- **`skills/skill/setup/skill.md`** — updated manifest handling after namespaces section added.
- **`openspec/specs/contradiction-full-scan/spec.md`** — extended with PRIMARY/ADJACENT capability classification.
- **`openspec/specs/index.yaml`** — 21 new capability entries added.
- **`README.md`** — added note: SDD workflow tracks state automatically via `PostToolUse` hook; no manual `state.py transition` calls needed.

### Removed

- **`/sdd:help`** (`commands/sdd/help.md`, `skills/sdd/help/skill.md`, `skills/sdd/help/cases/help.md`) — pipeline step listing is now handled by `recommend-skills` rule and `manifest.yaml` namespaces section.

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
