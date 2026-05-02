---
approach: |
  Проверить TDD-цикл в apply: запустить apply на тестовом change с кейсами и без.
  Убедиться что RED-check срабатывает до задачи, GREEN-check после.
  Проверить SKIP при отсутствии кейсов и WARNING при уже-GREEN до задачи.
acceptance_criteria:
  - ac-red-check: до задачи вызывается run_test.py, при FAILED выводится RED ✓
  - ac-green-check: после задачи вызывается run_test.py, при FAILED — red-banner + стоп
  - ac-skip-no-cases: при отсутствии cases-файла TDD-check пропускается без ошибки
  - ac-warning-already-green: при GREEN до задачи выводится WARNING, apply продолжается
  - ac-missing-script: при отсутствии run_test.py — WARNING + продолжение без TDD
  - ac-per-task: run_test.py вызывается дважды на каждую задачу (до + после)
---

## Scenarios

### RED check fires before task

**When:** apply выполняет задачу, `run_test.py` возвращает FAILED перед реализацией

**Then:** вывод содержит `RED ✓ — proceeding`, реализация продолжается

### GREEN check stops apply

**When:** после реализации задачи `run_test.py` возвращает FAILED

**Then:** вывод содержит red-banner, первые 20 строк упавшего вывода, apply остановлен

### SKIP when no cases

**When:** `cases/<ns>/<skill>.md` не существует

**Then:** `run_test.py` возвращает SKIP, apply продолжает без TDD-check

### Warning when already GREEN

**When:** все тесты GREEN до задачи

**Then:** вывод содержит `WARNING: tests already GREEN before task — RED phase unverifiable`

### Missing run_test.py

**When:** `skills/skill/test-skill/scripts/run_test.py` не существует

**Then:** вывод содержит `WARNING: run_test.py not found — TDD cycle skipped`, apply продолжает
