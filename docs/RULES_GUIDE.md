<div align="center">

# Writing Effective Rules for Claude Code

**A practical guide to `.claude/rules/` that improve quality without wasting tokens**

</div>

---

## The Core Problem

Every rule file in `.claude/rules/` is loaded into the context window on matching requests.
More rules = more tokens = more cost = slower responses.

```mermaid
---
config:
  themeVariables:
    fontSize: 14px
---
block-beta
  columns 2

  block:before["BEFORE: 68 files"]:1
    columns 1
    b1["274K chars ≈ 70K tokens"]
    b2["Textbook DDD"]
    b3["Textbook 12-factor"]
    b4["Textbook refactoring"]
    b5["Textbook DB design"]
    b6["Project-specific rules"]
  end

  block:after["AFTER: 15 files"]:1
    columns 1
    a1["60K chars ≈ 15K tokens"]
    a6["Project-specific rules"]
  end

  style before fill:#fee,stroke:#c33
  style after fill:#efe,stroke:#3a3
  style b2 fill:#fcc,stroke:#a33
  style b3 fill:#fcc,stroke:#a33
  style b4 fill:#fcc,stroke:#a33
  style b5 fill:#fcc,stroke:#a33
  style b6 fill:#cfc,stroke:#3a3
  style a6 fill:#cfc,stroke:#3a3
  style a1 fill:#cfc,stroke:#3a3
  style b1 fill:#fcc,stroke:#a33
```

> **Result: -78% tokens, -53 files, zero quality loss.**
> The red blocks were deleted — all textbook knowledge the model already has.

---

## Decision Tree: Should This Be a Rule?

```mermaid
flowchart TD
    START(["You want to add a rule"]) --> Q1{"Is this a well-known concept?<br/><i>DDD, SOLID, 12-factor, GoF,<br/>Fowler refactoring, etc.</i>"}

    Q1 -->|YES| Q2{"Does YOUR project use it<br/>with <b>custom conventions</b>?<br/><i>specific file names, test IDs,<br/>team decisions</i>"}
    Q1 -->|NO| Q3{"Is it specific to<br/><b>this project</b>?"}

    Q2 -->|YES| A1["**RULE: custom parts only**<br/>Document only what differs<br/>from the textbook"]
    Q2 -->|NO| A2["**DELETE**<br/>Model already knows this"]

    Q3 -->|YES| A3["**RULE: add it**<br/>This is exactly what<br/>rules are for"]
    Q3 -->|NO| A4["**SKIP**<br/>Too generic to help"]

    style A1 fill:#d4edda,stroke:#28a745,color:#000
    style A2 fill:#f8d7da,stroke:#dc3545,color:#000
    style A3 fill:#d4edda,stroke:#28a745,color:#000
    style A4 fill:#fff3cd,stroke:#ffc107,color:#000
    style START fill:#e7e7ff,stroke:#6c5ce7,color:#000
    style Q1 fill:#fff,stroke:#333,color:#000
    style Q2 fill:#fff,stroke:#333,color:#000
    style Q3 fill:#fff,stroke:#333,color:#000
```

---

## The Three Filters

Every candidate rule must pass **all three**. Failing any one = don't add it.

```mermaid
flowchart LR
    R["Candidate<br/>rule"] --> F1

    F1{"**FILTER 1**<br/>Model doesn't<br/>know it?"} -->|PASS| F2
    F1 -->|FAIL| D1["DELETE"]

    F2{"**FILTER 2**<br/>Project-<br/>specific?"} -->|PASS| F3
    F2 -->|FAIL| D2["Move to<br/>CLAUDE.md"]

    F3{"**FILTER 3**<br/>Token cost<br/>worth it?"} -->|PASS| OK["Add to<br/>.claude/rules/"]
    F3 -->|FAIL| D3["CONDENSE<br/>into existing"]

    style F1 fill:#e3f2fd,stroke:#1976d2,color:#000
    style F2 fill:#e3f2fd,stroke:#1976d2,color:#000
    style F3 fill:#e3f2fd,stroke:#1976d2,color:#000
    style OK fill:#d4edda,stroke:#28a745,color:#000
    style D1 fill:#f8d7da,stroke:#dc3545,color:#000
    style D2 fill:#fff3cd,stroke:#ffc107,color:#000
    style D3 fill:#fff3cd,stroke:#ffc107,color:#000
    style R fill:#e7e7ff,stroke:#6c5ce7,color:#000
```

---

### Filter 1: Model Already Knows It

Claude's training data includes virtually every well-known engineering concept.
If your rule is a textbook summary — **delete it**.

