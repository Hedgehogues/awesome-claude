# Skill Design Principles

How to write efficient, high-quality Claude Code skills.

---

## Architecture

```mermaid
flowchart TD
    A["🎯 User types <b>/skill</b>"] --> B["⚡ Preprocessor"]
    B -- "!·command· runs<br/>before LLM sees prompt" --> C["📋 Frontmatter parsed"]
    C --> D{"context field?"}
    D -- "none (default)" --> E["💬 <b>INLINE</b><br/>Prompt injected into<br/>current conversation"]
    D -- "context: fork" --> F["🔀 <b>SUBAGENT</b><br/>Isolated subprocess<br/>own context window"]
    E --> G["🤖 LLM executes skill"]
    F --> G
    G -- "allowed-tools:<br/>auto-approved" --> H["🔧 Tool calls"]
    H --> I{"Hooks?"}
    I -- "PreToolUse" --> J["🛡️ Script validates<br/>allow / deny"]
    J --> H
    I -- "no hooks" --> K["✅ Result"]
    H --> K

    style A fill:#4A90D9,color:#fff
    style B fill:#F5A623,color:#fff
    style E fill:#7ED321,color:#fff
    style F fill:#BD10E0,color:#fff
    style G fill:#4A90D9,color:#fff
    style J fill:#D0021B,color:#fff
    style K fill:#7ED321,color:#fff
```

---

## Frontmatter Reference

```yaml
---
name: skill-name                    # slash command name
description: >                      # shown in /skills menu + used for auto-matching
  One paragraph explaining what     # be specific — Claude uses this to decide
  the skill does.                   # whether to auto-invoke

# --- Execution ---
model: haiku | opus | sonnet        # LLM to use (default: session model)
context: fork                       # omit for inline (default), fork for subagent
allowed-tools: Bash(git *), Read    # tools that skip user approval (not a restriction)

# --- Invocation ---
argument-hint: "[what args look like]"   # shown in /skills menu
disable-model-invocation: true           # Claude won't auto-invoke (only user /name)
user-invocable: false                    # hidden from / menu (only Claude can trigger)

# --- Scoping ---
paths:                              # only activate when editing matching files
  - "src/domain/**"

# --- Hooks ---
hooks:
  PreToolUse:
    - matcher: "Bash"               # tool name to intercept
      hooks:
        - type: command
          command: "${CLAUDE_SKILL_DIR}/scripts/check.sh"

# --- Other ---
shell: bash                         # bash (default) or powershell
---
```

### Variable Substitutions

| Variable | Resolves To |
|---|---|
| `$ARGUMENTS` | Everything after `/skill-name ` |
| `$0`, `$1`, ... | Positional arguments |
| `${CLAUDE_SESSION_ID}` | Current session ID |
| `${CLAUDE_SKILL_DIR}` | Absolute path to this skill's directory |
| `` !`command` `` | Shell output (runs before LLM sees the prompt) |

---

## Principles

### 1. Inline by Default

```mermaid
flowchart LR
    subgraph default ["✅ Default — no context field"]
        direction TB
        A1["Prompt injected into<br/>current conversation"] --> A2["Sees full history"]
        A2 --> A3["Zero overhead"]
        A3 --> A4["Shares tools & state"]
    end

    subgraph fork ["context: fork"]
        direction TB
        B1["Isolated subprocess"] --> B2["Own context window"]
        B2 --> B3["Cannot see history"]
        B3 --> B4["Returns single message"]
    end

    default ~~~ fork

    style default fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style fork fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
```

Use `context: fork` **only** when:
- The skill produces massive output that would pollute the conversation
- The skill must run in parallel with other work
- The skill needs isolation from prior context

### 2. Precompute with `!`command``

```mermaid
flowchart LR
    subgraph before ["❌ Without precompute"]
        direction TB
        X1["LLM asks to check structure"] --> X2["→ Bash: ls packages/..."]
        X2 --> X3["← result"]
        X3 --> X4["→ Bash: ls tests/..."]
        X4 --> X5["← result"]
        X5 --> X6["→ Bash: git log ..."]
        X6 --> X7["← result"]
        X7 --> X8["3 round trips ⏱️"]
    end

    subgraph after ["✅ With precompute"]
        direction TB
        Y1["!·ls packages/*/...·"] --> Y2["!·ls -d tests/*/·"]
        Y2 --> Y3["!·git log --oneline -5·"]
        Y3 --> Y4["Data already in prompt"]
        Y4 --> Y5["0 tool calls ⚡"]
    end

    before ~~~ after

    style before fill:#FFEBEE,stroke:#F44336,stroke-width:2px
    style after fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style X8 fill:#F44336,color:#fff
    style Y5 fill:#4CAF50,color:#fff
```

