#!/bin/bash
# Block git commands in session-report skill

COMMAND=$(jq -r '.tool_input.command' 2>/dev/null)

if [[ "$COMMAND" =~ ^git ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Git commands are blocked in session-report. Use conversation context instead."
    }
  }'
  exit 0
fi

exit 0