| Category | Examples the model already knows |
|----------|------|
| **DDD** | Aggregates, entities, value objects, repositories, bounded contexts |
| **Principles** | SOLID, GRASP, DRY, KISS, YAGNI |
| **Infrastructure** | 12-factor app, port binding, stateless processes |
| **Refactoring** | Fowler catalog — extract method, replace conditional, simplify |
| **Database** | Normal forms, indexing, CONCURRENTLY, expand/contract migrations |
| **Transactions** | Isolation levels, optimistic locking, outbox pattern |
| **Observability** | Structured logging, Prometheus naming, RED/USE methods |
| **Design patterns** | GoF, repository, unit of work, specification |
| **Testing** | Testing pyramid, TDD, mocking strategies |
| **API design** | REST conventions, status codes, versioning |

> Putting these in rules = **paying tokens for a textbook the model already memorized.**

---

### Filter 2: Project-Specific

A good rule references **concrete artifacts** of your project.

```mermaid
---
config:
  themeVariables:
    fontSize: 13px
---
flowchart LR
    subgraph GOOD ["GOOD — specific, keep it"]
        direction TB
        G1["R1 validates that<br/><b>src/domain/*/entity.py</b><br/>files don't cross-import"]
        G2["Handlers call <b>services</b>,<br/>not use cases.<br/>Violation = <b>R7 test fails</b>"]
        G3["UT1: every <b>test_*.py</b> must<br/>have a module docstring,<br/>validated by <b>test_unit_<br/>test_structure.py</b>"]
    end

    subgraph BAD ["BAD — generic, delete it"]
        direction TB
        B1["Aggregates should not<br/>depend on infrastructure"]
        B2["Use service layer to<br/>orchestrate business logic"]
        B3["Write docstrings<br/>for your tests"]
    end

    style GOOD fill:#d4edda,stroke:#28a745,color:#000
    style BAD fill:#f8d7da,stroke:#dc3545,color:#000
    style G1 fill:#fff,stroke:#28a745,color:#000
    style G2 fill:#fff,stroke:#28a745,color:#000
    style G3 fill:#fff,stroke:#28a745,color:#000
    style B1 fill:#fff,stroke:#dc3545,color:#000
    style B2 fill:#fff,stroke:#dc3545,color:#000
    style B3 fill:#fff,stroke:#dc3545,color:#000
```

---

### Filter 3: Token Cost

Every character in `rules/` is loaded on matching requests. Calculate the ROI:

```mermaid
---
config:
  themeVariables:
    fontSize: 13px
---
flowchart TD
    F["Rule file: 24K chars"] --> T["24,000 ÷ 4 = <b>6,000 tokens/request</b>"]
    T --> D["× 50 requests/day = <b>300K tokens/day</b>"]
    D --> Q1{"Referenced in<br/>daily work?"}
    Q1 -->|NO| DEL["DELETE"]
    Q1 -->|YES| Q2{"Prevents mistakes<br/>code review wouldn't?"}
    Q2 -->|NO| DEL
    Q2 -->|YES| Q3{"Could 500 chars<br/>in CLAUDE.md<br/>achieve the same?"}
    Q3 -->|YES| MOVE["Move to CLAUDE.md"]
    Q3 -->|NO| KEEP["KEEP the rule"]

    style DEL fill:#f8d7da,stroke:#dc3545,color:#000
    style MOVE fill:#fff3cd,stroke:#ffc107,color:#000
    style KEEP fill:#d4edda,stroke:#28a745,color:#000
    style F fill:#e7e7ff,stroke:#6c5ce7,color:#000
```

---

## Anatomy of a Good Rule vs Bad Rule

```mermaid
---
config:
  themeVariables:
    fontSize: 13px
---
flowchart LR
    subgraph GOOD_RULE ["ARCH_TESTS.md — 14K chars"]
        direction TB
        P1["**paths:** tests/architecture/**,<br/>src/domain/**"]
        P2["**R1:** Aggregate isolation —<br/>concrete test mapping"]
        P3["**Auto-discovery:**<br/>src/domain/*/entity.py"]
        P4["**Validated by:**<br/>test_aggregate_isolation.py"]

        P1 ~~~ P2 ~~~ P3 ~~~ P4
    end

    subgraph BAD_RULE ["AGREGATES.md — 6.8K chars"]
        direction TB
        B1["**paths:** src/domain/**"]
        B2["Aggregate is a transactional<br/>boundary... <i>(textbook)</i>"]
        B3["One aggregate = one<br/>transaction <i>(generic DDD)</i>"]
        B4["Zero references to actual<br/>project files or tests"]

        B1 ~~~ B2 ~~~ B3 ~~~ B4
    end

    style GOOD_RULE fill:#d4edda,stroke:#28a745,color:#000
    style BAD_RULE fill:#f8d7da,stroke:#dc3545,color:#000
    style P1 fill:#fff,stroke:#28a745,color:#000
    style P2 fill:#fff,stroke:#28a745,color:#000
    style P3 fill:#fff,stroke:#28a745,color:#000
    style P4 fill:#fff,stroke:#28a745,color:#000
    style B1 fill:#fff,stroke:#dc3545,color:#000
    style B2 fill:#fff,stroke:#dc3545,color:#000
    style B3 fill:#fff,stroke:#dc3545,color:#000
    style B4 fill:#fff,stroke:#dc3545,color:#000
```

