## Context

Test-flow в репе сейчас распределён между несколькими артефактами без формального владельца:

- **Скрипт материализации** `skills/sdd/apply/scripts/test-plan-to-cases.py` — генерирует acceptance cases из `test-plan.md`. Содержит хардкод пути `skills/skill/cases/<ns>/<cap>/` и эвристику `infer_namespace()` по подстроке имени capability. Capability-владельца нет.
- **Layout cases** — две структуры:
  - `skills/<ns>/<skill>/cases/<skill>.md` — behavioral cases скилла; читает `skill:test-skill`.
  - `skills/skill/cases/<ns>/<cap>/ac-NN.md` — acceptance cases capability; пишет apply шаг 10. Не читает никто специально.
- **Rule** `rules/skill-tdd-coverage.md` — пишет про плоский путь cases, что противоречит коду `skill:test-skill` (вложенный путь).
- **Runner** `skill:test-skill` — читает `skills/<ns>/<skill>/cases/<skill>.md`, не подхватывает `ac-*.md` файлы.

Архитектурный долг обнаружен при `/sdd:contradiction install-modes`. Install-modes описывает 10 capabilities, из которых только 4 — скиллы; остальные 6 (`manifest`, `install-modes`, `dev-mode`, `claude-init-mode`, `contributor-workflow`, `sdd-test-coverage`) — это режимы / файлы / правила. Скрипт пытался положить ~120 файлов в `skills/skill/cases/<inferred-ns>/<cap>/`, что:
- бьёт по логике layout (cases должны жить рядом с тестируемым артефактом, не в чужом namespace);
- использует ложную эвристику для определения namespace (по подстроке);
- не имеет runner'а — после генерации файлы никто бы не запускал автоматически.

## Goals / Non-Goals

**Goals:**
- Один владелец test-flow (capability `test-flow`).
- Формальное разделение behavioral vs acceptance cases по роли и пути.
- Корректная материализация без эвристик: capability либо скилл (известен по существованию `skills/<ns>/<cap>/skill.md`), либо нет.
- Runner для acceptance cases (`skill:test-acceptance`) — закрывает разрыв «генерация без запуска».
- Синхронизация rule + код + script + spec — один и тот же layout.

**Non-Goals:**
- Замена `skill:test-skill` или `skill:test-all` — расширение, не реписывание.
- Замена `test-plan.md` формата — он остаётся контрактом acceptance criteria.
- Автоматический запуск acceptance cases как часть apply — это отдельный шаг (вызов `skill:test-acceptance` руками или через CI).
- Удаление behavioral cases для не-скилл capabilities — их и сейчас нет.

## Decisions

### D1: Capability `test-flow` — единый владелец test-generation pipeline
Сейчас скрипт `test-plan-to-cases.py` живёт в `skills/sdd/apply/scripts/` без явного capability-владельца. Любая правка скрипта формально не имеет spec-контракта и не попадает под OpenSpec-модель. Решение: ввести capability `test-flow`, которая владеет:
- путём и логикой `test-plan-to-cases.py`,
- layout cases (behavioral vs acceptance),
- runner'ами (через delegation на `acceptance-runner`).

### D2: Behavioral vs acceptance — формальное разделение по роли и пути
Behavioral cases отвечают «что скилл делает в разных условиях» (lifecycle, idempotency, error handling) и тестируются `skill:test-skill <ns>:<skill>`. Acceptance cases отвечают «что capability обещает» (наблюдаемые результаты из `acceptance_criteria`) и тестируются `skill:test-acceptance <capability>`.

Layout:
- Behavioral: `skills/<ns>/<skill>/cases/<skill>.md` — один файл с несколькими `## Case:` блоками.
- Acceptance (capability — скилл): `skills/<ns>/<cap>/cases/ac-NN-<slug>.md` — один файл на каждый acceptance criterion, рядом со скиллом.
- Acceptance (capability — не скилл): `openspec/specs/<cap>/cases/ac-NN-<slug>.md` — рядом со spec'ом capability, в openspec-дереве.

