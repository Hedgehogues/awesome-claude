#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${1:?Usage: bump-namespace.sh <namespace>}"
REPO="git@github.com:Hedgehogues/awesome-claude.git"
CLAUDE_DIR="${CLAUDE_DIR:-$(pwd)/.claude}"
VERSIONS_FILE="$CLAUDE_DIR/.versions"

# Resolve latest tag from remote
echo "Fetching latest version for namespace '$NAMESPACE'..."
LATEST_TAG=$(git ls-remote --tags --sort=-v:refname "$REPO" \
  | grep -oE 'refs/tags/[^{}]+$' \
  | head -1 \
  | sed 's|refs/tags/||')

if [ -z "$LATEST_TAG" ]; then
  echo "ERROR: could not resolve latest tag from $REPO" >&2
  exit 1
fi

echo "Latest tag: $LATEST_TAG"

# Check currently installed version
INSTALLED=$(grep "^${NAMESPACE}=" "$VERSIONS_FILE" 2>/dev/null | cut -d= -f2 || echo "")
if [ "$INSTALLED" = "$LATEST_TAG" ]; then
  echo "$NAMESPACE is already at $LATEST_TAG — nothing to do."
  exit 0
fi

# Clone to temp
TMPDIR=$(mktemp -d)
trap "rm -rf '$TMPDIR'" EXIT

git clone --depth 1 -b "$LATEST_TAG" "$REPO" "$TMPDIR/ac" --quiet

# Validate namespace exists
MANIFEST="$TMPDIR/ac/skills/$NAMESPACE/.manifest"
if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: namespace '$NAMESPACE' not found in awesome-claude@$LATEST_TAG" >&2
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
  sed -i '' "s|^${NAMESPACE}=.*|${NAMESPACE}=${LATEST_TAG}|" "$VERSIONS_FILE"
else
  echo "${NAMESPACE}=${LATEST_TAG}" >> "$VERSIONS_FILE"
fi

echo "Updated $NAMESPACE → $LATEST_TAG"

# Handle dependencies
for DEP in $DEPS; do
  DEP_INSTALLED=$(grep "^${DEP}=" "$VERSIONS_FILE" 2>/dev/null | cut -d= -f2 || echo "")
  if [ "$DEP_INSTALLED" != "$LATEST_TAG" ]; then
    echo "Dependency '$DEP' is at '$DEP_INSTALLED', updating..."
    CLAUDE_DIR="$CLAUDE_DIR" bash "$0" "$DEP"
  else
    echo "Dependency '$DEP' already at $LATEST_TAG — ok."
  fi
done
