---
name: init-repo
description: >
  Initialize a DDD monorepo with backend (FastAPI, SQLAlchemy, multi-BC architecture)
  and frontend (React 19, Vite, TypeScript) packages. Scaffolds full project structure:
  root orchestration (Makefile, docker-compose), backend with one bounded context
  (domain entity, repository, use case, infra repo, routes, schemas), frontend with
  API client, router, UI kit seed, and test infrastructure for both (pytest 6-type
  strategy, vitest, architecture tests). Ready to `make check` after generation.
argument-hint: "<project-name> [bc-name] — e.g. 'acme-crm leads' or 'ticket-hub'"
model: sonnet
allowed-tools: Bash(mkdir *), Bash(ls *), Write, Read, Glob, Grep
---

# Задача

> Принципы архитектуры: [DESIGN.md](DESIGN.md)

Инициализируй DDD-монорепу. $ARGUMENTS

- `$0` — имя проекта (kebab-case). Если не задано — спроси.
- `$1` — имя первого bounded context (snake_case). Если не задано — используй `core`.

## Контекст (предвычислено)

!`pwd`
!`ls -la 2>/dev/null`

## Подстановки

| Placeholder | Источник | Пример |
|---|---|---|
| `<project-name>` | `$0` kebab-case | `acme-crm` |
| `<project_name>` | `$0` snake_case | `acme_crm` |
| `<ProjectName>` | `$0` PascalCase | `AcmeCrm` |
| `<bc_name>` | `$1` или `core` | `leads` |
| `<aggregate>` | `<bc_name>` singular | `lead` |
| `<Aggregate>` | PascalCase singular | `Lead` |
| `<aggregates>` | plural | `leads` |

## 1. Root

### Makefile — delegation-only

Targets: `check`, `lint`, `test`, `test-all`, `up`, `down`, `migrate`, `revision`.
Pattern: `$(MAKE) -C packages/<pkg> <target>`.

### docker-compose.yml

- `postgres` — PostgreSQL 16, volume `pgdata`, port 5432
- `back` — build `packages/back`, port 8000, depends_on postgres
- `front` — build `packages/front`, port 3000

### .env.example

```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/<project_name>
OPENAI_API_KEY=test-key
ENVIRONMENT=local
CORS_ORIGINS=["http://localhost:3000"]
```

### CLAUDE.md — описание проекта, tech stack, команды. Адаптируй под имя.

## 2. Backend (`packages/back/`)

### Структура

```
packages/back/
├── Makefile
├── pyproject.toml
├── alembic.ini
├── migrations/env.py + versions/
├── src/
│   ├── __init__.py
│   ├── main.py              # FastAPI app + lifespan + structlog + CORS
│   ├── config.py            # Settings(BaseSettings) + engine + async_session
│   ├── dependencies.py      # Composition root — единственный файл с infra-импортами
│   ├── models.py            # Model registry: import Base + models → combined_metadata
│   ├── router.py            # APIRouter(prefix="/api"), include_router из каждого BC
│   └── <bc_name>/
│       ├── __init__.py
│       ├── domain/
│       │   ├── __init__.py
│       │   ├── <aggregate>/
│       │   │   ├── __init__.py
│       │   │   ├── entity.py
│       │   │   └── repository.py
│       │   └── exceptions.py
│       ├── application/
│       │   ├── __init__.py
│       │   ├── create_<aggregate>.py
│       │   ├── get_<aggregate>.py
│       │   └── list_<aggregates>.py
│       ├── infrastructure/
│       │   ├── __init__.py
│       │   └── persistence/
│       │       ├── __init__.py
│       │       ├── base.py
│       │       ├── models.py
│       │       └── <aggregate>_repo.py
│       └── presentation/
│           ├── __init__.py
│           └── api/
│               ├── __init__.py
│               ├── routes.py
│               └── schemas.py
└── tests/
    ├── conftest.py           # .env.test load + shared fixtures + mock repos
    ├── .env.test
    ├── unit/<bc_name>/
    │   ├── __init__.py
    │   ├── test_entity.py
    │   └── test_use_cases.py
    └── architecture/
        ├── __init__.py
        ├── conftest.py
        └── test_layer_boundaries.py
```

### pyproject.toml

