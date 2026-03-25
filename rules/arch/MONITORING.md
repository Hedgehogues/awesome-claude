---
paths:
  - "src/**/*.py"
---

# MONITORING.md — мониторинг (Prometheus-first)

## Контекст
Мониторинг является контрактом системы, а не набором визуализаций.
Метрики отвечают на вопросы «норма / деградация / авария».
Логи объясняют, метрики сигналят. Не путать.

## Правила
### Общие принципы
- Метрика должна быть используемой; неиспользуемая метрика считается отсутствующей.

### Модель мониторинга
- Prometheus — источник истины по метрикам.
- Pull-модель обязательна. /metrics у каждого сервиса.
- Метрики версионируются контрактно. Удаление или переименование является breaking change.
- Кардинальность контролируется строго.
- Высокая кардинальность является инцидентом.

### Именование метрик (Prometheus rules)
- Формат: <namespace>_<subsystem>_<metric_name>
- Суффиксы обязательны:
  - _total — counter
  - _seconds — latency/длительность
  - _bytes — размер
  - _count — количество
- Единицы измерения в имени.
- Label’ы должны быть минимальными и стабильными.

### Обязательные метрики (минимум)
#### Здоровье сервиса
- process_uptime_seconds
- process_cpu_seconds_total
- process_resident_memory_bytes
- service_health{status="ok|degraded|down"}

#### Write-путь (commands)
- commands_total{command, result}
- command_duration_seconds{command}
- command_retries_total{command}
- command_conflicts_total{aggregate}
- SLO:
  - p95 latency в бюджете
  - error rate < заданного порога

#### Read-путь (queries)
- queries_total{query, result}
- query_duration_seconds{query}
- query_result_size{query}
- SLO:
  - p95 latency
  - контролируемый объём данных

#### Агрегаты и транзакции
- transactions_total{result}
- transaction_duration_seconds
- optimistic_lock_conflicts_total
- deadlocks_total

#### События и outbox
- outbox_events_total{status}
- outbox_delivery_duration_seconds
- outbox_retry_total
- outbox_lag_seconds
- SLO:
  - lag ≤ задокументированного SLA

#### Read-модели / проекции
- projection_events_processed_total{projection}
- projection_lag_seconds{projection}
- projection_failures_total{projection}

#### Ошибки и деградации
- Ошибки учитываются метриками, а не “на глаз”.
- Каждый тип ошибки имеет счётчик:
  - доменные
  - технические
  - инфраструктурные
- errors_total{type, source}

### Alerting (Prometheus → Alertmanager)
- Алерты строятся на SLO, а не на разовых пиках.
- Минимальный набор алертов:
  - сервис недоступен
  - превышение latency SLO
  - рост error rate
  - outbox lag > SLA
  - падение проекций
- Алерт предполагает действие.
- Если действие не определено, алерт считается избыточным.

### Кардинальность (жёсткие правила)
- Запрещено использовать в label’ах:
  - user_id
  - aggregate_id
  - request_id
  - динамические строки
- Label’ы допускаются только из ограниченных множеств.
- Нарушение кардинальности является блокирующим дефектом.

### Экспозиция метрик
- Один /metrics endpoint на сервис.
- Метрики не защищаются аутентификацией, но изолируются сетью.
- Формат — Prometheus exposition format.

### Тестирование мониторинга
- Метрики проверяются в тестах.
- Наличие ключевых метрик является частью Definition of Done.
- Алерты тестируются на фейковых данных.

## Антипаттерны (запрещено)
- Метрики без владельца.
- Высокая кардинальность.
- Алерты без runbook.
- Дублирование логов метриками.
- “Давайте померяем всё”.

## Минимальный эталон
Метрика:
```
commands_total{command="PayInvoice", result="success"}
```

Latency:
```
command_duration_seconds_bucket{command="PayInvoice", le="0.5"}
```


Алерт:

p95(command_duration_seconds) > SLO