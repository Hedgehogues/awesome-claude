import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'product-stages',
  title: 'Когда что — стадии продукта',
  section: 2,
  notes:
    'Источник: egor-ideas.md § Стадии продукта. Пороги (10, 100) — эвристика, не догма. Смысл: сначала проверь гипотезу vibe-coding-ом и промпт-инжинирингом; фреймворк — это инвестиция, она окупается только после подтверждённой ценности. Кейсы: interview-id-37 (timesheet без фреймворка — синтетика), interview-id-78 (крупный продукт — нужен async flow через трекер).',
}

export default function SlideProductStages() {
  return (
    <div className="slide-container">
      <h1>Когда какой фреймворк</h1>
      <ul style={{ fontSize: 'calc(var(--size-body) * 1.05)' }}>
        <li>
          <strong>0 → 10 клиентов.</strong> Без фреймворка.
          <div className="slide-muted">
            Vibe-coding, промпт-инжиниринг, быстрая итерация — проверяем гипотезу, пока она не подтвердилась.
          </div>
        </li>
        <li>
          <strong>10 → 100 клиентов.</strong> OpenSpec.
          <div className="slide-muted">Спека в репо, дельты, команда &lt; 10.</div>
        </li>
        <li>
          <strong>100+ клиентов.</strong> Spec Kit.
          <div className="slide-muted">Constitution, процессы, несколько команд.</div>
        </li>
      </ul>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Фреймворк — это инвестиция: не вкладывай, пока не доказал ценность продуктом.
      </p>
    </div>
  )
}