**Rules:**
- Only fast commands: `ls`, `git log`, `git status`, `git diff --stat`, `cat`
- Never slow commands: `docker compose`, `npm`, `uv run`, `curl`
- Always add `2>/dev/null` — errors produce confusing prompt text
- Label the section `(предвычислено)` and tell LLM "already above — don't call again"

### 3. Right-Size the Model

```mermaid
quadrantChart
    title Model Selection by Task Complexity
    x-axis "Simple workflow" --> "Creative reasoning"
    y-axis "Templated output" --> "Open-ended output"
    quadrant-1 "Opus"
    quadrant-2 "Sonnet"
    quadrant-3 "Haiku"
    quadrant-4 "Sonnet"
    "commit": [0.2, 0.15]
    "deploy": [0.15, 0.1]
    "describe": [0.25, 0.3]
    "test-all": [0.3, 0.2]
    "session-report": [0.2, 0.25]
    "fix-tests": [0.5, 0.4]
    "dead-features": [0.55, 0.45]
    "tdd": [0.75, 0.7]
    "tracing": [0.7, 0.75]
    "triz": [0.85, 0.85]
    "ui": [0.8, 0.8]
    "arch-gap": [0.9, 0.7]
```

| Model | When to Use | Effort Levels |
|---|---|---|
| **Haiku** | Explicit steps, templated output, no creative reasoning | Not supported |
| **Sonnet** | Code analysis, classification, moderate reasoning | low / medium / high |
| **Opus** | Multi-step reasoning, architecture, creative problem-solving | low / medium / high / max |
| **(none)** | Inherit session model — let the user decide | — |

### 4. Whitelist Tools with `allowed-tools`

```mermaid
flowchart TD
    A["Tool call requested"] --> B{"In allowed-tools?"}
    B -- "Yes" --> C["✅ Auto-approved<br/>no user prompt"]
    B -- "No" --> D["⏸️ User prompted<br/>for approval"]
    D -- "Approved" --> E["✅ Executed"]
    D -- "Denied" --> F["❌ Blocked"]

    style C fill:#4CAF50,color:#fff
    style D fill:#FF9800,color:#fff
    style F fill:#F44336,color:#fff
```

> **`allowed-tools` is a whitelist, not a restriction.** Unlisted tools are still available — they just require user approval.

| Skill | allowed-tools | Principle |
|---|---|---|
| `/commit` | `Bash(git *), Read, Grep` | Git operations only |
| `/deploy` | `Bash(docker *), Bash(curl *), Read, Glob` | Docker + health checks |
| `/describe` | `Bash(git diff *), Bash(git log *), Read` | Read-only git |
| `/test-all` | `Bash(uv *), Bash(npx *), Bash(npm *), Bash(docker *), Bash(ls *), Glob, Read` | Test runners + discovery |
| `/session-report` | *(none)* | Works from conversation context |

**Principle of least privilege:** `Bash(git diff *)` not `Bash(git *)` if the skill only reads.

### 5. Enforce Constraints with Hooks

```mermaid
flowchart LR
    subgraph soft ["⚠️ Prompt-level"]
        direction TB
        S1["'НЕ используй git'"] --> S2["LLM might ignore"]
        S2 --> S3["No enforcement"]
    end

    subgraph hard ["🛡️ Hook-level"]
        direction TB
        H1["PreToolUse hook"] --> H2["Script checks command"]
        H2 --> H3{"git command?"}
        H3 -- "Yes" --> H4["BLOCKED ❌"]
        H3 -- "No" --> H5["Allowed ✅"]
    end

    soft ~~~ hard

    style soft fill:#FFF3E0,stroke:#FF9800,stroke-width:2px
    style hard fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
    style H4 fill:#F44336,color:#fff
    style H5 fill:#4CAF50,color:#fff
```

Hook scripts live in `${CLAUDE_SKILL_DIR}/scripts/` and receive JSON on stdin:

```json
{
  "eventType": "PreToolUse",
  "tool": "Bash",
  "tool_input": { "command": "git status" }
}
```

