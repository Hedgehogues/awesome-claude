# Monorepo Organization Guide

How to structure a DDD monorepo for productive AI-assisted development.

---

## The Big Picture

```mermaid
graph TD
    subgraph MONO ["Monorepo"]
        ROOT["Root<br/>Makefile · docker-compose · .env"]

        subgraph PKGS ["packages/"]
            BACK["back/<br/>FastAPI · DDD"]
            FRONT["front/<br/>React · Vite"]
            COLLECT["collector/<br/>CLI agent"]
            E2E["e2e/<br/>Playwright"]
            INFRA["infra/<br/>K8s · Helm"]
        end

        ROOT -->|"$(MAKE) -C"| BACK
        ROOT -->|"$(MAKE) -C"| FRONT
        ROOT -->|"$(MAKE) -C"| COLLECT
        ROOT -->|"$(MAKE) -C"| E2E
        ROOT -->|"$(MAKE) -C"| INFRA
    end

    style ROOT fill:#4A90D9,color:#fff,stroke-width:3px
    style BACK fill:#7ED321,color:#fff
    style FRONT fill:#F5A623,color:#fff
    style COLLECT fill:#BD10E0,color:#fff
    style E2E fill:#9013FE,color:#fff
    style INFRA fill:#D0021B,color:#fff
```

**Root owns orchestration. Packages own logic.** The root Makefile never contains build/test/lint logic — only `$(MAKE) -C` delegation. Each package is self-contained: own Makefile, own config, own test suite.

---

## Features = Bounded Contexts

The number of features your product has is tightly coupled to the number of bounded contexts in the backend. Each BC is a vertical slice through all four DDD layers:

```mermaid
graph TB
    subgraph "Feature = Bounded Context"
        direction TB
        D["Domain<br/>entity · repository · exceptions"]
        A["Application<br/>use cases"]
        I["Infrastructure<br/>ORM · adapters · clients"]
        P["Presentation<br/>routes · schemas"]

        D --> A --> I --> P
    end

    subgraph "Another Feature = Another BC"
        direction TB
        D2["Domain"] --> A2["Application"] --> I2["Infrastructure"] --> P2["Presentation"]
    end

    style D fill:#E8F5E9,stroke:#4CAF50
    style A fill:#E3F2FD,stroke:#2196F3
    style I fill:#FFF3E0,stroke:#FF9800
    style P fill:#F3E5F5,stroke:#9C27B0
    style D2 fill:#E8F5E9,stroke:#4CAF50
    style A2 fill:#E3F2FD,stroke:#2196F3
    style I2 fill:#FFF3E0,stroke:#FF9800
    style P2 fill:#F3E5F5,stroke:#9C27B0
```

**One feature = one BC = one vertical slice.** Adding a feature means adding a new `src/<bc_name>/` directory with all four layers — not scattering files across existing directories.

---

## DDD Structure Inside a Bounded Context

Each bounded context is a self-contained domain with its own aggregates, repositories, and use cases.

### Aggregate = Unit of Consistency

```mermaid
graph TD
    subgraph AGG ["Aggregate: RequirementDocument"]
        ROOT["RequirementDocument<br/><i>Aggregate Root</i><br/>document_id · title · status · version"]

        ROOT --> BLOCK["DocumentBlock<br/><i>Child Entity</i><br/>block_id · content · order"]
        ROOT --> VER["BlockVersion<br/><i>Value Object</i><br/>version_no · content · reason"]
        ROOT --> COMMENT["BlockComment<br/><i>Child Entity</i><br/>comment_text · status"]

        BLOCK --> VER
        BLOCK --> COMMENT
    end

    subgraph RULES ["Invariants"]
        R1["All mutations go through Root"]
        R2["version++ on every command"]
        R3["Children accessed only via Root methods"]
    end

    ROOT -.-> RULES

    style ROOT fill:#4CAF50,color:#fff,stroke-width:3px
    style BLOCK fill:#81C784,color:#fff
    style VER fill:#C8E6C9,stroke:#4CAF50
    style COMMENT fill:#81C784,color:#fff
    style RULES fill:#FFF3E0,stroke:#FF9800
```

**Key rules:**
- Only the **Aggregate Root** has a repository — children are loaded/saved through the root
- Every mutating method increments `version` (optimistic locking)
- External code never holds a reference to a child entity — always go through root methods

### Domain Layer Anatomy

