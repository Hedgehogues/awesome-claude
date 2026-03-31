# init-repo: Architecture Principles

Design rationale and structural decisions behind the generated monorepo.

---

## Monorepo Topology

```mermaid
graph TD
    ROOT["<b>Root</b><br/>Makefile + docker-compose"]

    ROOT -->|"$(MAKE) -C"| BACK["<b>packages/back</b><br/>FastAPI + SQLAlchemy"]
    ROOT -->|"$(MAKE) -C"| FRONT["<b>packages/front</b><br/>React 19 + Vite"]
    ROOT -->|docker compose| PG[("PostgreSQL 16")]

    BACK -->|port 8000| API["/api/*"]
    FRONT -->|port 3000| SPA["SPA"]
    SPA -->|fetch| API

    style ROOT fill:#4A90D9,color:#fff
    style BACK fill:#7ED321,color:#fff
    style FRONT fill:#F5A623,color:#fff
    style PG fill:#BD10E0,color:#fff
```

**Root owns orchestration, packages own logic.** Root Makefile never contains build/test/lint commands directly — only `$(MAKE) -C` delegation. Each package is self-contained: own Makefile, own config, own tests.

---

## DDD Layer Architecture (Backend)

```mermaid
graph TB
    subgraph BC ["Bounded Context"]
        direction TB

        subgraph DOM ["Domain"]
            E["Entity<br/>(Aggregate Root)"]
            R["Repository<br/>(ABC)"]
            EX["Exceptions"]
        end

        subgraph APP ["Application"]
            UC["Use Cases<br/>(one file = one action)"]
        end

        subgraph INFRA ["Infrastructure"]
            ORM["ORM Models<br/>(SQLAlchemy)"]
            REPO["Concrete Repo<br/>(SqlAlchemy*)"]
        end

        subgraph PRES ["Presentation"]
            RT["FastAPI Routes"]
            SCH["Pydantic Schemas"]
        end
    end

    UC -->|imports| E
    UC -->|imports| R
    REPO -->|implements| R
    REPO -->|uses| ORM
    RT -->|composes| UC
    RT -->|uses| SCH

    subgraph WIRE ["Wiring (src/)"]
        DEP["dependencies.py<br/>Composition Root"]
        MDL["models.py<br/>Model Registry"]
        RTR["router.py<br/>Router Hub"]
    end

    RT -->|imports from| DEP
    DEP -->|imports| REPO
    MDL -->|imports| ORM
    RTR -->|include_router| RT

    style DOM fill:#E8F5E9,stroke:#4CAF50
    style APP fill:#E3F2FD,stroke:#2196F3
    style INFRA fill:#FFF3E0,stroke:#FF9800
    style PRES fill:#F3E5F5,stroke:#9C27B0
    style WIRE fill:#ECEFF1,stroke:#607D8B
```

---

## Layer Dependency Rules

```mermaid
graph LR
    D["Domain"] --- A["Application"]
    A --- I["Infrastructure"]
    A --- P["Presentation"]

    D -.-x|"FORBIDDEN"| A2["Application"]
    D -.-x|"FORBIDDEN"| I2["Infrastructure"]
    D -.-x|"FORBIDDEN"| P2["Presentation"]

    P -.-x|"FORBIDDEN<br/>(use dependencies.py)"| I3["Infrastructure"]

    style D fill:#E8F5E9,stroke:#4CAF50
    style A fill:#E3F2FD,stroke:#2196F3
    style I fill:#FFF3E0,stroke:#FF9800
    style P fill:#F3E5F5,stroke:#9C27B0
```

| Layer | CAN import | CANNOT import | CANNOT use libs |
|-------|-----------|---------------|-----------------|
| **Domain** | stdlib only | application, infrastructure, presentation | sqlalchemy, fastapi, httpx, openai |
| **Application** | domain | presentation | sqlalchemy, fastapi, httpx, openai |
| **Infrastructure** | domain, external libs | presentation | — |
| **Presentation** | domain, `src.dependencies` | infrastructure directly | sqlalchemy |

These rules are **enforced by architecture tests** via AST analysis (`tests/architecture/test_layer_boundaries.py`).

---

## Request Flow

```mermaid
sequenceDiagram
    participant Client as Frontend
    participant Route as Route (presentation)
    participant UC as UseCase (application)
    participant Entity as Entity (domain)
    participant Repo as SqlAlchemyRepo (infra)
    participant DB as PostgreSQL

    Client->>Route: POST /api/<aggregates>
    Route->>Route: async with async_session() as db, db.begin()
    Route->>UC: execute(name=request.name)
    UC->>Entity: Entity.create(name=name)
    Entity-->>UC: entity (version=1)
    UC->>Repo: save(entity)
    Repo->>DB: INSERT INTO <aggregates>
    DB-->>Repo: ok
    Repo-->>UC: None
    UC-->>Route: entity
    Route-->>Client: EntityResponse (JSON)
```

