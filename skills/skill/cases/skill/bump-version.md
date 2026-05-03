## Case: positive-happy-bump-version-latest-tag
stub: fresh-repo
# Pre-condition: чистый .versions, latest tag v0.7.0 в remote
contains:
  - "Updated dev → v0.7.0"
  - "tag:v0.7.0@"
semantic:
  - installs_namespace: .claude/skills/dev/ содержит файлы
  - writes_versions: .versions содержит dev=tag:v0.7.0@<sha>

## Case: positive-corner-bump-version-already-installed
stub: fresh-repo
# Pre-condition: .versions содержит dev=tag:v0.7.0@<sha>, remote HEAD совпадает
contains:
  - "already at"
  - "nothing to do"
semantic:
  - no_update: файлы в .claude/skills/dev/ не перезаписаны

## Case: positive-happy-bump-ref-support-branch
stub: fresh-repo
# Pre-condition: bump-namespace.sh dev --ref release-0.7.0
contains:
  - "WARNING"
  - "not a release tag"
  - "Updated dev"
  - "branch:release-0.7.0@"
semantic:
  - warning_printed: WARNING присутствует в stdout
  - installs_from_branch: .claude/skills/dev/ содержит файлы из ветки

## Case: positive-happy-bump-ref-support-sha
stub: fresh-repo
# Pre-condition: bump-namespace.sh dev --ref a3f9c12
contains:
  - "WARNING"
  - "sha:a3f9c12"
semantic:
  - sha_format: .versions содержит dev=sha:<resolved>

## Case: negative-missing-input-bump-ref-deps-skipped
stub: fresh-repo
# Pre-condition: bump-namespace.sh sdd --ref release-0.7.0 (sdd имеет depends_on)
contains:
  - "dependency auto-update skipped"
semantic:
  - deps_not_updated: зависимые неймспейсы не обновлены

## Case: positive-happy-bump-full-namespace-copies-all
stub: fresh-repo
# Pre-condition: .manifest содержит namespaces: [skills/dev/, rules/dev/]
contains:
  - "Copied skills/dev/"
  - "Copied rules/dev/"
semantic:
  - full_copy: .claude/skills/dev/ и .claude/rules/dev/ оба присутствуют

## Case: negative-invalid-input-bump-full-namespace-missing-field
stub: fresh-repo
# Pre-condition: .manifest без поля namespaces:
contains:
  - "ERROR"
  - "missing namespaces: field"
semantic:
  - early_exit: скрипт завершается с ошибкой, ничего не копирует

## Case: positive-happy-claude-entry-point-first-install
stub: fresh-repo
# Pre-condition: CLAUDE.md не содержит секции awesome-claude
contains:
  - "Added awesome-claude section to CLAUDE.md"
  - "Updated .claude/awesome-claude/index.md"
semantic:
  - section_added: CLAUDE.md содержит ## awesome-claude
  - index_created: .claude/awesome-claude/index.md существует и содержит dev

## Case: positive-corner-claude-entry-point-no-duplicate
stub: fresh-repo
# Pre-condition: CLAUDE.md уже содержит ## awesome-claude
contains:
  - "Updated .claude/awesome-claude/index.md"
semantic:
  - no_duplicate: CLAUDE.md содержит ровно одну секцию ## awesome-claude

## Case: positive-happy-bump-namespace-versions-format
stub: fresh-repo
# Pre-condition: установка с тега v0.7.0
contains:
  - "tag:v0.7.0@"
semantic:
  - sha_recorded: значение в .versions содержит @ с SHA после него
  - sha_comparison: повторный запуск с тем же SHA выдаёт "nothing to do"