To deny, output:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Reason shown to Claude"
  }
}
```

### 6. Compress Prompts

```mermaid
mindmap
  root((Prompt<br/>Budget))
    ✂️ CUT
      Role-play wrappers
      Duplicates with CLAUDE.md
      Comments inside bash blocks
      Repeated instructions
      Verbose explanations
    ✅ KEEP
      Output format examples
      Good/bad examples
      Decision tables
      Exact bash commands
      Constraints & rules
    📊 Target
      -40% to -60% tokens
      Identical output quality
```

| What | Action | Why |
|---|---|---|
| "Ты — CI-оператор" | **Cut** | Role-play doesn't affect Haiku output |
| Monorepo structure description | **Cut** | Already in CLAUDE.md |
| `# comment` in bash blocks | **Cut** | LLM understands the command |
| Same rule in "Steps" and "Important" | **Cut** | Redundant — keep in one place |
| ASCII table example | **Keep** | Anchors exact output format |
| Good/bad output examples | **Keep** | Quality calibration |
| `uv run pytest --collect-only -q` | **Keep** | Exact syntax matters |

### 7. One Skill, One Job

```mermaid
flowchart LR
    subgraph mono ["❌ Monolithic — 500+ lines"]
        M1["discover"] --> M2["run tests"]
        M2 --> M3["format report"]
        M3 --> M4["generate summary"]
        M4 --> M5["suggest fixes"]
        M5 --> M6["create PR"]
    end

    subgraph compose ["✅ Composable — /pipe"]
        C1["/test-run"] --> C2["/test-report"]
        C2 --> C3["/describe"]
    end

    style mono fill:#FFEBEE,stroke:#F44336,stroke-width:2px
    style compose fill:#E8F5E9,stroke:#4CAF50,stroke-width:2px
```

If a skill exceeds **~200 lines**, consider splitting it into composable parts chainable via `/pipe`.

```
/pipe test-run,test-report,describe "Check everything"
```

Each skill: <150 lines, one clear responsibility.

---

## Checklist

Before shipping a new skill:

```mermaid
flowchart TD
    A["New skill idea"] --> B{"description specific<br/>enough?"}
    B -- "No" --> B1["Rewrite description"] --> B
    B -- "Yes" --> C{"model matches<br/>complexity?"}
    C -- "No" --> C1["Change model"] --> C
    C -- "Yes" --> D{"context: fork<br/>justified?"}
    D -- "Not needed" --> D1["Remove context field"] --> D
    D -- "Yes / absent" --> E{"allowed-tools<br/>minimal?"}
    E -- "Too broad" --> E1["Narrow scope"] --> E
    E -- "Yes" --> F{"!·command· for<br/>fast context?"}
    F -- "Missing" --> F1["Add precompute"] --> F
    F -- "Done" --> G{"prompt < 150<br/>lines?"}
    G -- "Too long" --> G1["Compress / split"] --> G
    G -- "Yes" --> H{"output format<br/>has example?"}
    H -- "No" --> H1["Add template"] --> H
    H -- "Yes" --> I{"constraints via<br/>hooks?"}
    I -- "Prompt only" --> I1["Add hook script"] --> I
    I -- "Done" --> J["✅ Ship it!"]

    style J fill:#4CAF50,color:#fff,stroke-width:3px
    style A fill:#4A90D9,color:#fff
```

---

## Example: Minimal Skill

```yaml
---
name: changelog
description: >
  Generate changelog entry from recent commits.
  Groups by type (feat/fix/refactor), writes in past tense.
argument-hint: "[optional: version tag, e.g. 'v1.2.0']"
model: haiku
allowed-tools: Bash(git log *), Read
---
```

```markdown
# Задача

Сгенерируй changelog. $ARGUMENTS

## Контекст (предвычислено)

### Коммиты с последнего тега
!`git log $(git describe --tags --abbrev=0 2>/dev/null || echo HEAD~20)..HEAD --oneline 2>/dev/null`

## Формат

### [version] — YYYY-MM-DD

**Added**
- feat: description

**Fixed**
- fix: description

**Changed**
- refactor: description

## Правила

- Группируй по типу из commit message prefix
- Пиши в прошедшем времени
- Один bullet = один коммит
- Пропускай merge-коммиты и CI-фиксы
```

~30 lines. Precomputed context. Clear output template. Haiku handles this perfectly.
