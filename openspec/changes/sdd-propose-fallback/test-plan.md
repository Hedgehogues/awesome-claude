---
approach: |
  Воспроизвести исходный сценарий: окружение, в котором openspec-propose отсутствует
  (Skill tool возвращает Unknown skill). Прогнать sdd:propose через preflight + fallback —
  убедиться что артефакты генерируются из шаблонов, WARN-блок виден, остаток workflow
  (identity, state, owner, design-check, proposal-ref) выполняется. Параллельно проверить
  обратный сценарий — openspec-propose доступен, fallback не активируется. Проверить
  templates валидны (проходят check-design.py). Проверить ambiguous-error случай не
  смешивается с unavailable.
acceptance_criteria:
  - "Когда Skill tool возвращает Unknown skill: openspec-propose, sdd:propose не падает а переключается на fallback-путь"
  - "Когда openspec-propose доступен, sdd:propose использует существующий путь без активации fallback"
  - "Fallback-генерация создаёт proposal.md, design.md, tasks.md, specs/<placeholder>/spec.md в openspec/changes/<name>/"
  - "Сгенерированный design.md проходит check-design.py с exit 0 (все 4 секции присутствуют)"
  - "Сгенерированный proposal.md содержит ссылку на .sdd.yaml"
  - "WARN-блок при fallback содержит: причину (openspec-propose unavailable), путь templates/, список созданных файлов, hint про TODO"
  - "Templates в skills/sdd/propose/templates/ существуют как .md.tmpl файлы и содержат плейсхолдеры {{name}} и {{description}}"
  - "После fallback-генерации workflow продолжается с шага 3 (identity) и завершается без ошибок: .sdd.yaml + owner + .sdd-state.yaml + test-plan.md созданы"
  - "Ambiguous-error (любой не-Unknown ответ от Skill tool) останавливает workflow с показом underlying error, не маскируется как fallback"
  - "Кейс propose-without-openspec в skills/sdd/propose/cases/propose.md воспроизводит сценарий и проходит ≥4/5"
---

## Scenarios

### Repro исходного бага
GIVEN harness в котором Skill tool возвращает `Unknown skill: openspec-propose`
WHEN пользователь запускает /sdd:propose unified-test-flow <description>
THEN preflight шаг 0 детектирует unavailable
AND активируется fallback-путь
AND создаются proposal.md, design.md, tasks.md, specs/unified-test-flow-placeholder/spec.md
AND вывод содержит WARN-блок с causes и list of files

### Happy path (openspec-propose доступен)
GIVEN harness с зарегистрированным openspec-propose
WHEN пользователь запускает /sdd:propose <name>
THEN preflight succeeds
AND вызывается openspec-propose как и раньше
AND fallback не активируется
AND output не содержит WARN-блок про unavailable

### Fallback-design проходит check-design
GIVEN fallback завершил генерацию для нового change <name>
WHEN запускается python3 skills/sdd/propose/scripts/check-design.py openspec/changes/<name>
THEN exit code 0
AND output: "OK: design.md contains all 4 required sections"

### Templates содержат плейсхолдеры
GIVEN templates в skills/sdd/propose/templates/
WHEN читается каждый .md.tmpl
THEN proposal.md.tmpl содержит {{name}} и {{description}}
AND design.md.tmpl содержит {{name}} и {{description}}
AND tasks.md.tmpl содержит {{name}}
AND spec.md.tmpl содержит {{name}}

### Ambiguous error не маскируется
GIVEN harness возвращает permission-denied или network-error при probe-вызове
WHEN sdd:propose делает preflight
THEN workflow останавливается с показом underlying error
AND fallback НЕ активируется
AND создаваемые файлы отсутствуют (нет частичной генерации)

### Полный workflow после fallback
GIVEN fallback сгенерировал артефакты
WHEN продолжаются шаги 3-11 sdd:propose
THEN .sdd.yaml создаётся с creates: [<name>-placeholder]
AND .sdd-state.yaml имеет stage: proposed
AND owner установлен из identity.py
AND test-plan.md создан как stub
AND merge-dialog проверяет creates против index.yaml
AND check-design.py возвращает OK
AND proposal-reference-check находит ссылку на .sdd.yaml