| Trait | Good rule | Bad rule |
|-------|-----------|----------|
| **Scope** | Narrow `paths:` matching specific dirs | Broad `src/**/*.py` catch-all |
| **Content** | References real files, test IDs, conventions | Restates textbook definitions |
| **Testability** | Maps to executable tests (R1, UT1, etc.) | No way to verify compliance |
| **Uniqueness** | Information Claude can't derive from code | Knowledge already in model weights |

---

## Where to Put It

```mermaid
flowchart TD
    Q["New convention<br/>to document"] --> L{"How long?"}

    L -->|"1-3 lines"| CMD["**CLAUDE.md**<br/>Always loaded, brief conventions"]
    L -->|"Multi-section<br/>document"| S{"Needs path<br/>scoping?"}

    S -->|YES| RULE["**.claude/rules/**<br/>Loaded only for matching files"]
    S -->|NO| CMD

    CMD --> E1["'We use DDD with aggregates<br/>in src/domain/'"]
    RULE --> E2["'R1-R5 architecture tests,<br/>auto-discovery via entity.py,<br/>validation matrix...'"]

    style CMD fill:#fff3cd,stroke:#ffc107,color:#000
    style RULE fill:#d4edda,stroke:#28a745,color:#000
    style E1 fill:#fff,stroke:#ffc107,color:#000
    style E2 fill:#fff,stroke:#28a745,color:#000
    style Q fill:#e7e7ff,stroke:#6c5ce7,color:#000
```

---

## Paths Scoping

`paths:` frontmatter controls when a rule activates. Narrow paths = rule loads less often = fewer wasted tokens.

```mermaid
---
config:
  themeVariables:
    fontSize: 14px
---
xychart-beta
    title "Rule activation frequency by scope width"
    x-axis ["tests/arch/test_agg*", "src/domain/**", "src/**/*.py", "**/*"]
    y-axis "Activations per day" 0 --> 100
    bar [3, 20, 80, 100]
```

| Scope | Loads for | When to use |
|-------|-----------|-------------|
| `tests/architecture/test_aggregate_*` | 3 files | Rule about one specific test |
| `src/domain/**` | ~20 files | DDD domain rules |
| `src/**/*.py` | ~80 files | Truly universal Python rules |
| `**/*` | Everything | Almost never appropriate |

> **Rule of thumb:** if your rule is about `src/domain/`, don't scope it to `src/**/*.py`.

---

## Audit Checklist

Run this quarterly on your `.claude/rules/` directory:

```bash
# Measure total token weight
find .claude/rules/ -name '*.md' -exec cat {} + | wc -c
```

| Check | If NO... |
|-------|----------|
| References specific files, tests, or conventions of THIS project? | Candidate for deletion |
| Would Claude produce wrong code without it? | Delete — it's confirmation bias |
| Is `paths:` scope as narrow as possible? | Tighten it |
| Could a one-liner in CLAUDE.md replace it? | Move and delete the file |
| Is the file > 5K chars? | Split or condense |
| Is the file unique (not duplicating another rule)? | Merge them |

> **Target: < 80K chars total.** Above 150K you're almost certainly paying for textbook knowledge.

---

## Summary

```mermaid
mindmap
  root(("Effective<br/>Rules"))
    **Rules are tokens**
      Every char loads on every matching request
      Treat rules like production code
      Review, optimize, delete
    **Model knows textbooks**
      DDD, SOLID, 12-factor, Fowler
      Only document YOUR decisions
      If it's on Wikipedia — skip it
    **Concrete > Generic**
      Reference real files and test IDs
      "R1 validates isolation" beats<br/>"aggregates should be isolated"
    **Narrow paths**
      Scope to files they affect
      src/domain/** not src/**/*.py
    **CLAUDE.md for one-liners**
      Brief conventions go there
      Only contracts need rule files
    **Audit regularly**
      Rules accumulate like tech debt
      Measure chars quarterly
      Target under 80K
```
