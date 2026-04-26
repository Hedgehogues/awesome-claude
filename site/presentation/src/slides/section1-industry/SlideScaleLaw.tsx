import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'scale-law',
  title: 'Закон масштаба задачи',
  section: 1,
  notes:
    'Противоречит интуиции. Egor + Bezdelnik — два независимых кейса. Важный messaging: SDD особенно нужен для крупных задач. Маленькие — vibe coding вне SDD.',
}

export default function SlideScaleLaw() {
  return (
    <div className="slide-container">
      <h1>Чем масштабнее задача — тем лучше работает агент</h1>
      <ul style={{ marginTop: '1.5rem' }}>
        <li><strong>Миграция 20-летнего легаси Firebird → Postgres</strong> — полностью AI</li>
        <li><strong>Переписать монолит на микросервисы</strong> — агент держит весь контекст</li>
        <li><strong>Маленькая задача («кнопка синяя → зелёная»)</strong> — агент закапывается</li>
      </ul>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Большие задачи требуют структуры до старта. Именно для этого существует Spec-Driven Development.
      </p>
    </div>
  )
}