```toml
[project]
name = "<project-name>-back"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.34.0",
    "sqlalchemy[asyncio]>=2.0.36",
    "asyncpg>=0.30.0",
    "alembic>=1.14.0",
    "httpx>=0.28.0",
    "pydantic-settings>=2.7.0",
    "structlog>=24.4.0",
]

[dependency-groups]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "ruff>=0.8.0",
    "mypy>=1.13.0",
    "black>=24.0.0",
]

[tool.ruff]
target-version = "py312"
line-length = 120

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "B", "A", "SIM"]

[tool.ruff.lint.isort]
known-first-party = ["src"]

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[tool.black]
line-length = 120
target-version = ["py312"]

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
markers = [
    "unit: Unit tests",
    "architecture: DDD architecture validation tests",
    "state: State matrix tests",
    "security: Security tests",
    "cases: Business scenario tests",
    "integration: Integration tests",
]

[tool.coverage.run]
source = ["src"]
omit = ["src/main.py"]

[tool.coverage.report]
show_missing = true
fail_under = 0
```

### Makefile (back)

```makefile
.PHONY: lint test test-unit architecture-check test-cov check migrate revision format

RUNNER ?= uv run

lint:
	$(RUNNER) ruff check --fix .
	$(RUNNER) black --check .
	$(RUNNER) mypy src/ tests/

format:
	$(RUNNER) ruff check --fix .
	$(RUNNER) black .

test-unit:
	$(RUNNER) pytest tests/unit -v

architecture-check:
	$(RUNNER) pytest tests/architecture -v

test-cov:
	$(RUNNER) pytest tests/unit tests/architecture -v --cov --cov-report=term-missing

test: test-unit architecture-check

check: lint test test-cov
	@echo "All checks passed!"

migrate:
	$(RUNNER) alembic upgrade head

revision:
	$(RUNNER) alembic revision --autogenerate -m "$(msg)"
```

### Код: DDD-слои

#### entity.py

```python
@dataclass
class <Aggregate>:
    <aggregate>_id: uuid.UUID
    name: str
    version: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def create(cls, *, name: str) -> <Aggregate>:
        now = datetime.now(UTC)
        return cls(<aggregate>_id=uuid.uuid4(), name=name, version=1, created_at=now, updated_at=now)
```

#### repository.py

```python
class <Aggregate>Repository(ABC):
    @abstractmethod
    async def save(self, entity: <Aggregate>) -> None: ...
    @abstractmethod
    async def update(self, entity: <Aggregate>) -> None: ...
    @abstractmethod
    async def get_by_id(self, <aggregate>_id: uuid.UUID) -> <Aggregate> | None: ...
    @abstractmethod
    async def get_all(self) -> list[<Aggregate>]: ...
```

#### create_\<aggregate\>.py

```python
class Create<Aggregate>UseCase:
    def __init__(self, <aggregate>_repo: <Aggregate>Repository) -> None:
        self._<aggregate>_repo = <aggregate>_repo

    async def execute(self, *, name: str) -> <Aggregate>:
        entity = <Aggregate>.create(name=name)
        await self._<aggregate>_repo.save(entity)
        return entity
```

#### persistence/models.py

```python
class <Aggregate>Model(Base):
    __tablename__ = "<aggregates>"
    <aggregate>_id: Mapped[uuid.UUID] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    version: Mapped[int] = mapped_column(default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
```

#### \<aggregate\>_repo.py

```python
class SqlAlchemy<Aggregate>Repository(<Aggregate>Repository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save(self, entity: <Aggregate>) -> None:
        model = <Aggregate>Model(
            <aggregate>_id=entity.<aggregate>_id, name=entity.name,
            version=entity.version, created_at=entity.created_at, updated_at=entity.updated_at,
        )
        self._session.add(model)
        await self._session.flush()

    async def get_by_id(self, <aggregate>_id: uuid.UUID) -> <Aggregate> | None:
        result = await self._session.execute(
            select(<Aggregate>Model).where(<Aggregate>Model.<aggregate>_id == <aggregate>_id)
        )
        row = result.scalar_one_or_none()
        if row is None:
            return None
        return <Aggregate>(
            <aggregate>_id=row.<aggregate>_id, name=row.name,
            version=row.version, created_at=row.created_at, updated_at=row.updated_at,
        )
```

#### routes.py

```python
router = APIRouter(prefix="/<aggregates>", tags=["<Aggregates>"])

@router.post("")
async def create_<aggregate>(request: Create<Aggregate>Request) -> <Aggregate>Response:
    async with async_session() as db, db.begin():
        repo = SqlAlchemy<Aggregate>Repository(db)
        uc = Create<Aggregate>UseCase(<aggregate>_repo=repo)
        entity = await uc.execute(name=request.name)
    return _to_response(entity)
```

