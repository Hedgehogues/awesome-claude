---
paths:
  - "src/presentation/telegram/services/**"
  - "src/presentation/telegram/handlers.py"
  - "src/presentation/telegram/callback_handlers.py"
  - "tests/unit/test_*_service.py"
  - "tests/architecture/test_handler*"
---

# SERVICES.md — правила service layer

## Service Layer
- UserContextService / MatchingService — orchestration между use cases, repos и infrastructure
- Handlers вызывают ТОЛЬКО сервисы, НЕ use cases / repos напрямую
- Нарушение = R7 architecture test fails

## Transaction Management
- Write-методы: commit on success, rollback + re-raise on generic Exception
- Domain-ошибки (NoResumeError, UserNotFoundError, NoResumeToDeleteError, ValueError): propagate без rollback
- Read-методы: no commit/rollback

## Тонкие Handlers
- Парсят вход (telegram_id, text, callback_data)
- Вызывают service метод
- Форматируют ответ через views
- Управляют FSM state transitions
