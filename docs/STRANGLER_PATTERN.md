# Strangler Pattern for Bounded Context Reorganization

How to move aggregates between bounded contexts using AI agents without breaking the system.

---

## The Problem

As a product evolves, bounded context boundaries shift. What started as one domain splits into two, or aggregates end up in the wrong BC. Direct restructuring is risky — moving files breaks imports, wiring, tests, and migrations in unpredictable ways.

```mermaid
graph LR
    subgraph BEFORE ["Before: entangled"]
        BC1["BC: Schemas<br/>────────<br/>Project<br/>Collector<br/>LLMProfile<br/>McpConfig<br/>SlackConfig<br/>GitLabIntegration<br/>RequirementTemplate<br/>DirectoryStructure"]
    end

    BC1 -.-|"too many<br/>aggregates<br/>low cohesion"| PROBLEM["This BC does<br/>everything.<br/>It's a junk drawer."]

    style BC1 fill:#FFEBEE,stroke:#F44336,stroke-width:2px
    style PROBLEM fill:#F44336,color:#fff
```

**Symptoms of a misplaced aggregate:**
- BC has 8+ aggregates with weak relationships
- Use cases import from multiple unrelated aggregates
- New features require touching 3+ BCs for one user story
- Team discussions start with "where does this belong?"

---

## The Strangler Approach

Instead of a Big Bang refactoring, use the **Strangler Fig** pattern: grow the new structure around the old one, move pieces incrementally, and remove the old shell when it's empty.

```mermaid
graph TD
    subgraph PHASE ["3 Phases"]
        P1["Phase 1<br/>DOMAIN FIRST<br/>Move aggregate root +<br/>children + repository +<br/>exceptions to new BC"]

        P2["Phase 2<br/>FOLLOW THE DOMAIN<br/>Move application layer<br/>(use cases) +<br/>infrastructure layer<br/>(ORM, repos, adapters)"]

        P3["Phase 3<br/>REWIRE<br/>Update presentation<br/>(routes, schemas) +<br/>wiring files +<br/>tests"]
    end

    P1 -->|"make check"| P2
    P2 -->|"make check"| P3
    P3 -->|"make check"| DONE["Clean BC boundaries"]

    style P1 fill:#E8F5E9,stroke:#4CAF50,stroke-width:3px
    style P2 fill:#E3F2FD,stroke:#2196F3,stroke-width:2px
    style P3 fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style DONE fill:#4CAF50,color:#fff
```

**The key insight: domain first, everything else follows.** Moving the aggregate root to a new BC is the atomic operation — it defines the new boundary. All other layers (application, infrastructure, presentation) are mechanically derived from where the domain lives.

---

## Phase 1: Move the Domain

This is the only phase that requires architectural judgment. Everything after is mechanical.

```mermaid
flowchart LR
    subgraph OLD ["src/schemas/domain/"]
        O_AGG["slack/<br/>entity.py<br/>repository.py"]
        O_EX["exceptions.py<br/>(shared)"]
        O_OTHER["project/<br/>collector/<br/>llm_profile/<br/>..."]
    end

    subgraph NEW ["src/integrations/domain/"]
        N_AGG["slack/<br/>entity.py<br/>repository.py"]
        N_EX["exceptions.py"]
    end

    O_AGG -->|"move"| N_AGG
    O_EX -->|"extract relevant<br/>exceptions"| N_EX

    style OLD fill:#FFEBEE,stroke:#F44336
    style NEW fill:#E8F5E9,stroke:#4CAF50
    style O_OTHER fill:#FFF3E0,stroke:#FF9800
```

