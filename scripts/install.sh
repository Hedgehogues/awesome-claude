#!/usr/bin/env bash
set -euo pipefail

REPO="git@github.com:Hedgehogues/awesome-claude.git"
BRANCH="release-0.6.0"
TARGET=".claude"

ALL_COMPONENTS="dev report research sdd rules"
DEV_COMPONENTS="skill"

usage() {
  cat >&2 <<'EOF'
Usage: install.sh [--dev] [component ...]

Installs awesome-claude components into .claude/

Components:
  dev       /dev:* skills (tdd, commit, deploy, tracing, ...)
  report    /report:* skills (describe, session-report)
  research  /research:* skills (triz)
  sdd       /sdd:* skills (spec-driven development)
  rules     architecture and workflow rules

Flags:
  --dev     also install dev-only namespaces (test:*)

If no components are given, everything is installed.

Examples:
  install.sh                    # install everything
  install.sh dev sdd            # install only dev and sdd
  install.sh rules              # install only rules
  install.sh --dev              # install everything + test:* skills
  install.sh --dev dev sdd      # install dev, sdd + test:* skills

Piped install:
  curl -fsSL https://raw.githubusercontent.com/Hedgehogues/awesome-claude/release-0.6.0/scripts/install.sh | bash
  curl -fsSL https://raw.githubusercontent.com/Hedgehogues/awesome-claude/release-0.6.0/scripts/install.sh | bash -s -- dev sdd
  curl -fsSL https://raw.githubusercontent.com/Hedgehogues/awesome-claude/release-0.6.0/scripts/install.sh | bash -s -- --dev
EOF
  exit 1
}

# Parse arguments
DEV_MODE=false
POSITIONAL=()

for arg in "$@"; do
  case "$arg" in
    --dev)       DEV_MODE=true ;;
    -h|--help)   usage ;;
    -*)          echo "ERROR: Unknown flag '$arg'" >&2; usage ;;
    *)           POSITIONAL+=("$arg") ;;
  esac
done

if [[ ${#POSITIONAL[@]} -eq 0 ]]; then
  INSTALL_ALL=true
  IFS=' ' read -ra COMPONENTS <<< "$ALL_COMPONENTS"
else
  INSTALL_ALL=false
  COMPONENTS=("${POSITIONAL[@]}")
  for comp in "${COMPONENTS[@]}"; do
    if [[ ! " $ALL_COMPONENTS " =~ " $comp " ]]; then
      echo "ERROR: Unknown component '$comp'. Valid: $ALL_COMPONENTS" >&2
      exit 1
    fi
  done
fi

# Clone to temp
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "Fetching awesome-claude ($BRANCH)..."
git clone --quiet --depth=1 -b "$BRANCH" "$REPO" "$TMP"

mkdir -p "$TARGET"

# Always install scripts
cp -r "$TMP/scripts" "$TARGET/"

# Install docs only for full install
if $INSTALL_ALL; then
  cp -r "$TMP/docs" "$TARGET/" 2>/dev/null || true
fi

# Read version from a namespace manifest
VERSION=$(grep '^version:' "$TMP/skills/dev/.manifest" 2>/dev/null | awk '{print $2}' | tr -d '"' || echo "$BRANCH")

VERSIONS_FILE="$TARGET/.versions"
touch "$VERSIONS_FILE"

install_namespace() {
  local ns="$1"
  rm -rf "$TARGET/skills/$ns" "$TARGET/commands/$ns"
  mkdir -p "$TARGET/skills" "$TARGET/commands"
  [[ -d "$TMP/skills/$ns" ]] && cp -r "$TMP/skills/$ns" "$TARGET/skills/"
  [[ -d "$TMP/commands/$ns" ]] && cp -r "$TMP/commands/$ns" "$TARGET/commands/"
  if grep -q "^${ns}=" "$VERSIONS_FILE" 2>/dev/null; then
    sed -i '' "s|^${ns}=.*|${ns}=${VERSION}|" "$VERSIONS_FILE"
  else
    echo "${ns}=${VERSION}" >> "$VERSIONS_FILE"
  fi
}

echo "Installing:"
for comp in "${COMPONENTS[@]}"; do
  case "$comp" in
    rules)
      rm -rf "$TARGET/rules"
      cp -r "$TMP/rules" "$TARGET/"
      echo "  rules"
      ;;
    dev|report|research|sdd)
      install_namespace "$comp"
      echo "  $comp ($VERSION)"
      ;;
  esac
done

if $DEV_MODE; then
  for ns in $DEV_COMPONENTS; do
    install_namespace "$ns"
    echo "  $ns ($VERSION)  [dev]"
  done
fi

echo ""
echo "awesome-claude → $TARGET/"
$DEV_MODE && echo "(dev mode: test:* skills included)"
true