```mermaid
graph LR
    subgraph "src/&lt;bc_name&gt;/domain/"
        direction TB

        subgraph agg1 ["order/"]
            E1["entity.py<br/>Order (Root)<br/>OrderLine (Child)<br/>OrderStatus (Enum)"]
            R1["repository.py<br/>OrderRepository (ABC)"]
        end

        subgraph agg2 ["customer/"]
            E2["entity.py<br/>Customer (Root)"]
            R2["repository.py<br/>CustomerRepository (ABC)"]
        end

        EX["exceptions.py<br/>OrderNotFoundError<br/>InvalidOrderStateError"]
        PT["ports.py<br/>PaymentGatewayPort (ABC)"]
    end

    style agg1 fill:#E8F5E9,stroke:#4CAF50
    style agg2 fill:#E8F5E9,stroke:#4CAF50
    style EX fill:#FFEBEE,stroke:#F44336
    style PT fill:#E3F2FD,stroke:#2196F3
```

**One aggregate = one subdirectory** with `entity.py` + `repository.py`. This convention enables auto-discovery: architecture tests find aggregates by globbing `*/entity.py`.

### How Layers Connect

```mermaid
sequenceDiagram
    participant Client
    participant Route as routes.py<br/>(Presentation)
    participant UC as CreateOrderUseCase<br/>(Application)
    participant Entity as Order.create()<br/>(Domain)
    participant Repo as SqlAlchemyOrderRepo<br/>(Infrastructure)
    participant DB as PostgreSQL

    Client->>Route: POST /api/orders
    Route->>Route: open transaction
    Route->>UC: execute(customer_id, items)

    UC->>Entity: Order.create(customer_id, items)
    Note over Entity: Factory method<br/>UUID generated<br/>version = 1

    Entity-->>UC: order

    UC->>Repo: save(order)
    Repo->>DB: INSERT

    UC-->>Route: order
    Route-->>Client: OrderResponse (201)
```

### Aggregate Mapping to Infrastructure

```mermaid
graph TD
    subgraph "Domain (what)"
        AGG["Order<br/>Aggregate Root"]
        CHILD["OrderLine<br/>Child Entity"]
    end

    subgraph "Infrastructure (how)"
        MODEL_R["OrderModel<br/>orders table"]
        MODEL_C["OrderLineModel<br/>order_lines table"]
        REPO["SqlAlchemyOrderRepository"]
    end

    subgraph "Wiring"
        MODELS["models.py<br/>combined_metadata"]
        DEPS["dependencies.py<br/>Composition Root"]
    end

    AGG -->|"1 aggregate"| REPO
    AGG -->|"1 abstract repo"| REPO
    REPO -->|uses| MODEL_R
    REPO -->|uses| MODEL_C
    MODEL_R --> MODELS
    MODEL_C --> MODELS
    REPO --> DEPS

    style AGG fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style REPO fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style MODELS fill:#607D8B,color:#fff
    style DEPS fill:#607D8B,color:#fff
```

**1 aggregate = 1 abstract repo = 1 concrete repo = N ORM models.** Architecture tests enforce this via `test_one_aggregate_one_repo.py`.

### Cross-BC Communication

Bounded contexts do NOT import each other's domain code. Communication happens through:

```mermaid
graph LR
    subgraph BC1 ["BC: Orders"]
        UC1["PlaceOrderUseCase"]
    end

    subgraph BC2 ["BC: Inventory"]
        UC2["ReserveStockUseCase"]
    end

    UC1 -->|"shared value object<br/>(ProductId, Quantity)"| UC2
    UC1 -.-x|"NEVER: import<br/>BC2 entity"| UC2

    subgraph ALLOWED ["Allowed patterns"]
        V["Shared value objects<br/>(IDs, enums)"]
        A["API calls<br/>(REST between BCs)"]
        E["Domain events<br/>(async, eventual consistency)"]
    end

    style BC1 fill:#E8F5E9,stroke:#4CAF50
    style BC2 fill:#E3F2FD,stroke:#2196F3
    style ALLOWED fill:#FFF3E0,stroke:#FF9800
```

> **When domains grow entangled**, it's time to reorganize. See [Strangler Pattern for BC Reorganization](STRANGLER_PATTERN.md).

---

## The 3-Agent Rule

> **Hard limit: no more than 3 concurrent AI agent groups per domain.**

This is an empirical finding, not a theoretical constraint. When more than 3 agent groups work on the same bounded context simultaneously, the result is:

