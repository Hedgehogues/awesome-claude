#!/usr/bin/env bash
set -euo pipefail

REPO="git@github.com:Hedgehogues/awesome-claude.git"
BRANCH="release-0.6.0"
TARGET=".claude"

# Scenario 1: fresh install
if [ ! -d "$TARGET" ]; then
  git clone -b "$BRANCH" "$REPO" "$TARGET"
  echo "Installed awesome-claude → .claude/"
  exit 0
fi

# Scenario 2: .claude/ is an existing awesome-claude clone → update
if [ -d "$TARGET/.git" ]; then
  REMOTE=$(git -C "$TARGET" remote get-url origin 2>/dev/null || echo "")
  if echo "$REMOTE" | grep -q "awesome-claude"; then
    git -C "$TARGET" fetch origin
    git -C "$TARGET" checkout "$BRANCH"
    git -C "$TARGET" pull origin "$BRANCH"
    echo "Updated awesome-claude to $BRANCH"
    exit 0
  fi
fi

# Fail-fast: .claude/ exists but is not awesome-claude
cat >&2 <<EOF
ERROR: .claude/ already exists and is not an awesome-claude installation.

To install manually, copy the needed namespaces from:
  https://github.com/Hedgehogues/awesome-claude/tree/$BRANCH

  skills/dev/      → .claude/skills/dev/       (safe, no conflicts)
  skills/report/   → .claude/skills/report/    (safe, no conflicts)
  skills/research/ → .claude/skills/research/  (safe, no conflicts)
  skills/sdd/      → .claude/skills/sdd/       (check: conflicts if sdd:* already defined)
  rules/           → .claude/rules/            (check filenames manually)

  CLAUDE.md and settings.json — merge manually.
EOF
exit 1
