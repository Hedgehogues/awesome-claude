## Context

см. `proposal.md` → ## Why (мотивация и текущее покрытие).

Тест-инфраструктура (`__dev:test-skill`, `__dev:test-all`) работает по схеме: `cases/<ns>/<skill>.md` → список кейсов с `stub:`, `contains:`, `semantic:`. Стабы — YAML-декларации виртуального окружения. Каждый кейс использует один стаб.

## Goals / Non-Goals

**Goals:**
- Кейсы для всех 11 sdd-скиллов (сейчас 3/11)
- Кейсы для dev, report, research пространств имён
- Подключить осиротевшие стабы к реальным кейсам
- Покрытие поднять с ~13% до ~80%+

**Non-Goals:**
- Не создавать полный E2E-запуск скиллов (live execution) — только LLM-кейсы
- Не переписывать существующие кейсы
- Не добавлять новые стабы если хватает существующих

## Decisions

### D1: Один файл кейсов на скилл

Формат `cases/<ns>/<skill>.md` — один файл на скилл, фиксированный заголовок `# Test: <ns>:<skill>`, разделы `## Case: <name>`. Соответствует существующей конвенции.

### D2: Минимум 2 кейса на скилл

Happy path (полный корректный вход) + один edge-case (отсутствует артефакт или некорректный вход). Для критических скиллов (`archive`, `change-verify`) — 3 кейса. `archive`: blocking + happy path + index.yaml update. `change-verify`: passed + gaps_found + human_needed.

### D3: Приоритет стабов

Для новых кейсов sdd-скиллов использовать существующие стабы:
- `change-with-sdd-yaml` — полная структура change'а с `.sdd.yaml` и `test-plan.md`
- `change-missing-test-plan` — change без `test-plan.md`
- `specs-with-index` — два capabilities с `index.yaml`

Новые стабы только если существующих недостаточно.

### D4: dev/report/research — минимальные кейсы

По одному файлу кейсов на скилл в namespace, 2 кейса: happy path + отсутствующий обязательный артефакт. Детальное покрытие — вне scope этого change'а.

### D5: Перемещение contradiction.py в scripts/

`contradiction.py` лежит на одном уровне с `.md`-скиллами. В других неймспейсах (`dev`, `report`, `research`) скрипты живут в `scripts/`. Переносим для консистентности. Путь в `contradiction.md` обновляется: `${CLAUDE_SKILL_DIR}/contradiction.py` → `${CLAUDE_SKILL_DIR}/scripts/contradiction.py`.

### D6: Зеркалирование

Все новые файлы в `skills/skill/cases/` зеркалируются в `.claude/skills/skill/cases/` синхронно. Включает все файлы из D1–D5.

### D7: Переименование `__dev` → `skill`

Namespace `__dev` использует Python-конвенцию дандеров для обозначения "внутреннего". Это неочевидно: содержимое директории — тест-инфраструктура для скиллов, и правильное имя — `skill`. Переименование охватывает: `skills/__dev/` → `skills/skill/`, `commands/__dev/` → `commands/skill/`, `.claude/skills/__dev/` → `.claude/skills/skill/`. Все ссылки на `__dev:test-skill` и `__dev:test-all` обновляются до `skill:test-skill` и `skill:test-all`.

### D8: Автозаполнение `creates:` в `sdd:propose`

После генерации `proposal.md` скилл `sdd:propose` SHALL читать секцию `### New Capabilities` и заполнять поле `creates:` в `.sdd.yaml` именами capabilities вместо пустого `creates: []`. Это устраняет необходимость ручного редактирования `.sdd.yaml` после propose.

### D9: Удаление `scripts/install.sh` (claude-way enforcement)

`scripts/install.sh` SHALL быть удалён целиком. Установка/обновление SHALL выполняться только через Claude Code. Обоснование: правило `rules/claude-way.md` декларирует Claude Code единственным user-facing интерфейсом; shell-скрипт установки противоречит ему. Решение отменяет §9.7 (обновление константы `DEV_COMPONENTS`) и идёт дальше — удаляет файл вместо его поддержки.