```mermaid
graph LR
    subgraph OK ["<= 3 agents per domain"]
        A1["Agent 1<br/>entity + repo"] --> BC1[("BC: orders")]
        A2["Agent 2<br/>use cases"] --> BC1
        A3["Agent 3<br/>routes + tests"] --> BC1
    end

    subgraph BAD ["> 3 agents per domain"]
        B1["Agent 1"] --> BC2[("BC: orders")]
        B2["Agent 2"] --> BC2
        B3["Agent 3"] --> BC2
        B4["Agent 4"] --> BC2
        B5["Agent 5"] --> BC2

        BC2 -.-x|"merge conflicts"| FAIL["Conflicts<br/>Rework<br/>Wasted tokens"]
    end

    style OK fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style BAD fill:#FFEBEE,stroke:#F44336,stroke-width:2px
    style FAIL fill:#F44336,color:#fff
    style BC1 fill:#4CAF50,color:#fff
    style BC2 fill:#F44336,color:#fff
```

### Why 3?

```mermaid
graph TD
    subgraph "Conflict sources"
        S1["Shared imports<br/>(models.py, dependencies.py, router.py)"]
        S2["Schema drift<br/>(one agent adds field,<br/>another assumes old shape)"]
        S3["Migration collisions<br/>(two agents generate<br/>conflicting ALTER TABLE)"]
        S4["Test fixture overlap<br/>(conftest.py edited<br/>by multiple agents)"]
    end

    S1 --> C["Merge conflict probability<br/>grows O(n²) with agent count"]
    S2 --> C
    S3 --> C
    S4 --> C

    C -->|"n <= 3"| G["Manageable:<br/>serial wiring files,<br/>parallel domain files"]
    C -->|"n > 3"| R["Unmanageable:<br/>conflicts outnumber<br/>productive changes"]

    style G fill:#4CAF50,color:#fff
    style R fill:#F44336,color:#fff
```

**The bottleneck is wiring files**, not domain logic. Each BC has independent domain/application/infrastructure code, but they all share:

| Wiring file | What it does | Why it conflicts |
|---|---|---|
| `models.py` | Imports all ORM models + merges metadata | Every new BC adds imports |
| `dependencies.py` | Composition root | Every new repo/client adds imports |
| `router.py` | Includes all sub-routers | Every new BC adds `include_router` |
| `conftest.py` | Shared test fixtures | Every new BC may add fixtures |
| `migrations/` | Alembic versions | Two concurrent `revision` = broken chain |

With 3 agents, you can serialize access to wiring files while parallelizing domain work. With 4+, the serial queue dominates and agents spend more time waiting or resolving conflicts than writing code.

### Practical patterns

```mermaid
flowchart TD
    TASK["Large feature<br/>(spans 2+ BCs)"]

    TASK --> S1["Phase 1: Domain layer<br/>(parallel across BCs)"]
    S1 --> S2["Phase 2: Application layer<br/>(parallel across BCs)"]
    S2 --> S3["Phase 3: Infrastructure<br/>(parallel per BC,<br/>serial for wiring)"]
    S3 --> S4["Phase 4: Presentation<br/>(parallel per BC,<br/>serial for router)"]
    S4 --> S5["Phase 5: Tests<br/>(parallel per BC)"]

    style TASK fill:#4A90D9,color:#fff
    style S3 fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style S4 fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
```

| Pattern | When | How many agents |
|---|---|---|
| **Single BC, full stack** | New feature in one domain | 1 agent, sequential layers |
| **Multiple BCs, domain-first** | Cross-cutting feature | 2-3 agents parallel on domain, then serial wiring |
| **Scaffolding** | New project or new BC | 1 agent via `/init-repo` |

---

## Package Structure

### Two-Level Makefile

```mermaid
graph TD
    ROOT_MK["Root Makefile<br/><i>delegation only</i>"]

    ROOT_MK -->|check| B_MK["back/Makefile<br/>lint + test + cov"]
    ROOT_MK -->|check| F_MK["front/Makefile<br/>lint + test + build"]
    ROOT_MK -->|check| C_MK["collector/Makefile<br/>lint + test"]

    ROOT_MK -->|up / down| DC["docker-compose.yml"]
    ROOT_MK -->|migrate| B_MK

    style ROOT_MK fill:#4A90D9,color:#fff,stroke-width:3px
    style DC fill:#607D8B,color:#fff
```

Every package MUST expose:

| Target | Contract |
|--------|----------|
| `check` | Single "is everything OK?" — what CI calls |
| `lint` | Static analysis: linter + formatter + types |
| `test` | All automated tests for the package |

