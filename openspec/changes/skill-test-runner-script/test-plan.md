---
approach: |
  Запустить run_test.py с разными ns:skill аргументами и стабами.
  Проверить материализацию стабов, создание status.json, contains-проверки,
  итоговый отчёт и очистку temp-директории.
acceptance_criteria:
  - ac-parse-cases: run_test.py корректно извлекает Case-блоки из cases-файла
  - ac-materialize-stub: стаб материализуется в temp-директорию (git, files, mocks, env)
  - ac-state-yaml: state.yaml создаётся в ~/.cache/awesome-claude/<run-id>/ до первого кейса, обновляется после каждого, персистирует после завершения
  - ac-contains-check: contains-правила проверяются автоматически (PASS/FAIL)
  - ac-semantic-manual: semantic-правила помечаются MANUAL без попытки проверки
  - ac-report-format: итоговый отчёт соответствует формату skill:test-skill
  - ac-cleanup: $RUN_ROOT удаляется после завершения; --keep-tmp сохраняет
---

## Scenarios

### Happy path: dev:tracing

**When:** `run_test.py dev:tracing` запускается при наличии `cases/tracing.md`

**Then:**
- Оба кейса (`no-trace-target`, `with-context`) выполняются
- `status.json` содержит записи для обоих кейсов
- Отчёт показывает per-case результаты с PASS/FAIL по contains
- Semantic-правила помечены MANUAL
- `$RUN_ROOT` удалён после завершения

### Edge case: cases file missing

**When:** `run_test.py dev:nonexistent` при отсутствии cases-файла

**Then:** вывод `SKIP: no test spec for dev:nonexistent`, exit code 0

### Edge case: claude CLI missing

**When:** `claude` не в PATH

**Then:** вывод `ERROR: claude CLI not found`, exit code non-zero

### Keep-tmp flag

**When:** `run_test.py dev:tracing --keep-tmp=all`

**Then:** `$RUN_ROOT` сохранён, путь выведен в отчёт