### Тесты (back)

#### tests/architecture/ — DDD structural validation

`conftest.py`: AST-helpers — `parse_imports()`, `parse_classes()`, `discover_aggregates()` (glob `*/entity.py`), `discover_domain_files()`, `discover_layer_files()`. Dataclasses: `ImportInfo`, `AggregateInfo`.

`test_layer_boundaries.py` — parametrize по файлам каждого слоя:
- Domain NOT imports application, infrastructure, presentation
- Application NOT imports presentation
- Presentation NOT imports infrastructure (use `src.dependencies`)
- Domain/Application NOT imports sqlalchemy, fastapi, httpx, openai

#### tests/unit/\<bc\>/test_entity.py

```python
pytestmark = pytest.mark.unit

def test_create_<aggregate>():
    """<Aggregate>.create produces entity with correct initial state."""
    entity = <Aggregate>.create(name="test")
    assert isinstance(entity.<aggregate>_id, uuid.UUID)
    assert entity.name == "test"
    assert entity.version == 1
```

#### tests/unit/\<bc\>/test_use_cases.py

```python
pytestmark = [pytest.mark.unit, pytest.mark.asyncio]

async def test_create_<aggregate>_flow():
    """Create<Aggregate> persists new entity via repository."""
    repo = AsyncMock()
    repo.save.return_value = None
    uc = Create<Aggregate>UseCase(<aggregate>_repo=repo)
    result = await uc.execute(name="test")
    assert result.name == "test"
    repo.save.assert_awaited_once()
```

## 3. Frontend (`packages/front/`)

### Структура

```
packages/front/
├── Makefile                 # install, lint (eslint + tsc), test, build, check, dev
├── package.json             # React 19, Router v7, Vite, Vitest, Testing Library, TS strict
├── vite.config.ts           # react plugin + vitest (jsdom, globals, setup)
├── tsconfig.json            # references → app + node
├── tsconfig.app.json        # ES2022, strict, react-jsx, vitest/globals
├── tsconfig.node.json
├── eslint.config.js         # flat config: js + tseslint + react-hooks + react-refresh
├── index.html               # <div id="root">, Google Fonts Inter
├── Dockerfile               # multi-stage: npm build → nginx
├── nginx.conf               # SPA fallback, /api proxy
└── src/
    ├── main.tsx             # StrictMode + createRoot
    ├── App.tsx              # BrowserRouter + Routes + AppLayout
    ├── index.css
    ├── api/client.ts        # BASE_URL from VITE_API_URL, ApiError, fetchJson/postJson/patchJson/putJson/deleteJson
    ├── types/api.ts         # API response types
    ├── components/
    │   ├── ui/
    │   │   ├── Button/Button.tsx + Button.module.css + Button.test.tsx
    │   │   └── index.ts     # barrel export
    │   ├── domain/          # empty
    │   └── layout/AppLayout.tsx + AppLayout.test.tsx
    ├── pages/HomePage.tsx + HomePage.test.tsx
    ├── hooks/               # empty
    ├── styles/base.css + layout.css
    └── test/
        ├── setup.ts         # import '@testing-library/jest-dom/vitest'
        ├── renderWithRouter.tsx
        └── fixtures.ts
```

### vite.config.ts

```typescript
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    exclude: ['node_modules', 'e2e'],
  },
})
```

### Makefile (front)

```makefile
.PHONY: install lint test build check dev

install:
	npm install

lint:
	npm run lint
	npx tsc -b --noEmit

test:
	npm run test

build:
	npm run build

check: lint test build
	@echo "All checks passed!"

dev:
	npm run dev
```

## 4. После генерации

Создай root → back (config → src по слоям → tests) → front (config → src → tests). Выведи:

```
Монорепа <project-name> создана.

  cd <project-name>
  git init && git add -A && git commit -m "init: scaffold <project-name> monorepo"

  cd packages/back && uv sync && make check
  cd packages/front && npm install && make check
  make up
```

## Правила

- Все файлы рабочие — `make check` проходит с первого раза
- Только каркас (CRUD entity, empty pages), без бизнес-логики
- Только базовый стек: FastAPI + SQLAlchemy + React. Без OpenAI, Celery, Redis
- Подставляй имена из аргументов во все файлы (imports, classes, tables)
- `__init__.py` в каждой Python-директории
- Architecture tests, unit tests, frontend tests — все проходят
