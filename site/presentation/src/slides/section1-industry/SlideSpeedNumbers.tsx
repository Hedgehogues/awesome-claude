import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'speed-numbers',
  title: 'Цифры ускорения',
  section: 1,
  notes:
    'Опциональный слайд — решение на прогоне. Источники: interview-id-50 (99.5%), interview-id-63 (TTM), interview-id-22 (80ч), interview-id-78 (50 агентов), interview-id-12 (8→4).',
}

export default function SlideSpeedNumbers() {
  return (
    <div className="slide-container">
      <h1>Что реально получают команды</h1>
      <ul>
        <li><strong>99.5%</strong> кода от Claude — техлид продуктовой разработки</li>
        <li><strong>TTM 4 дня → часы</strong> — клиентский сервис, команда только валидирует</li>
        <li><strong>80 часов</strong> на полную веб-версию — оценивали месяцами</li>
        <li><strong>50 агентов в продукте</strong> — async flow: трекер → агент ночью → PR утром</li>
        <li><strong>8 разработчиков → 4</strong> — стартап после внедрения Claude Code</li>
      </ul>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Все цифры — из интервью, анонимно. Контекст варьируется.
      </p>
    </div>
  )
}