---

## Test Strategy

```mermaid
mindmap
  root(("Tests"))
    Unit
      One scenario = one test
      Mock all dependencies
      pytestmark = pytest.mark.unit
    Architecture
      AST-based import analysis
      Layer boundary validation
      Auto-discover aggregates
    State
      Cartesian product of axes
      pytest.parametrize
      Impossible = pytest.skip
    Security
      What must NOT work
      Auth bypass, injection
      Edge cases
    Cases
      Given / When / Then
      Use case chains
      Business scenarios
    Integration
      Real API / DB
      Skip on fake keys
      Soft thresholds
```

### Backend test targets

```mermaid
graph LR
    CHECK["make check"] --> LINT["lint<br/>ruff + black + mypy"]
    CHECK --> TEST["make test"]
    CHECK --> COV["test-cov"]
    TEST --> U["test-unit"]
    TEST --> A["architecture-check"]
    COV --> U2["unit + arch<br/>with --cov"]

    style CHECK fill:#4A90D9,color:#fff
    style LINT fill:#F5A623,color:#fff
    style TEST fill:#7ED321,color:#fff
    style COV fill:#BD10E0,color:#fff
```

---

## Frontend Architecture

```mermaid
graph TD
    subgraph SRC ["src/"]
        MAIN["main.tsx<br/>createRoot"] --> APP["App.tsx<br/>BrowserRouter"]
        APP --> LAYOUT["layout/AppLayout"]
        APP --> PAGES["pages/HomePage"]

        PAGES -->|fetch| API["api/client.ts<br/>fetchJson / postJson"]
        API -->|types| TYPES["types/api.ts"]

        LAYOUT --> UI["components/ui/<br/>Button, ..."]
        PAGES --> UI
        PAGES --> DOMAIN["components/domain/<br/>(empty initially)"]
    end

    subgraph TEST ["test/"]
        SETUP["setup.ts<br/>jest-dom/vitest"]
        ROUTER["renderWithRouter.tsx"]
        FIX["fixtures.ts"]
    end

    UI -.->|tested with| SETUP
    PAGES -.->|tested with| ROUTER

    style SRC fill:#E8F5E9,stroke:#4CAF50
    style TEST fill:#FFF3E0,stroke:#FF9800
```

### Component pattern

```
ComponentName/
├── ComponentName.tsx          # React component
├── ComponentName.module.css   # CSS Module (scoped styles)
└── ComponentName.test.tsx     # Colocated test
```

---

## Composition Root Pattern

```mermaid
graph TD
    subgraph "Forbidden"
        RT2["routes.py"] -.-x|"NEVER"| INFRA2["infrastructure/*"]
    end

    subgraph "Correct"
        RT["routes.py"] -->|imports| DEP["dependencies.py"]
        DEP -->|imports| REPO["SqlAlchemy*Repository"]
        DEP -->|imports| CLIENT["LLMClient, adapters..."]
    end

    style DEP fill:#4CAF50,color:#fff,stroke-width:3px
```

`dependencies.py` is the **single coupling point**. All concrete infrastructure implementations are imported here and re-exported. Presentation layer imports ONLY from this file — never from infrastructure directly.

---

## Naming Conventions

```mermaid
graph LR
    subgraph "Input"
        P["project-name<br/>(kebab-case)"]
        BC["bc_name<br/>(snake_case)"]
    end

    P --> P2["<project_name><br/>snake_case"]
    P --> P3["<ProjectName><br/>PascalCase"]
    BC --> AGG["<aggregate><br/>singular"]
    AGG --> AGGP["<Aggregate><br/>PascalCase"]
    AGG --> AGGS["<aggregates><br/>plural"]

    AGGP --> FILES["Entity, Repo, UseCase,<br/>Model, Route class names"]
    AGG --> FNAMES["File names, table names,<br/>URL prefixes"]
    AGGS --> TABLE["__tablename__,<br/>API prefix"]

    style P fill:#4A90D9,color:#fff
    style BC fill:#7ED321,color:#fff
```

---

## Adding a New Bounded Context

```mermaid
flowchart TD
    A["Create src/<new_bc>/"] --> B["domain/ — entity + repo + exceptions"]
    B --> C["application/ — use cases"]
    C --> D["infrastructure/persistence/ — base + models + repo"]
    D --> E["presentation/api/ — routes + schemas"]
    E --> F["Update src/models.py — add Base + models"]
    F --> G["Update src/dependencies.py — add imports"]
    G --> H["Update src/router.py — include_router"]
    H --> I["Add tests/unit/<new_bc>/"]
    I --> J["make check"]

    style A fill:#4A90D9,color:#fff
    style J fill:#4CAF50,color:#fff
```

Architecture tests (`test_layer_boundaries.py`) will **automatically discover** the new BC via `discover_aggregates()` — no test code changes needed.
