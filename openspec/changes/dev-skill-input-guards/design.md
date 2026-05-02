# Design: Fix Input Guards in dev:* Skills

## Context

Скиллы в `skills/dev/` и `skills/skill/` имеют две категории проблем:

1. **Отсутствие guards** — скилл стартует без проверки предусловий или пустого ввода
2. **Ошибки тест-спеки** — кейс привязан не к тому скиллу или стаб не триггерит проверяемое поведение

## Goals / Non-Goals

**Goals:**
- Добавить guard на пустой `$ARGUMENTS` в fix-bug, tdd, tracing
- Добавить early-exit в bump-version (нет `.versions`) и commit (нечего коммитить)
- Добавить `!git branch --show-current` в init-repo
- Перенести кейс `index-yaml-update` из archive → apply
- Дополнить стаб `change-with-sdd-yaml` реальным содержимым `tasks.md`

**Non-Goals:**
- Не менять логику скиллов за пределами guard/early-exit
- Не добавлять новые кейсы в dev:* (кроме переноса)

## Decisions

### D1: Guard на пустой $ARGUMENTS — единый паттерн

Для fix-bug, tdd, tracing добавить в начало тела скилла:

```
Если $ARGUMENTS пустой → спроси пользователя:
"Опиши [баг/фичу/цель трассировки] — без этого скилл не может начать."
Завершись. Не запускай дальнейшие шаги.
```

**Why:** Единообразие guard'ов снижает когнитивную нагрузку при чтении скиллов.

### D2: bump-version — проверить .versions до запуска скрипта

Добавить перед `bash "${CLAUDE_SKILL_DIR}/scripts/bump-namespace.sh" dev`:

```
Проверь наличие `.versions` в `.claude/`:
если отсутствует → сообщи "Missing prerequisite: .versions not found" и завершись.
```

**Why:** Скрипт сам не защищён от отсутствия `.versions` — пишет файлы при любом состоянии.

### D3: commit — early-exit по git status

После `!git status --short` добавить:

```
Если статус пустой или содержит только `??` строки (только untracked) →
сообщи "Nothing to commit — no staged or modified files." и завершись.
```

**Why:** Создание плана коммита при нулевых изменениях вводит пользователя в заблуждение.

### D4: init-repo — добавить ветку в контекст

Добавить `!git branch --show-current` в frontmatter или в начало тела скилла как pre-computed context.

**Why:** Кейс `branch_aware` ожидает, что скилл знает текущую ветку и не запускает `git init` заново.

### D5: Стаб change-with-sdd-yaml — добавить задачи в tasks.md

В `skills/skill/test-skill/stubs/change-with-sdd-yaml.md` в поле `change_files.my-feature`:

```yaml
tasks.md: |
  ## 1. Реализация
  - [ ] Создать файл `src/my_capability.py`
  - [ ] Запустить и убедиться что вывод корректен
```

Первая задача тригерит `missing-artifact-gaps-found` (файл не существует в стабе).
Вторая — `human-needed-task` (требует live-запуска).

## Risks / Trade-offs

- **Risk (D1):** guard прерывает скилл раньше — пользователи, привыкшие к автоматическому старту, получат вопрос. Допустимо: явный ввод лучше, чем бессмысленный анализ.
- **Risk (D5):** изменение стаба может сломать другие кейсы, которые используют `change-with-sdd-yaml`. Нужно проверить все зависимые кейсы.
