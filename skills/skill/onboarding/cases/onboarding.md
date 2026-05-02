## Case: positive-happy-onboarding-fresh-no-setup
stub: fresh-repo
# Pre-condition: .claude/skills не симлинк (свежий клон без setup)
contains:
  - "contributor workflow"
  - "/skill:setup"
  - "Next recommended step"
semantic:
  - highlights_setup: скилл выделяет шаг 1 (/skill:setup) как next step
  - shows_full_path: вывод перечисляет все 9 шагов workflow

## Case: positive-corner-onboarding-active-change
stub: change-with-sdd-yaml
# Pre-condition: симлинки на месте + есть активный change в openspec/changes/
contains:
  - "Active changes"
  - "/sdd:apply"
semantic:
  - lists_changes: имена существующих change'ей выводятся в отчёте
  - highlights_apply: next step — apply или test, не setup

## Case: negative-missing-input-onboarding-not-in-repo
stub: fresh-repo
# Pre-condition: вызов в директории без skills/ commands/ rules/ (не репа awesome-claude)
contains:
  - "contributor workflow"
semantic:
  - shows_workflow_anyway: скилл показывает полный workflow для информирования (не падает)
  - notes_not_in_repo: вывод содержит indication что setup не применим (или next step = setup но с предупреждением)

## Case: negative-invalid-input-onboarding-no-auto-invoke
stub: fresh-repo
contains:
  - "does NOT auto-invoke"
semantic:
  - no_skill_calls: вывод skill'а не содержит фактического запуска /skill:setup или другого скилла
  - guidance_only: только текст-рекомендация
