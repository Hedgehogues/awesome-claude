## Case: positive-happy-setup-fresh-repo
stub: fresh-repo
contains:
  - "linked"
  - "skill:setup completed"
semantic:
  - symlinks_created: output confirms .claude/skills, .claude/commands, .claude/rules are symlinks to $(pwd)/<dir>

## Case: positive-corner-setup-already-linked
stub: fresh-repo
# Pre-condition: симлинки уже существуют (из предыдущего run); проверяется идемпотентность
contains:
  - "Already linked"
semantic:
  - idempotent: повторный вызов skill:setup не модифицирует диск, выводит сообщение Already linked для существующих симлинков

## Case: negative-missing-input-setup-not-in-repo
stub: fresh-repo
# Pre-condition: вызов вне awesome-claude репы (нет skills/, commands/, rules/)
contains:
  - "not in awesome-claude repo root"
semantic:
  - early_exit: скилл останавливается с явным сообщением, не создаёт .claude/ директорию

## Case: negative-invalid-input-setup-real-dir-without-confirm
stub: fresh-repo
# Pre-condition: .claude/skills существует как обычная директория с файлами
contains:
  - "exists as a real directory"
semantic:
  - asks_confirmation: скилл выводит warning и требует подтверждения перед заменой
  - no_silent_replace: без подтверждения реальная директория не заменяется
