#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${1:?Usage: bump-namespace.sh <namespace> [<ref>]}"
REF="${2:-}"
REPO="git@github.com:Hedgehogues/awesome-claude.git"
CLAUDE_DIR="${CLAUDE_DIR:-$(pwd)/.claude}"
VERSIONS_FILE="$CLAUDE_DIR/.versions"

if [ -n "$REF" ]; then
  TARGET="$REF"
  echo "Using explicit ref: $TARGET"
else
  echo "Fetching latest tag for namespace '$NAMESPACE'..."
  TARGET=$(git ls-remote --tags --sort=-v:refname "$REPO" \
    | grep -oE 'refs/tags/[^{}]+$' \
    | head -1 \
    | sed 's|refs/tags/||')
  if [ -z "$TARGET" ]; then
    echo "ERROR: could not resolve latest tag from $REPO" >&2
    exit 1
  fi
  echo "Latest tag: $TARGET"
fi

# Check currently installed version
INSTALLED=$(grep "^${NAMESPACE}=" "$VERSIONS_FILE" 2>/dev/null | cut -d= -f2 || echo "")
if [ "$INSTALLED" = "$TARGET" ] && [ -z "$REF" ]; then
  echo "$NAMESPACE is already at $TARGET — nothing to do."
  exit 0
fi

# Clone to temp (works for both tags and branches with -b)
TMPDIR=$(mktemp -d)
trap "rm -rf '$TMPDIR'" EXIT

git clone --depth 1 -b "$TARGET" "$REPO" "$TMPDIR/ac" --quiet

# Validate namespace exists
MANIFEST="$TMPDIR/ac/skills/$NAMESPACE/.manifest"
if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: namespace '$NAMESPACE' not found in awesome-claude@$TARGET" >&2
  exit 1
fi

# Read dependencies
DEPS=$(grep '^depends_on:' "$MANIFEST" \
  | sed 's/depends_on: *\[//;s/\]//' \
  | tr ',' '\n' \
  | tr -d ' "' \
  | grep -v '^$' || true)

# Update namespace files
rm -rf "$CLAUDE_DIR/skills/$NAMESPACE"
rm -rf "$CLAUDE_DIR/commands/$NAMESPACE"
cp -r "$TMPDIR/ac/skills/$NAMESPACE" "$CLAUDE_DIR/skills/"
[ -d "$TMPDIR/ac/commands/$NAMESPACE" ] && cp -r "$TMPDIR/ac/commands/$NAMESPACE" "$CLAUDE_DIR/commands/"

# Write version
touch "$VERSIONS_FILE"
if grep -q "^${NAMESPACE}=" "$VERSIONS_FILE" 2>/dev/null; then
  sed -i '' "s|^${NAMESPACE}=.*|${NAMESPACE}=${TARGET}|" "$VERSIONS_FILE"
else
  echo "${NAMESPACE}=${TARGET}" >> "$VERSIONS_FILE"
fi

echo "Updated $NAMESPACE → $TARGET"

# Handle dependencies (propagate same ref if explicit)
for DEP in $DEPS; do
  DEP_INSTALLED=$(grep "^${DEP}=" "$VERSIONS_FILE" 2>/dev/null | cut -d= -f2 || echo "")
  if [ "$DEP_INSTALLED" != "$TARGET" ]; then
    echo "Dependency '$DEP' is at '$DEP_INSTALLED', updating to $TARGET..."
    CLAUDE_DIR="$CLAUDE_DIR" bash "$0" "$DEP" "$REF"
  else
    echo "Dependency '$DEP' already at $TARGET — ok."
  fi
done
