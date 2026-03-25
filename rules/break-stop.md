---
paths:
  - "**/*"
---

# Break-Stop Rule

## Rule

If any change breaks existing tests, lint, or type checks — **STOP immediately. No exceptions.**

Do NOT continue implementing further steps. Do NOT batch the fix with the next step. Do NOT make autonomous decisions about how to fix broken functionality.

## Protocol

1. Run `make check` (or equivalent) after every logical change
2. If it fails — **output the red alert banner** (see below) and STOP
3. **ASK THE USER** what to do. You do NOT have authority to fix broken functionality on your own
4. Wait for explicit user instructions before making any further changes
5. Only resume the original plan after `make check` is fully green and user confirms
6. Never assume a broken state is acceptable even temporarily

## Proactive Protection

If the user requests a change that will **predictably break existing logic, tests, or contracts** — do NOT silently apply it. Instead:

1. Output the **red alert banner** (see below) BEFORE applying the change
2. Explain what will break and why
3. Ask for **explicit confirmation** before proceeding
4. Only apply the change after the user says "да" / "давай" / confirms directly

This applies even when the user explicitly asked for the change. The user may not be aware of all side effects.

## Severity Levels

### Formatting / import fixes (trivial)
Ruff auto-fix, black reformatting, unused import removal — fix silently, re-run check.

### Broken functionality (HARD STOP)
Failed tests, type errors, logic errors, missing functions, wrong behavior — **this is a red flag. You MUST stop and ask the user.** You are NOT authorized to decide the fix yourself. The user decides.

## Red Alert Banner

Output this EXACTLY in both cases (breakage detected OR breakage predicted):

```
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🔴  BREAK DETECTED — EXECUTION STOPPED                          🔴
🔴  Awaiting user decision...                                    🔴
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
```

Then list:
- **What broke / will break:** (test name / type error / exact error message)
- **Likely cause:** (which change caused or will cause it)
- **Options:** (possible fixes or ways forward — but do NOT apply any without user approval)

## Rationale

A broken intermediate state compounds errors. Autonomous "fixes" to broken functionality can mask the real problem or introduce new ones. The user must be in the loop for any non-trivial repair. Proactive warnings prevent avoidable breakage.
