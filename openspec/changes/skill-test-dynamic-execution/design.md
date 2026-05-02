# Design: Enforce Dynamic Skill Execution

## Context

`skill:test-skill` шаг 5 ("Status tracking") уже предписывает вести `status.json`
с полем `verdict` для каждого кейса. Поле `agent_launched` отсутствует — нет
machine-readable сигнала, что агент был запущен.

Исполнитель (модель) может пропустить шаг 3c и сразу перейти к 3d, оценив
семантику статически. Шаг 3c написан как инструкция, но не как контракт.

## Goals / Non-Goals

**Goals:**
- Добавить в `status.json` поле `agent_launched: bool` для каждого кейса
- Добавить в шаг 3d проверку: если `agent_launched != true` → FAIL кейс
  с сообщением "agent was not launched — static analysis is not allowed"
- Сделать нарушение machine-detectable, а не просто запрещённым текстом

**Non-Goals:**
- Не верифицировать содержимое OUTPUT (это задача contains/semantic проверок)
- Не менять формат отчёта (шаг 4)
- Не добавлять таймауты или retry

## Decisions

### D1: agent_launched пишется ДО проверки OUTPUT

Поле `agent_launched: true` записывается в status.json сразу после вызова Agent
(шаг 3c), до любых проверок в 3d/3e. Это гарантирует, что даже при исключении
в Agent факт запуска зафиксирован.

**Why:** Если писать после 3d, статический анализ останется необнаруженным при
ошибке в проверке.

### D2: Проверка в шаге 3d, не в отдельном шаге

Проверка `agent_launched` встраивается в начало шага 3d как pre-condition:
```
#### 3d. Проверь contains
Если status.json[case].agent_launched != true → verdict FAIL,
message "agent was not launched", перейди к 3f.
```

**Why:** Минимальная инвазивность; не нарушает порядок шагов.

### D3: Схема status.json остаётся JSON, не YAML

Поле добавляется в существующую JSON-схему без изменения формата.

## Risks / Trade-offs

- **Risk:** модель может написать `agent_launched: true` в status.json без запуска
  агента. Это обход через ложь, не через статику. Acceptance: контролируется
  code review / аудитом, не автоматически.
- **Trade-off:** небольшое усложнение шага 3c/3d в обмен на гарантию динамики.
