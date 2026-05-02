---
approach: |
  Прогнать обновлённый test-plan-to-cases.py на синтетическом стабе с тремя capabilities:
  одна — скилл (skill exists), вторая — не-скилл (только spec), третья — ambiguous (несколько
  совпадений skill в разных namespace). Проверить корректность путей вывода, отсутствие
  эвристики по подстроке, idempotent-семантику. Прогнать skill:test-skill на скилле с
  behavioral + acceptance cases — оба типа подхватываются. Прогнать skill:test-acceptance
  на не-скилл capability — cases из openspec/specs/<cap>/cases/ запускаются. Проверить
  обратную совместимость на скиллах без acceptance cases.
acceptance_criteria:
  - "test-plan-to-cases.py не содержит функции infer_namespace и не использует подстрочные эвристики при определении пути материализации"
  - "Для capability со скиллом (skills/<ns>/<cap>/skill.md существует) cases создаются в skills/<ns>/<cap>/cases/ac-NN-<slug>.md"
  - "Для capability без скилла cases создаются в openspec/specs/<cap>/cases/ac-NN-<slug>.md"
  - "Повторный запуск test-plan-to-cases.py не перезаписывает уже существующие ac-*.md файлы"
  - "Ambiguous case (capability имеет skill.md в нескольких namespace) обрабатывается explicit error, не silent выбором первого"
  - "skill:test-skill <ns>:<skill> читает и <skill>.md, и все cases/ac-*.md рядом — оба типа кейсов прогоняются в одном вызове"
  - "Скилл без файлов cases/ac-*.md продолжает работать как раньше — обратная совместимость"
  - "Каждый кейс в test-results помечен типом [behavioral] или [acceptance] по префиксу имени файла"
  - "skill:test-acceptance <capability> запускает cases из правильного резолва пути и использует тот же eval-framework, что и skill:test-skill"
  - "skill:test-acceptance с unknown capability (нет ни skill.md, ни spec.md) останавливается с non-zero exit"
  - "rules/skill-tdd-coverage.md описывает вложенный путь для behavioral и оба возможных пути для acceptance — без противоречий с кодом skill:test-skill"
  - "После archive этого change install-modes/test-plan.md не содержит generate_cases: false"
---

## Scenarios

### Capability — скилл, cases уходят рядом со скиллом
GIVEN .sdd.yaml.creates: [my-skill] и skills/dev/my-skill/skill.md существует
WHEN test-plan-to-cases.py запускается с test-plan.md содержащим 3 acceptance criteria
THEN созданы файлы skills/dev/my-skill/cases/ac-01-*.md, ac-02-*.md, ac-03-*.md
AND skills/skill/cases/<ns>/my-skill/ НЕ создаётся

### Capability — не скилл, cases уходят рядом со spec
GIVEN .sdd.yaml.creates: [my-config] и нет skills/*/my-config/skill.md
WHEN test-plan-to-cases.py запускается
THEN созданы файлы openspec/specs/my-config/cases/ac-01-*.md и т.д.
AND skills/skill/cases/ не модифицируется

### skill:test-skill подхватывает acceptance cases
GIVEN skills/skill/setup/cases/ содержит setup.md (4 behavioral) и ac-01-*.md, ac-02-*.md (2 acceptance)
WHEN вызван skill:test-skill skill:setup
THEN все 6 кейсов прогоняются
AND test-results показывает 4 [behavioral] и 2 [acceptance] записи
AND итоговая статистика по типам разделена

### skill:test-acceptance для не-скилл capability
GIVEN openspec/specs/manifest/cases/ содержит ac-01-*.md, ac-02-*.md, ac-03-*.md
WHEN вызван /skill:test-acceptance manifest
THEN все 3 кейса прогоняются через тот же eval-framework
AND результаты appended в общий test-results/<timestamp>.md
AND кейсы помечены типом [acceptance]

### Ambiguous capability
GIVEN .sdd.yaml.creates: [foo] и существуют skills/dev/foo/skill.md и skills/sdd/foo/skill.md
WHEN test-plan-to-cases.py пытается резолвить путь для foo
THEN скрипт выводит "ambiguous capability foo: matches in dev, sdd"
AND завершается non-zero exit
AND не создаёт файлы

### Idempotent повторный запуск
GIVEN test-plan-to-cases.py уже создал ac-01-foo.md в предыдущем run
WHEN повторный запуск с тем же test-plan.md
THEN существующий файл не перезаписывается
AND если в test-plan.md появился новый acceptance_criterion — создаётся новый ac-NN.md

### Снятие compromise-флага из install-modes
GIVEN install-modes/test-plan.md содержит generate_cases: false (если был добавлен)
WHEN unified-test-flow archived и install-modes apply'ится после
THEN флаг удалён из install-modes/test-plan.md
AND test-plan-to-cases.py с правильной логикой работает корректно для install-modes
