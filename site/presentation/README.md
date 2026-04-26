# Presentation

React-приложение для доклада на Podlodka про Spec-Driven Development.

## Стек

- **Vite 8 + React 19 + TypeScript 6** — основа
- **react-router-dom** — роутинг между слайдами (`/slide/:index`)
- **framer-motion** — анимации (готово к использованию в слайдах)
- **shiki** — подсветка кода (runtime, с автозагрузкой языков)
- **qrcode.react** — QR-код для подключения аудитории к Telegram-боту

## Запуск

```bash
cd presentation
npm install
npm run dev       # dev-server на http://localhost:5173/
npm run build     # → dist/
npm run preview   # локальный preview билда
```

## Клавиши управления презентацией

| Клавиша | Действие |
|---|---|
| `→` / `↓` / `Space` / `PgDn` | Следующий слайд |
| `←` / `↑` / `PgUp` | Предыдущий слайд |
| `Home` | Первый слайд |
| `End` | Последний слайд |
| `F` | Полноэкранный режим |
| `P` | Открыть окно presenter-mode |
| `R` | Сброс таймера (в presenter-mode) |

## Structure

```
src/
├── App.tsx                       # роуты: /, /slide/:index, /presenter
├── main.tsx                      # bootstrap + BrowserRouter
├── components/
│   ├── SlideView.tsx             # главное окно — текущий слайд + футер
│   ├── PresenterView.tsx         # окно спикера: current + next + notes + timer
│   ├── SectionIntermission.tsx   # переход между разделами (большая цифра)
│   ├── SlideErrorBoundary.tsx    # изоляция ошибок рендера слайда
│   ├── CodeBlock.tsx             # подсветка через shiki
│   ├── QRSlide.tsx               # QR-код + описание (для воркшопа)
│   ├── Quote.tsx                 # цитата с автором
│   ├── Timer.tsx                 # MM:SS таймер спикера
│   └── Progress.tsx              # N/M + progress bar
├── data/
│   ├── slides.ts                 # реестр слайдов в порядке показа
│   └── config.ts                 # botUsername, botUrl, названия
├── hooks/
│   ├── useKeyboardNavigation.ts  # keyboard handler + fullscreen
│   └── useSlideChannel.ts        # BroadcastChannel sync главное ↔ presenter
├── slides/
│   ├── SlideCover.tsx
│   ├── section1-industry/        # слайды раздела «Индустрия»
│   ├── section2-theory/          # слайды раздела «Проблема→теория→решение»
│   └── section3-workshop/        # слайды раздела «Воркшоп»
├── styles/
│   └── theme.css                 # тёмная тема, размеры для проектора
└── types/
    └── slide.ts                  # SlideMeta, SlideEntry, SECTION_TITLES
```

## Как добавить слайд

1. Создать файл `src/slides/sectionN-*/SlideMyNew.tsx`:

```tsx
import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'my-new',
  title: 'Новый слайд',
  section: 2,
  notes: 'Заметки для спикера — что рассказывать голосом.',
}

export default function SlideMyNew() {
  return (
    <div className="slide-container">
      <h1>Заголовок</h1>
      <p>Контент</p>
    </div>
  )
}
```

2. Добавить в `src/data/slides.ts` в нужной позиции:

```ts
import SlideMyNew, { meta as metaMyNew } from '@/slides/section2-theory/SlideMyNew'

export const slides: SlideEntry[] = [
  // ...
  { meta: metaMyNew, Component: SlideMyNew },
  // ...
]
```

## Presenter mode

Нажми `P` на главном окне — откроется второе окно с dashboard спикера:
- превью текущего и следующего слайда
- speaker notes (из `meta.notes`)
- таймер (сброс по `R`)
- прогресс `N/M`

Синхронизация через BroadcastChannel API (fallback на localStorage).

## Конфигурация бота воркшопа

Имя Telegram-бота и URL — в `src/data/config.ts`:

```ts
export const config = {
  botUsername: 'podlodka_demo_bot',
  botUrl: 'https://t.me/podlodka_demo_bot',
  // ...
}
```

Изменить перед прогоном, если бот будет другой.

## Fallback-стратегии для доклада

1. **Основной:** `npm run dev` локально с ноутбука спикера
2. **Backup:** `npm run build` + Vercel/Netlify deploy для доступа через интернет
3. **Last resort:** экспорт PDF через браузер (`Ctrl+P` → Save as PDF) прямо из `dist/`

## OpenSpec change

Этот проект реализован по change `talk-presentation-app` в `../openspec/changes/`. См. `proposal.md`, `design.md`, `specs/`, `tasks.md` для полной спецификации.