Различие по префиксу имени файла (`<skill>.md` vs `ac-*.md`) — формальная граница в одной директории.

### D3: Материализация без эвристик
Переписать `test-plan-to-cases.py`:
1. Убрать `infer_namespace()` целиком.
2. Для каждой capability в `.sdd.yaml.creates`:
   - Найти соответствующий скилл — `skills/*/<cap>/skill.md` (поиск по всем namespace).
   - Если нашёлся — путь вывода `skills/<ns>/<cap>/cases/`.
   - Если не нашёлся — путь вывода `openspec/specs/<cap>/cases/`.
3. Имя файла: `ac-{NN:02d}-{slug(criterion)}.md`.
4. Если файл уже существует — пропустить (idempotent).

Альтернатива (всегда класть в openspec/specs/<cap>/cases/) отклонена: для capability-скиллов логичнее иметь cases рядом со `skill.md`, чтобы edit и run были в одном месте.

### D4: Расширение `skill:test-skill` — подхват acceptance cases рядом со скиллом
`skill:test-skill <ns>:<skill>` сейчас читает только `cases/<skill>.md`. После: дополнительно читает все `cases/ac-*.md` рядом — каждый файл = один Case. Так single-call test покрывает и behavioral, и acceptance для скилла.

### D5: Новый скилл `skill:test-acceptance` для не-скилл capabilities
Capability-имя на входе. Скилл:
1. Резолвит путь к acceptance-cases:
   - `skills/*/<cap>/cases/ac-*.md` (если capability — скилл)
   - `openspec/specs/<cap>/cases/ac-*.md` (если не скилл)
2. Прогоняет каждый кейс через единый eval-framework (тот же что у `skill:test-skill` — bootstrap k=5, ≥4/5, contains + LLM-judge).
3. Отчёт в общем `test-results/<timestamp>.md`.

### D6: Rule `skill-tdd-coverage.md` — синхронизация
Текущий путь в правиле: `skills/skill/cases/<ns>/<skill>.md` (плоский). После: `skills/<ns>/<skill>/cases/<skill>.md` (вложенный, behavioral) + новый раздел про acceptance cases с двумя возможными путями (рядом со скиллом или в openspec/specs).

### D7: Снятие компромиссного флага из install-modes
`install-modes/test-plan.md` (если успел получить флаг `generate_cases: false`) должен снять его как часть apply-задач этого change — после внедрения корректного скрипта флаг становится излишним.

## Risks / Trade-offs

[Coexistence в одной директории через префикс] → behavioral `<skill>.md` и acceptance `ac-*.md` лежат вместе. Risk: визуальный шум при ls. Mitigation: префикс `ac-` явно сигнализирует тип; в test-skill отчёте кейсы группируются по типу.

[Скрипт ищет capability-скилл по `skills/*/<cap>/skill.md`] → если в репе есть случайные совпадения имён (capability `apply` и скилл `sdd:apply`) — cases уйдут в `skills/sdd/apply/cases/` корректно. Risk: ложное совпадение. Mitigation: capability-имена в `.sdd.yaml` уникальны на проект, ситуация ложного совпадения требует ручного именования и видна автору.

[skill:test-acceptance дублирует skill:test-skill] → два скилла с почти одинаковой механикой запуска. Trade-off: разные source paths и разные семантические фокусы оправдывают разделение; объединение через флаг сделало бы аргументы скилла менее предсказуемыми.

## Open Questions

- Имя capability — `test-flow` или `test-pipeline`? Принят `test-flow` как короче и согласуется с workflow-терминологией.
- Хранить acceptance cases для не-скилл capabilities в `openspec/specs/<cap>/cases/` или в новом каталоге `openspec/cases/<cap>/`? Принят первый вариант — рядом со spec, не растёт новое дерево.