### Backend Package Anatomy

```mermaid
graph TD
    subgraph "src/"
        MAIN["main.py<br/>FastAPI app"] --> ROUTER["router.py<br/>Hub"]
        MAIN --> CONFIG["config.py<br/>Settings + DB"]

        ROUTER --> BC1_R["bc_1/presentation/<br/>routes.py"]
        ROUTER --> BC2_R["bc_2/presentation/<br/>routes.py"]

        BC1_R --> DEP["dependencies.py<br/>Composition Root"]
        BC2_R --> DEP

        DEP --> BC1_I["bc_1/infrastructure/<br/>repos, clients"]
        DEP --> BC2_I["bc_2/infrastructure/<br/>repos, clients"]

        MODELS["models.py<br/>Registry"] --> BC1_I
        MODELS --> BC2_I
    end

    subgraph "tests/"
        T_ARCH["architecture/<br/>Layer boundary validation"]
        T_UNIT["unit/<br/>bc_1/ · bc_2/"]
        T_STATE["state/"]
        T_SEC["security/"]
        T_CASES["cases/"]
    end

    style MAIN fill:#4A90D9,color:#fff
    style DEP fill:#4CAF50,color:#fff,stroke-width:3px
    style MODELS fill:#FF9800,color:#fff
    style T_ARCH fill:#F44336,color:#fff
```

### Frontend Package Anatomy

```mermaid
graph TD
    subgraph "src/"
        ENTRY["main.tsx"] --> APP["App.tsx<br/>Router"]
        APP --> LAYOUT["layout/<br/>AppLayout"]
        APP --> PAGES["pages/<br/>HomePage, ..."]

        PAGES --> API["api/client.ts<br/>fetch wrappers"]
        PAGES --> UI["components/ui/<br/>Button, Card, ..."]
        PAGES --> DOMAIN["components/domain/<br/>Business components"]

        UI --> TOKENS["tokens/<br/>CSS variables"]
    end

    subgraph "test/"
        SETUP["setup.ts"]
        HELPERS["renderWithRouter.tsx"]
        FIX["fixtures.ts"]
    end

    style ENTRY fill:#F5A623,color:#fff
    style API fill:#4A90D9,color:#fff
    style TOKENS fill:#7ED321,color:#fff
```

---

## Scaling: When to Split

```mermaid
graph LR
    subgraph MONO ["Monolith (start here)"]
        M1["1-4 BCs<br/>1 database<br/>1 deploy unit"]
    end

    MONO -->|"5+ BCs or<br/>team boundaries"| SPLIT

    subgraph SPLIT ["Split candidates"]
        S1["Extract BC<br/>to separate service"]
        S2["Separate DB<br/>per service"]
        S3["API contract<br/>between services"]
    end

    SPLIT -->|"Each new Base<br/>is already isolated"| READY["Ready:<br/>each BC has own Base<br/>→ own metadata<br/>→ own migrations"]

    style MONO fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style SPLIT fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style READY fill:#4CAF50,color:#fff
```

The architecture prepares for this: each BC has its own `Base(DeclarativeBase)`, its own ORM models, and `models.py` merges them via `combined_metadata`. Splitting a BC into a separate service means:

1. Move `src/<bc_name>/` to a new package
2. Give it its own `config.py` + `main.py`
3. Replace in-process calls with HTTP/gRPC
4. No domain code changes needed

---

## Checklist: Adding a New Feature

```mermaid
flowchart TD
    Q1{"New domain<br/>concept?"}
    Q1 -->|Yes| NEW_BC["Create new BC<br/>(4 layers + tests)"]
    Q1 -->|No| EXIST["Add to existing BC"]

    NEW_BC --> W1["Wire: models.py"]
    NEW_BC --> W2["Wire: dependencies.py"]
    NEW_BC --> W3["Wire: router.py"]
    W1 --> CHECK
    W2 --> CHECK
    W3 --> CHECK
    EXIST --> CHECK

    CHECK["make check"] --> PASS{"Green?"}
    PASS -->|Yes| DONE["Ship it"]
    PASS -->|No| FIX["Fix before continuing<br/>(break-stop rule)"]
    FIX --> CHECK

    style NEW_BC fill:#4A90D9,color:#fff
    style CHECK fill:#F5A623,color:#fff
    style DONE fill:#4CAF50,color:#fff
    style FIX fill:#F44336,color:#fff
```

Architecture tests will **automatically discover** new BCs via `discover_aggregates()` and validate layer boundaries — no test code changes needed.