### D10: test-plan.md генерирует semantic cases, не копируется в specs/

`sdd:apply` SHALL вызывать `test-plan-to-cases.py` для парсинга `test-plan.md` (front matter `acceptance_criteria`) и генерации semantic case-файлов в `skills/skill/cases/<ns>/<cap>/<ac_id>.md`. `sdd:archive` SHALL NOT копировать `test-plan.md` в `openspec/specs/<capability>/`. test-plan.md остаётся в архивной директории change'а как историческая запись. Это меняет capability `test-plan-link` из sdd-layer-artifacts.

Обоснование: spec.md описывает контракт (что), test-plan.md описывает acceptance criteria (как проверить). Семантические cases — машинно-проверяемая форма acceptance criteria для `skill:test-skill`; spec остаётся чистым описанием контракта.

### D11: design.md secтions наследуются от openspec CLI

`sdd:propose` SHALL вызывать `check-design.py` для проверки структуры `design.md`. Обязательные секции SHALL быть: `## Context`, `## Goals / Non-Goals`, `## Decisions`, `## Risks / Trade-offs`. Опциональные: `## Migration Plan`, `## Open Questions`. Источник правды — `openspec instructions design --json` → поле `template`. Это меняет capability `design-formatter` из sdd-layer-artifacts.

Обоснование: D5 sdd-layer-artifacts декларировал кастомные секции (`Technical Approach` и др.), но реальный openspec template другой. Все existing change'ы используют openspec-template, поэтому D5 отменяется как ошибочное.

### D12: bump-version cases scope

Из coverage-аудита обнаружено, что `bump-version` скилл существует в каждом из 4 namespace'ов (sdd, dev, report, research) без тест-покрытия. §13 добавляет `skills/skill/cases/<ns>/bump-version.md` по 2 кейса каждый: happy path (валидный `.versions`/`.manifest`) + edge (missing `.versions`).

Обоснование: namespace-level bump (commit 1dafd1b) — критическая логика dependency resolution, не покрыта существующими cases. Минимальные 2 кейса × 4 namespace дают базовое регрессионное покрытие без расширения scope в детальное тестирование bump-логики.

### D13: Mock-stubs extended (граница: unit, не integration)

Текущий формат stubs (`git`, `skills`, `openspec.changes`) недостаточен для скиллов, которые реально вызывают команды (deploy, build, docker). Расширение SHALL добавить три поля:

- `files:` — словарь `path: content`, материализуется в `$TMP/<path>`
- `mock_commands:` — словарь `command: shim-script`, создаётся как исполняемый файл в `$TMP/.mocks/`, добавляется в `PATH`
- `env:` — словарь `KEY: VALUE`, экспортируется в окружение subagent'а

`skill:test-skill` шаг 3b SHALL обрабатывать эти поля. Subagent SHALL запускаться с `PATH=$TMP/.mocks:$PATH` и заданными env-переменными.

**Жёсткая граница scope:** это **unit-уровень с bootstrapped fakes**, НЕ интеграционные тесты. Mock-команды возвращают фиктивный вывод, не вызывают реальный Docker/cloud/API. End-to-end проверки (реальный деплой, реальная сеть, реальные внешние сервисы) — **out of scope** `skill:test-skill`. Для интеграции — отдельный механизм (CI, manual run), не предмет этого change'а.

Обоснование: bootstrapped-mocks — это всё ещё unit (изолированная среда, детерминированный вывод). Интеграционные тесты требуют реального окружения, секретов, оркестрации — фундаментально другая задача.

### D14: TDD coverage policy (только unit, не integration)

Правило `rules/skill-tdd-coverage.md` SHALL декларировать: каждый скилл обязан иметь минимум 4 кейса по матрице:

| Категория | Назначение |
|---|---|
| `positive-happy` | TDD-зелёный: валидный вход, ожидаемый успех |
| `positive-corner` | граничные значения (пустой список, максимум, лимит) |
| `negative-missing-input` | TDD-красный: обязательный артефакт отсутствует |
| `negative-invalid-input` | вход некорректный по формату/типу |

