---
paths:
  - "**/*"
---

# Git Conventions

## Commit Messages

Commit messages MUST be detailed and descriptive. Never write one-liners.

### Structure

```
[TASK-ID]: short summary (imperative mood, lowercase)

## What changed
- Bullet point for each meaningful change
- Include file names or areas affected
- Be specific: "added 5 integration tests" not "added tests"

## Why
- Motivation and context for the change
- What problem this solves or what requirement it fulfills
- Link to task/issue if applicable

## Details
- Implementation decisions and trade-offs
- Anything non-obvious a reviewer should know
- Side effects or things to watch out for
```

### Rules
- Title: `[TASK-ID]: <imperative verb> <what>` — max 72 chars
- Body: separated from title by blank line
- Always explain WHY, not just WHAT
- List every file or area touched with context
- Mention test coverage: what was tested, what edge cases covered
- If a decision was non-obvious, explain the reasoning

### Example

```
[TASK-ID]: add integration tests for OpenAI LLM client

## What changed
- Created tests/integration/test_llm_openai.py with 5 async tests
- test_analyze_returns_valid_result: happy path, checks MatchingResult structure
- test_strong_match_gets_high_score: Python resume vs Python vacancy, score >= 6
- test_weak_match_gets_low_score: cook vs Rust programmer, score <= 4
- test_user_answers_included_in_analysis: verifies answers dict passed to LLM
- test_response_is_valid_json_with_all_fields: validates all 4 required fields

## Why
- Unit tests mock AsyncOpenAI completely — no coverage of real API behavior
- Need to verify: JSON response format, field presence, score adequacy
- Catches regressions in system prompt or response_format handling

## Details
- All tests skip when OPENAI_API_KEY starts with "test-" (pytestmark)
- Soft thresholds (>= 6, <= 4) account for LLM non-determinism
- Each test creates own LLMClient — no shared state
- No changes to existing files
```
