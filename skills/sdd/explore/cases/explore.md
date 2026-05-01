# Test: sdd:explore

## Case: with-openspec-context
stub: with-openspec
semantic:
  - explore_mode: skill enters explore mode and references existing changes as context
  - thinking_partner: output reads as a clarification dialog, not a directive plan

## Case: fresh-repo-no-context
stub: fresh-repo
semantic:
  - exploration_starts: skill can start exploration even without prior changes
  - prompt_for_idea: output asks the user to articulate the idea or problem to explore
