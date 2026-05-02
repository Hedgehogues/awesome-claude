---
name: skill:test-all
description: >
  Запускает все тесты скиллов. Обнаруживает тест-спеки в skills/*/*/cases/,
  запускает каждый через логику test-skill, выводит сводную таблицу,
  проверяет TDD-coverage матрицу.
argument-hint: "[namespace]  — ограничить по неймспейсу"
model: sonnet
allowed-tools: Bash, Read, Agent, Glob
---

# Запуск всех тестов скиллов

$ARGUMENTS

## Контекст (предвычислено)

### Тест-спеки
!`find skills/*/*/cases -name "*.md" 2>/dev/null | sort`

## Шаги

### 1. Определи список тестов

Из вывода `find` выше составь список файлов.

Если передан аргумент (имя неймспейса) — оставь только спеки из `skills/$ARGUMENTS/*/cases/`.

Для каждого файла `skills/<ns>/<skill>/cases/<skill>.md` → тест `<ns>:<skill>`.

Если список пуст → `NO TESTS FOUND` и завершить.

### 2. Прогони каждый тест

Создай единый рабочий корень на весь прогон и зарегистрируй авто-cleanup:

```bash
RUN_ROOT=$(mktemp -d -t skill-test-all-XXXXXX)
trap "rm -rf '$RUN_ROOT'" EXIT
```

Для каждого теста выполни логику из `skill:test-skill`:
- Per-test TMP = `$RUN_ROOT/<ns>-<skill>/`
- Прочитай спеку, выполни Setup, скопируй файлы скилла
- Запусти Agent с телом скилла (без frontmatter) + контекстом `Working directory: <TMP>`
- Проверь паттерны из `## Checks`
- Сохрани результат: PASS / FAIL / SKIP

После завершения всех тестов `trap` авто-удалит `$RUN_ROOT`.

### 3. Сводная таблица

```
=== TEST RESULTS ===

  sdd:help    PASSED (7/7)
  dev:commit  FAILED (2/4)  ← первый упавший паттерн

Total: N passed, M failed, K skipped
```

Если есть FAILED — вывести диагностику (первые 20 строк output агента) для каждого.

### 4. Проверь TDD-coverage

Запусти Python скрипт для проверки того, что все скиллы имеют полное покрытие (4 категории):

```bash
python skills/skill/test-all/scripts/check-coverage-matrix.py
```

Выведи результаты:
- ✓ All skills have complete TDD coverage
- или список skills с неполным покрытием (missing categories)

### 5. Вердикт

- 0 FAILED + coverage OK: `✅ ALL TESTS PASSED & COVERAGE COMPLETE`
- Есть FAILED или coverage incomplete: `❌ FAILURES OR COVERAGE ISSUES DETECTED — see above`
