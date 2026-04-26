import type { SlideMeta } from '@/types/slide'
import Quote from '@/components/Quote'

export const meta: SlideMeta = {
  id: 'openspec-vs-speckit',
  title: 'OpenSpec vs Spec Kit — две философии',
  section: 2,
  notes:
    'Ключевой слайд раздела 2. Цитата Чуйкова — сильнее формального сравнения: он лидер сообщества 492 чел, публично выбирает OpenSpec. Источник: analysis/openspec-vs-speckit.md § Две философии.',
}

export default function SlideOpenSpecVsSpecKit() {
  return (
    <div className="slide-container">
      <h1>Две философии</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--accent-soft)' }}>OpenSpec</h2>
          <p><strong>fluid not rigid</strong></p>
          <ul>
            <li>3 команды + 4 артефакта</li>
            <li>Embrace failure</li>
            <li>Дельты → merge в specs/</li>
            <li>Brownfield-friendly — работает с существующим кодом</li>
            <li>Монорепо и мульти-репо</li>
            <li>Гибкий — можно построить любой процесс</li>
          </ul>
        </div>
        <div>
          <h2 style={{ color: 'var(--accent-soft)' }}>Spec Kit</h2>
          <p><strong>prevent failure</strong></p>
          <ul>
            <li>6 шагов + 8 файлов</li>
            <li>Constitution как guardrail</li>
            <li>Spec остаётся архивом решений</li>
            <li>Structured, для больших команд</li>
            <li>Проекты с высокой архитектурной сложностью</li>
          </ul>
        </div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Quote author="Константин Чуйков" source="Vibe Coding Community, 4 ноября 2025">
          Я на OpenSpec пересел, более лаконичен. SpecKit целится видимо в крупный enterprise.
        </Quote>
      </div>
    </div>
  )
}