`skill:test-all` SHALL парсить `cases/<ns>/<skill>.md`, искать `## Case:` с категорией в имени или явный `category:` field, флагать скиллы с покрытием < 4 категорий.

`sdd:propose` (когда создаёт новый скилл) SHALL автогенерировать stub-кейсы по 4 категориям.

**Граница:** все 4 категории — unit-уровень (на stubs/mocks из D13). Integration-coverage (E2E, реальные сервисы) — out of scope: `check-coverage-matrix.py` считает только `cases/<ns>/<skill>.md`, не аудитит integration-артефакты.

Обоснование: TDD-cycle (red-green-refactor) применяется на уровне инфраструктуры скиллов. Без явной policy кейсы пишутся ad-hoc, негативные сценарии забываются. Матрица — минимальный стандарт, не максимум.

### D15: Test execution lifecycle (RUN_ROOT + trap EXIT)

`skill:test-skill` сейчас делает `mktemp -d` per-case без `trap` → tmp-директории накапливаются в `/tmp/`. Status-файла нет, форензика после краха невозможна.

**Решение** — каноничный паттерн из `skills/sdd/scripts/bump-namespace.sh:31-32`:

```bash
RUN_ROOT=$(mktemp -d -t skill-test-XXXXXX)
trap "rm -rf '$RUN_ROOT'" EXIT
```

- **Единый RUN_ROOT** на весь прогон (один `mktemp -d`, не per-case).
- **Per-case tmp** = `$RUN_ROOT/case-<N>/` — поддиректория RUN_ROOT'а.
- **Status-файл** = `$RUN_ROOT/status.json` (внутри RUN_ROOT, не в `/tmp/global` и не в `~/.cache/`).
- **Cleanup автоматический** через `trap EXIT` — срабатывает на success, fail, Ctrl+C, краш.
- **Конфликтов нет:** `mktemp -d` гарантирует уникальный путь → параллельные прогоны изолированы; прошлые прогоны уже удалены, будущие получат другой RUN_ROOT.

**Опция `--keep-tmp`:**
- `none` (default) — полный cleanup через trap;
- `failed-only` — перед exit копировать только failed case-dirs в `~/.cache/skill-test/<run-id>/` и печатать путь в отчёте;
- `all` — отменять trap, печатать `$RUN_ROOT` для отладки.

Обоснование: единообразие с `bump-namespace.sh`, status-файл живёт ровно столько же сколько прогон (никакой конкуренции с другими запусками), `trap EXIT` гарантирует cleanup даже при крахе.

### D16: Documentation refactor — README минималистичный, инструкция для Claude отдельно

Текущий README.md — 465 строк, содержит детали архитектуры, примеры, FAQ. Для пользователя нужно что-то очень простое: что это, как установить, список скиллов.

**Решение:**
- `README.md` (новый) — супер-минималистичный (70 строк): что это, как установить, список скиллов по неймспейсам с одной строкой описания
- `docs/README_DETAILED.md` — архивный старый README с полной документацией (архитектура, примеры, FAQ)
- `CLAUDE_INSTALL.md` (новый) — явная инструкция для Claude как устанавливать awesome-claude и что делать после

**Для пользователя:**
- Открыть Claude Code
- Спросить: "Install awesome-claude from https://github.com/Hedgehogues/awesome-claude"
- Claude читает CLAUDE_INSTALL.md, выполняет команды, всё работает

**Для разработчика:**
- Полная документация в `docs/README_DETAILED.md`
- Инструкции в `.claude/CLAUDE.md` (после установки)

Обоснование: README должен быть минимальным и понятным для человека. Инструкция для Claude должна быть явной и машиночитаемой (отдельный файл). Детали живут в docs/ для тех кто хочет глубже понять.

## Risks / Trade-offs

[LLM-тесты не детерминированы] → `contains:` для строгих строк, `semantic:` для поведенческих ожиданий. Комбинация снижает flakiness.

[Осиротевшие стабы могут не совпадать с новыми кейсами] → проверить формат стаба перед написанием кейса; при несоответствии расширить стаб.
