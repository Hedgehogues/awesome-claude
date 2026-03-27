---
paths:
  - "Makefile"
  - "**/Makefile"
  - "docker-compose.yml"
---

# Makefile Conventions

## Structure

Three-level Makefile hierarchy:

| File | Responsibility |
|------|---------------|
| `Makefile` (root) | Orchestration, Docker, combined targets. Delegates via `$(MAKE) -C <package>` |
| `<package>/Makefile` | Package-only: install, migrate, run, test, lint |

## Key Root Targets

| Target | What it does |
|--------|-------------|
| `make up` | Start ALL services via Docker Compose |
| `make dev` | Dev mode: database + migrations + backend |
| `make test` | ALL tests across all packages |
| `make check` | Full CI check: `lint` + `test` |
| `make lint` | All linters across all packages |
| `make install` | Install all dependencies |

## Delegation Pattern

Root Makefile uses wildcard delegation:
- `make <package>-<target>` → runs `make <target>` inside `<package>/`
- Example: `make backend-test` → `$(MAKE) -C backend test`

## Rules

- `make test` MUST run every type of test. If a new test suite is added, it MUST be included.
- `make check` is the single "is everything OK?" command. This is what CI should call.
- Sub-targets exist for convenience during development.
- E2E tests require services to be running (via `make up` or manually).
- **Never put `cd <package> &&` in root Makefile** — use `$(MAKE) -C <package>` instead.

## Adding New Targets

- Package-only target → add to `<package>/Makefile`, automatically available as `make <package>-<name>` from root
- Cross-cutting target → add to root `Makefile`, delegate to sub-Makefiles

## Ports

Define port mappings in `docker-compose.yml`. Document them in `.env.example`.
Do not hardcode port numbers in Makefiles — use environment variables or docker-compose defaults.
