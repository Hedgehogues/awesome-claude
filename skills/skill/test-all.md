---
name: skill:test-all
description: >
  Запускает все тесты скиллов. Обнаруживает тест-спеки в skills/skill/cases/,
  запускает каждый через логику test-skill, выводит сводную таблицу.
argument-hint: "[namespace]  — ограничить по неймспейсу"
model: sonnet
allowed-tools: Bash, Read, Agent, Glob
---

# Запуск всех тестов скиллов

$ARGUMENTS

## Контекст (предвычислено)

### Тест-спеки
!`find skills/skill/cases -name "*.md" 2>/dev/null | sort`

## Шаги

### 1. Определи список тестов

Из вывода `find` выше составь список файлов.

Если передан аргумент (имя неймспейса) — оставь только спеки из `skills/skill/cases/$ARGUMENTS/`.

Для каждого файла `skills/skill/cases/<ns>/<skill>.md` → тест `<ns>:<skill>`.

Если список пуст → `NO TESTS FOUND` и завершить.

### 2. Прогони каждый тест

Для каждого теста выполни логику из `skill:test-skill`:
- Создай изолированный `TMP`
- Прочитай спеку, выполни Setup, скопируй файлы скилла
- Запусти Agent с телом скилла (без frontmatter) + контекстом `Working directory: <TMP>`
- Проверь паттерны из `## Checks`
- Сохрани результат: PASS / FAIL / SKIP

### 3. Сводная таблица

```
=== TEST RESULTS ===

  sdd:help    PASSED (7/7)
  dev:commit  FAILED (2/4)  ← первый упавший паттерн

Total: N passed, M failed, K skipped
```

Если есть FAILED — вывести диагностику (первые 20 строк output агента) для каждого.

### 4. Вердикт

- 0 FAILED: `✅ ALL TESTS PASSED`
- Есть FAILED: `❌ FAILURES DETECTED — see above`
