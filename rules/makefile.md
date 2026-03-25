---
paths:
  - "Makefile"
  - "backend/Makefile"
  - "frontend/Makefile"
  - "docker-compose.yml"
---

# Makefile Conventions

## Structure

Three-level Makefile hierarchy:

| File | Responsibility |
|------|---------------|
| `Makefile` (root) | Orchestration, Docker, combined targets. Delegates via `$(MAKE) -C backend` / `$(MAKE) -C frontend` |
| `backend/Makefile` | Backend-only: install, migrate, run, test, lint |
| `frontend/Makefile` | Frontend-only: install, run, build, test, e2e, lint |

## Key Root Targets

| Target | What it does |
|--------|-------------|
| `make up` | Start ALL services via Docker Compose |
| `make dev` | Dev mode: db + migrations + backend (port 8002) |
| `make test` | ALL tests: backend (pytest) + frontend unit (vitest) + frontend E2E (playwright) |
| `make check` | Full CI check: `lint` + `test` |
| `make lint` | All linters: backend (ruff) + frontend (eslint) |
| `make install` | Install all dependencies (backend + frontend) |

## Delegation Pattern

Root Makefile uses wildcard delegation:
- `make backend-<target>` → runs `make <target>` inside `backend/`
- `make frontend-<target>` → runs `make <target>` inside `frontend/`
- Example: `make backend-test` → `$(MAKE) -C backend test`

## Rules

- `make test` MUST run every type of test. If a new test suite is added, it MUST be included.
- `make check` is the single "is everything OK?" command. This is what CI should call.
- Sub-targets (`backend-test`, `frontend-test`) exist for convenience during development.
- E2E tests require the frontend to be running on `:3001` (via `make up` or manually).
- **Never put `cd backend &&` in root Makefile** — use `$(MAKE) -C backend` instead.

## Adding New Targets

- Backend-only target → add to `backend/Makefile`, automatically available as `make backend-<name>` from root
- Frontend-only target → add to `frontend/Makefile`, automatically available as `make frontend-<name>` from root
- Cross-cutting target → add to root `Makefile`, delegate to sub-Makefiles

## Ports

| Service | Docker (`make up`) | Local (`make dev`) |
|---------|-------------------|-------------------|
| PostgreSQL | 5434 | 5434 |
| Backend | 8001 | 8002 |
| Frontend | 3001 | 5173 |
