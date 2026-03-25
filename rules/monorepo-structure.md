# Monorepo Structure Rule

## Root Level

The repository root MUST contain shared infrastructure:
- `docker-compose.yml` — orchestration of all services
- `Makefile` — top-level commands delegating to sub-packages
- `.env.example` — environment variable template
- `.claude/` — Claude Code configuration and rules
- `CLAUDE.md` — project-level instructions

## Packages Directory

All projects live inside `packages/`, each as an independent unit:

```
packages/
├── back/          # Backend service (own Makefile, pyproject.toml, tests/)
├── collector/     # CLI agent (own Makefile, pyproject.toml, tests/)
└── front/         # Frontend SPA (own Makefile, package.json, e2e/)
```

## Rules

1. **Each package is self-contained**: own build tool config, own `Makefile`, own test suite
2. **Root Makefile delegates**: `make check` runs `make -C packages/<pkg> check` for each package
3. **Root Makefile includes all test scopes**:
   - `make test` — backend + collector unit tests
   - `make test-front` — frontend unit tests
   - `make test-all` — all unit tests across all packages
   - `make e2e` — Playwright E2E tests (requires running Docker)
4. **Shared infra stays at root**: docker-compose, CI config, pre-commit hooks
5. **No cross-package imports**: packages communicate only via API contracts
6. **New packages** follow the same pattern: `packages/<name>/` with Makefile, config, tests
