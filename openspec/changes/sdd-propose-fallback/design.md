## Context

`sdd:propose` шаг 1 — `Вызови скилл openspec-propose через Skill tool. Передай аргументы: $ARGUMENTS`. Это hard dependency на внешний openspec-плагин: если он не зарегистрирован в Skill tool текущего окружения, workflow проваливается с `Unknown skill: openspec-propose`.

При создании change `unified-test-flow` я столкнулся с этим: harness'у `Skill tool` не видел `openspec-propose`, хотя в system-reminder он перечислен. Я пошёл руками и сделал артефакты через `Write` — получилось, но это обход, а не штатный путь.

Тот же паттерн повторяется в:
- `sdd:apply` шаг 5 — `openspec-apply-change`
- `sdd:archive` шаг 6 — `openspec-archive-change`

## Goals / Non-Goals

**Goals:**
- `sdd:propose` завершает workflow корректно даже когда `openspec-propose` недоступен.
- Diagnostic-вывод явно сообщает причину fallback'а — пользователь понимает, что происходит.
- Шаблоны генерации живут в репе как версионируемые артефакты, не «в голове модели».
- Тест воспроизводит сценарий без openspec-плагина и проверяет fallback.

**Non-Goals:**
- Не переписываем `openspec-propose` (это внешний плагин, мы им не владеем).
- Не делаем feature-parity с openspec-propose — для fallback достаточно базовой schema (proposal/design/tasks/specs).
- Не трогаем `sdd:apply` и `sdd:archive` в этом change'е (отложено до следующего change'а или расширения этого, по решению автора).

## Decisions

### D1: Шаг 0 — preflight check на доступность openspec-propose
Перед шагом 1 проверить, доступен ли `openspec-propose`. Способ: попытка lazy-вызова через try/AskUserQuestion-эмуляцию, либо явный probe-call с минимальными аргументами и обработкой Unknown skill. Если плагин доступен — продолжаем по существующему workflow. Если нет — переключаемся на fallback-путь (D2).

Альтернатива (всегда fallback) отклонена: openspec-propose даёт правильную интеграцию с openspec-движком (mermaid-диаграммы, специфические форматы), и если он есть — лучше использовать его.

### D2: Fallback — встроенная генерация из шаблонов
При недоступности `openspec-propose` `sdd:propose` SHALL:
1. Создать `openspec/changes/<name>/` директорию.
2. Прочитать шаблоны из `skills/sdd/propose/templates/`.
3. Подставить `<name>` и краткое описание из `$ARGUMENTS` в шаблоны.
4. Записать `proposal.md`, `design.md`, `tasks.md`, `specs/<placeholder-cap>/spec.md`.
5. Продолжить workflow с шага 3 (identity check).

Шаблоны минимальны и содержат TODO-маркеры, которые автор заполнит после генерации.

### D3: Шаблоны живут в `skills/sdd/propose/templates/`
Каждый шаблон — отдельный файл с расширением `.md.tmpl`:
- `proposal.md.tmpl` — структура Why/What Changes/Capabilities/Impact + TODO-плейсхолдеры
- `design.md.tmpl` — 4 обязательные секции (Context, Goals/Non-Goals, Decisions, Risks/Trade-offs) + TODO
- `tasks.md.tmpl` — пустая секция `## 1. <area>` с одним `- [ ] 1.1 TODO`
- `spec.md.tmpl` — `## ADDED Requirements` + один шаблон Requirement

Подстановка простая — `{{name}}` и `{{description}}`. Никакого Jinja или сложных шаблонизаторов.

### D4: Diagnostic-вывод
При входе в fallback-путь `sdd:propose` SHALL вывести:
```
WARN: openspec-propose unavailable in this environment. Using built-in templates.
Templates source: skills/sdd/propose/templates/
Generated stubs:
  - openspec/changes/<name>/proposal.md
  - openspec/changes/<name>/design.md
  - openspec/changes/<name>/tasks.md
  - openspec/changes/<name>/specs/<cap>/spec.md
Fill TODO sections before /sdd:contradiction.
```

Это даёт пользователю явный сигнал, что он на fallback-пути, и список созданных файлов с маркерами на доработку.

### D5: Та же стратегия применима к sdd:apply и sdd:archive
Для consistency, `sdd:apply` (вызов `openspec-apply-change`) и `sdd:archive` (вызов `openspec-archive-change`) SHALL получить аналогичный preflight + fallback. Однако объём правок в этих скиллах больше (apply сложнее propose), поэтому выносим их **за рамки этого change'а**. Этот change решает только `sdd:propose`. Расширение — отдельным change'ем, если потребуется.

## Risks / Trade-offs

[Шаблоны могут разойтись с тем, что генерирует openspec-propose] → Mitigation: при подключённом плагине fallback не активируется, расхождения не критичны. Шаблоны валидируются `check-design.py` и `sdd:contradiction` — формальные требования соблюдаются всегда.

[Preflight через probe-call может иметь side effects] → Mitigation: probe-call не создаёт файлы (вызов с пустыми аргументами или специальным no-op флагом); если такого нет — preflight через try/catch на обычном вызове с откатом в fallback при первой ошибке.

[Fallback-путь не воспроизводит mermaid-диаграммы и openspec-specific форматы] → Trade-off accepted: пользователь дописывает руками после fallback-генерации; альтернатива — слепить через regex полную имитацию openspec-propose — нецелесообразно.

[Авторы могут полагаться на fallback-путь и не подключать openspec-плагин] → Trade-off accepted: fallback-путь полнее покрытия, чем отсутствие плагина вовсе; при необходимости расширенных фич openspec — пользователь подключит плагин.

## Open Questions

- Как именно делать preflight check на доступность Skill tool? Если Skill tool не предоставляет introspection — единственный путь это try/catch на реальном вызове с capture ошибки. Проверим в реализации.
- Хранить шаблоны как `.tmpl` или `.md`? `.tmpl` яснее показывает, что это шаблон, но IDE могут не подсветить markdown. Принят `.tmpl` для явности.
