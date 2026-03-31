---
paths:
  - "Makefile"
  - "**/Makefile"
  - "docker-compose.yml"
---

# Makefile Conventions

## Two-Level Hierarchy

| Level | File | Responsibility |
|-------|------|---------------|
| Root | `Makefile` | Orchestration only. Delegates to packages, owns Docker and infra targets |
| Package | `packages/<pkg>/Makefile` | Self-contained: lint, test, build, format, package-specific targets |

Root Makefile **never contains build/test/lint logic directly** — it only calls sub-Makefiles.

## Delegation Pattern

Root delegates via `$(MAKE) -C packages/<pkg> <target>`:

```makefile
check:
	$(MAKE) -C packages/back check
	$(MAKE) -C packages/front check
```

- **Never use `cd packages/<pkg> &&`** — `$(MAKE) -C` correctly propagates exit codes
- Packages run **sequentially** (no `-j`): predictable output, simpler debugging
- Each delegation line is independent — a failure stops the chain immediately

## Required Targets

Every package MUST expose these targets:

| Target | Contract |
|--------|----------|
| `check` | **Single "is everything OK?" command.** Runs all quality gates: lint + types + tests. CI calls only this |
| `lint` | Static analysis: linter + formatter check + type checker |
| `test` | All automated tests relevant to the package |

Optional but common:

| Target | When needed |
|--------|-------------|
| `format` | Auto-fix formatting (vs `lint` which only checks) |
| `build` | Compilation or bundle step (frontend, compiled languages) |
| `migrate` | Database migrations |

## Root-Only Targets

These targets live exclusively in the root Makefile:

| Category | Targets |
|----------|---------|
| Docker | `up`, `down` — manage `docker-compose.yml` |
| Cross-cutting | `check`, `lint`, `test` — fan out to all packages |
| Infra | Cluster management, vault init, deploy — delegate to infra package |
| Selective scope | `test-front`, `test-all`, `e2e` — convenience aliases for specific scopes |

## Rules

1. **`make check` is the CI contract.** If a new quality gate is added (new test type, new linter), it MUST be reachable from `make check`
2. **`make test` ≠ all tests.** `test` runs fast feedback tests (backend). Heavier suites (frontend, e2e, integration) have separate targets. `test-all` combines everything
3. **E2E tests require running services.** They are never part of `check` — run after `make up`
4. **Package runner is configurable.** Python packages use `RUNNER ?= uv run` so the runner can be overridden without editing the Makefile
5. **Ports and URLs live in `docker-compose.yml` and `.env`**, never hardcoded in Makefiles

## Adding a New Package

1. Create `packages/<name>/Makefile` with at least `check`, `lint`, `test`
2. Add `$(MAKE) -C packages/<name> check` to root `check` target
3. Add to root `lint` and `test` if applicable
4. Update `.PHONY` in root Makefile
