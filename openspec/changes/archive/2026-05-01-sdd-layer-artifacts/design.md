## Context

см. `proposal.md` → ## Why (мотивация и проблемы, которые решает этот change).

Затронуты четыре скилла: `sdd:propose`, `sdd:apply`, `sdd:archive`, `sdd:contradiction`. Добавляется один новый файл: `skills/sdd/contradiction.py`.

## Goals / Non-Goals

**Goals:**
- Обязательный `test-plan.md` как SDD-артефакт, используемый во время `sdd:apply`
- `.sdd.yaml` как машиночитаемое объявление capabilities change'а
- Единый `openspec/specs/index.yaml` как реестр всех финальных спек
- `sdd:contradiction` через Python-скрипт — полный обход без прямого чтения файлов Claude'ом
- Форматтер `design.md` — обязательные openspec-секции

**Non-Goals:**
- Не менять формат `tasks.md`
- Не форкать openspec schema
- Не валидировать синтаксис `.sdd.yaml` инструментом — только Claude
- Ретроактивное применение к существующим changes

## Decisions

### D1: Новая структура change-директории

```
openspec/changes/<name>/
├── proposal.md       ← ссылка на .sdd.yaml
├── design.md
├── tasks.md
├── test-plan.md      ← новый SDD-артефакт: YAML front matter + markdown body
└── .sdd.yaml         ← новый: creates + merges-into
```

### D2: .sdd.yaml — отдельный файл, не расширение .openspec.yaml

`.openspec.yaml` принадлежит openspec CLI. Добавление кастомных полей технически безопасно (нет strict Zod parsing), но создаёт риск коллизии при обновлении openspec. `.sdd.yaml` — явное владение SDD-слоя.

см. `specs/proposal-merge-deps/spec.md` → Requirement: Change directory contains .sdd.yaml

### D3: Единый openspec/specs/index.yaml вместо per-capability index.yaml

Per-capability `index.yaml` требует обхода директорий. Единый реестр читается одним вызовом и даёт Python-скрипту полный список capabilities без glob-паттернов.

см. `specs/spec-index-yaml/spec.md` → Requirement: openspec/specs/index.yaml is the single registry

### D4: Python-скрипт как посредник для sdd:contradiction

Claude не читает спеки напрямую — `contradiction.py` собирает пакет: читает `index.yaml`, читает `.sdd.yaml` текущего change, загружает содержимое нужных `spec.md`, выводит структурированный текст. Claude получает готовый пакет и анализирует на противоречия.

Разделение ответственности: скрипт — file I/O и сборка; Claude — семантический анализ.

### D5: Форматтер design.md — обязательные openspec-секции

`sdd:propose` проверяет наличие четырёх секций из стандартной openspec-структуры:
`## Technical Approach`, `## Architecture Decisions`, `## Data Flow`, `## File Changes`.

### D6: Зеркалирование contradiction.py

`contradiction.py` хранится рядом со скиллом. Поскольку скилл загружается из `.claude/skills/sdd/contradiction.md`, `${CLAUDE_SKILL_DIR}` резолвится к `.claude/skills/sdd/`. Скрипт должен присутствовать в обеих директориях: источник `skills/sdd/contradiction.py` и зеркало `.claude/skills/sdd/contradiction.py`. При изменении оба файла обновляются синхронно.

### D7: Bootstrap-соответствие

`sdd-layer-artifacts` является первым change'ом, вводящим обязательность `.sdd.yaml` и `test-plan.md`. Он создаёт эти артефакты вручную (не через `sdd:propose`) как первый образец нового процесса. `openspec/specs/index.yaml` заполняется вручную пятью capabilities из `.sdd.yaml` — первичный seed индекса.

Это не ретроактивное применение: правило «существующие changes продолжают работать» применяется к другим changes, созданным до имплементации. Этот change сам вводит правило и намеренно удовлетворяет его.

### D8: Механизм изменения скиллов

Каждый скилл хранится в двух местах: источник в `skills/sdd/<name>.md`, зеркало в `.claude/skills/sdd/<name>.md`. Claude Code загружает зеркало; источник — для версионирования и установки. При изменении оба файла обновляются синхронно.

`sdd:propose` (делегирует в `.claude/skills/openspec-propose/SKILL.md`):
- Создаёт `.sdd.yaml` stub (`creates: []`, `merges-into: []`) и `test-plan.md` stub при генерации change.
- Проверяет структуру `design.md` (четыре обязательные секции) и наличие ссылки на `.sdd.yaml` в `proposal.md`.

`sdd:apply` (делегирует в `.claude/skills/openspec-apply-change/SKILL.md`):
- Включает `test-plan.md` в `contextFiles` наряду с proposal/specs/design/tasks.
- Добавляет запись в `openspec/specs/index.yaml` для каждой capability из `.sdd.yaml` `creates`.

`sdd:archive` (делегирует в `.claude/skills/openspec-archive-change/SKILL.md`):
- Блокирует архивирование если `test-plan.md` отсутствует.
- Копирует `test-plan.md` в `openspec/specs/<capability>/test-plan.md`.
- Обновляет `openspec/specs/index.yaml` (добавляет/обновляет записи из `.sdd.yaml`).

`sdd:contradiction`:
- Вызывает `contradiction.py` через Bash tool, передавая путь к change-директории.
- Читает stdout скрипта и передаёт Claude как пакет для семантического анализа.
- Формирует отчёт: "Analyzed: N capabilities", список противоречий, список пропущенных.

`contradiction.py` (`skills/sdd/contradiction.py`):
- Читает `openspec/specs/index.yaml` → полный список capabilities.
- Читает `.sdd.yaml` текущего change → `creates` и `merges-into`.
- Загружает `spec.md` для каждой релевантной capability.
- Выводит структурированный пакет: capability name + spec content + summary (total discovered / loaded / skipped).
- При отсутствии `index.yaml` или `.sdd.yaml` завершается без ошибки с пояснением.
- Зачем Python, а не прямое чтение Claude'ом: десятки `spec.md` не вмещаются в контекст без риска переполнения; скрипт — file I/O и сборка, Claude — семантический анализ.

## Risks / Trade-offs

[index.yaml может рассинхронизироваться со specs/] → `sdd:archive` всегда перезаписывает запись в индексе. Python-скрипт сообщает если файл из индекса не найден.

[.sdd.yaml не валидируется внешним инструментом] → проверка на стороне `sdd:propose` (Claude). Достаточно для SDD-процесса без внешнего CI.

[test-plan.md может быть заполнен формально] → Claude генерирует содержательный stub на основе proposal и specs; YAML front matter делает ключевые поля явными и проверяемыми.

## Migration Plan

Существующие changes без `test-plan.md` и `.sdd.yaml` продолжают работать. Новые требования применяются только к новым changes. `sdd:contradiction` при отсутствии `openspec/specs/index.yaml` сообщает об этом и завершается без ошибки.

**Bootstrap-исключение:** `sdd-layer-artifacts` сам создаёт свои `.sdd.yaml` и `test-plan.md` вручную (не через `sdd:propose`) как первый образец нового процесса. `openspec/specs/index.yaml` заполняется вручную в рамках этого change'а — как первичный seed индекса.