### What moves:
- `entity.py` — aggregate root + all child entities + enums
- `repository.py` — abstract repository interface
- Relevant exceptions from `exceptions.py` (extract, don't copy the whole file)
- `__init__.py` with re-exports

### What stays:
- Other aggregates in the old BC
- Shared value objects (move only if used exclusively by the migrating aggregate)

### After Phase 1:

```bash
make check   # Architecture tests auto-discover new location
             # Import errors show exactly what else needs to move
```

Architecture tests (`test_layer_boundaries.py`) will immediately detect the new BC via `discover_aggregates()`. Any remaining cross-BC imports become visible as test failures — they are your migration checklist.

---

## Phase 2: Follow the Domain

Move the layers that directly depend on the domain. The rule is simple: **if it imports the aggregate, it moves with it.**

```mermaid
flowchart TD
    subgraph MOVE ["What moves (follows the aggregate)"]
        UC["application/<br/>use cases that import<br/>the moved aggregate"]
        ORM["infrastructure/persistence/<br/>ORM models for this aggregate"]
        REPO["infrastructure/persistence/<br/>concrete repository"]
        ADAPT["infrastructure/external/<br/>adapters used only by<br/>this aggregate's use cases"]
    end

    subgraph STAY ["What stays"]
        UC2["Use cases importing<br/>OTHER aggregates"]
        ORM2["ORM models for<br/>OTHER aggregates"]
        SHARED["Shared infrastructure<br/>(DB session, LLM client)"]
    end

    style MOVE fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style STAY fill:#FFF3E0,stroke:#FF9800
```

### Decision table

| File | Imports moved aggregate? | Used by other BCs? | Action |
|------|------------------------|--------------------|---------|
| `create_slack_config.py` | Yes | No | **Move** |
| `submit_snapshot.py` | No | Yes | **Stay** |
| `SlackConfigModel` | Yes (maps to entity) | No | **Move** |
| `SlackAdapter` | Used by moved use case | No | **Move** |
| `LLMClient` | Used by many BCs | Yes | **Stay** (shared infra) |

### After Phase 2:

```bash
make check   # Remaining failures = wiring + presentation
```

---

## Phase 3: Rewire

Update the mechanical connections. This is the safest phase — pure import path changes.

```mermaid
flowchart TD
    subgraph WIRING ["Wiring files to update"]
        M["models.py<br/>Move Base + model imports<br/>to new BC section"]
        D["dependencies.py<br/>Update import paths<br/>for moved repos/clients"]
        R["router.py<br/>Move include_router<br/>to new BC router"]
    end

    subgraph PRES ["Presentation"]
        RT["routes.py<br/>Move endpoints to<br/>new BC's routes"]
        SC["schemas.py<br/>Move request/response<br/>models"]
    end

    subgraph TESTS ["Tests"]
        T1["tests/unit/old_bc/<br/>→ tests/unit/new_bc/"]
        T2["tests/conftest.py<br/>Update fixture imports"]
    end

    M --> CHECK["make check"]
    D --> CHECK
    R --> CHECK
    RT --> CHECK
    SC --> CHECK
    T1 --> CHECK
    T2 --> CHECK

    CHECK --> GREEN{"Green?"}
    GREEN -->|Yes| DONE["Migration complete"]
    GREEN -->|No| FIX["Fix import paths"]
    FIX --> CHECK

    style WIRING fill:#607D8B,color:#fff
    style CHECK fill:#F5A623,color:#fff
    style DONE fill:#4CAF50,color:#fff
```

---

## Complete Example: Extracting `integrations` BC

```mermaid
graph TD
    subgraph BEFORE ["Before"]
        direction TB
        OLD["src/schemas/<br/>────────────<br/>domain/<br/>  project/<br/>  collector/<br/>  llm_profile/<br/>  slack/<br/>  gitlab/<br/>  mcp_config/<br/>  ...<br/>application/<br/>infrastructure/<br/>presentation/"]
    end

    BEFORE -->|"Phase 1"| MID1

    subgraph MID1 ["After Phase 1"]
        direction LR
        SCHEMAS1["src/schemas/<br/>────────────<br/>domain/<br/>  project/<br/>  collector/<br/>  llm_profile/<br/>  mcp_config/"]

        INTEG1["src/integrations/<br/>────────────<br/>domain/<br/>  slack/<br/>  gitlab/"]
    end

    MID1 -->|"Phase 2-3"| AFTER

    subgraph AFTER ["After"]
        direction LR
        SCHEMAS2["src/schemas/<br/>────────────<br/>domain/ (6 aggs)<br/>application/<br/>infrastructure/<br/>presentation/"]

        INTEG2["src/integrations/<br/>────────────<br/>domain/ (2 aggs)<br/>application/<br/>infrastructure/<br/>presentation/"]
    end

    style BEFORE fill:#FFEBEE,stroke:#F44336
    style SCHEMAS1 fill:#FFF3E0,stroke:#FF9800
    style INTEG1 fill:#E8F5E9,stroke:#4CAF50
    style SCHEMAS2 fill:#E8F5E9,stroke:#4CAF50
    style INTEG2 fill:#E8F5E9,stroke:#4CAF50
```

---

## Using AI Agents for Migration

The Strangler pattern works exceptionally well with Claude Code because each phase is a clear, scoped instruction:

```
Phase 1: "Move src/schemas/domain/slack/ and src/schemas/domain/gitlab/
          to a new bounded context src/integrations/domain/.
          Extract relevant exceptions. Run make check."

Phase 2: "Move all use cases and infrastructure that import from
          src/integrations/domain/ out of src/schemas/ into
          src/integrations/. Run make check."

Phase 3: "Update models.py, dependencies.py, router.py, and move
          routes + schemas. Move tests. Run make check."
```

### Why it works with agents

```mermaid
graph TD
    subgraph "Agent strengths"
        S1["Mechanical precision<br/>Renames 50 import paths<br/>without typos"]
        S2["Architecture tests<br/>as guardrail<br/>Auto-discover new BC"]
        S3["make check after<br/>each phase<br/>Immediate feedback"]
    end

    subgraph "Human strengths"
        H1["Decide WHICH aggregate<br/>moves WHERE"]
        H2["Judge cohesion:<br/>does this grouping<br/>make domain sense?"]
    end

    H1 --> PROMPT["Prompt per phase"]
    H2 --> PROMPT
    PROMPT --> S1
    PROMPT --> S2
    PROMPT --> S3
    S3 --> DONE["Migrated BC"]

    style H1 fill:#F5A623,color:#fff
    style H2 fill:#F5A623,color:#fff
    style DONE fill:#4CAF50,color:#fff
```

**Human decides the boundary. Agent executes the move.** This division plays to each party's strength — humans understand domain semantics, agents handle mechanical precision across dozens of files.

---

## Anti-Patterns

```mermaid
graph LR
    subgraph BAD ["What NOT to do"]
        X1["Move all layers<br/>at once<br/>(Big Bang)"]
        X2["Copy instead<br/>of move<br/>(duplication)"]
        X3["Move infra<br/>before domain<br/>(backwards)"]
        X4["Skip make check<br/>between phases"]
    end

    X1 -->|risk| R1["50+ files changed<br/>impossible to debug"]
    X2 -->|risk| R2["Two sources of truth<br/>drift guaranteed"]
    X3 -->|risk| R3["Circular imports<br/>unclear boundaries"]
    X4 -->|risk| R4["Errors compound<br/>across phases"]

    style BAD fill:#FFEBEE,stroke:#F44336,stroke-width:2px
    style R1 fill:#F44336,color:#fff
    style R2 fill:#F44336,color:#fff
    style R3 fill:#F44336,color:#fff
    style R4 fill:#F44336,color:#fff
```

| Anti-pattern | Why it fails | Correct approach |
|---|---|---|
| Big Bang | Too many changes, can't isolate failures | 3 phases with `make check` between each |
| Copy-paste | Two copies of the entity diverge immediately | Move (delete from old, create in new) |
| Infrastructure first | Repo without entity = broken imports | Domain first, infra follows |
| No verification | Errors from phase 1 cascade to phase 3 | `make check` is mandatory between phases |
| Moving shared infra | Breaks other BCs that depend on it | Only move what's exclusive to the aggregate |
