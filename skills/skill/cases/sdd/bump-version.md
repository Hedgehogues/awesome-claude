# Test: sdd:bump-version

## Case: happy-path-with-versions
stub: with-openspec
semantic:
  - script_invoked: skill calls `bump-namespace.sh sdd` from `${CLAUDE_SKILL_DIR}/scripts/`
  - dependency_resolution: output indicates dependency check across `.versions` / `.manifest` for sdd namespace
  - bump_completes: skill exits cleanly without manual intervention

## Case: edge-missing-versions
stub: fresh-repo
semantic:
  - missing_versions: when `.versions` file is absent, skill reports missing prerequisite
  - no_destructive: skill does not modify state without `.versions`
