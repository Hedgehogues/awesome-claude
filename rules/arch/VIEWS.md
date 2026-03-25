---
paths:
  - "src/presentation/**"
  - "tests/unit/test_views*"
  - "tests/architecture/test_view*"
---

# VIEWS.md — правила презентационного слоя

## Разделение по агрегатам
- views/user_context.py — импортирует только src.domain.user_context
- views/matching.py — импортирует только src.domain.matching
- views/common.py — не импортирует src.domain.*
- Нарушение = R6 architecture test fails

## Меню после каждого действия
- Каждый ответ пользователю ДОЛЖЕН содержать inline-клавиатуру
- EnsureMenuMiddleware гарантирует это как safety net
- Предпочтительно: handler явно передаёт reply_markup
- Fallback: middleware отправляет main_menu

## Чистые функции
- Views — side-effect free: принимают domain objects, возвращают строки/клавиатуры
- Никакой бизнес-логики, обращений к БД, API
