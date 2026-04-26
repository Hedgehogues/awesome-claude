import type { SlideMeta } from '@/types/slide'
import Quote from '@/components/Quote'

export const meta: SlideMeta = {
  id: 'sdd-maturity-levels',
  title: '4 уровня зрелости SDD',
  section: 2,
  notes:
    'Источник: analysis/sdd-overview.md. Уровень 3 — теоретический предел, живых примеров пока нет: Tessl двигался туда, но сменил концепцию (теперь реестр скиллов). Уровень 4 — наше расширение классификации Böckeler: замкнутый контур, где система сама корректирует спеку через метрики и верификацию. Фреймворки — не новая идея. Они кодифицируют то, что уже делают руками.',
}

const levels = [
  {
    code: 'SF · Spec-First.',
    desc: 'Сначала требования, потом реализация — нюансы реализации уточняют спеку. Решает: хаос vibe-coding. Проблема: спека фрагментируется.',
    example: 'Пример: Spec Kit',
  },
  {
    code: 'SA · Spec-Anchored.',
    desc: 'Спека обновляется через схлопывание дельт — позволяет сохранять домен актуальным. Решает: фрагментацию. Проблема: требует дисциплины команды.',
    example: 'Пример: OpenSpec',
  },
  {
    code: 'SaS · Spec-as-Source.',
    desc: 'Спека и есть система — код генерируется из неё автоматически. Решает: дисциплину. Проблема: недетерминизм LLM.',
    example: '→ вектор развития · Tessl движется сюда, но нормальных решений пока нет',
  },
  {
    code: 'SiL · Spec-in-the-Loop.',
    desc: 'Спека учится у системы — метрики и инциденты корректируют её автоматически. Решает: недетерминизм через обратную связь.',
    example: '→ наше расширение классификации · решений нет вообще',
  },
]

export default function SlideSDDMaturityLevels() {
  return (
    <div className="slide-container">
      <h1 style={{ marginBottom: '1.25rem' }}>4 уровня зрелости SDD</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {levels.map(({ code, desc, example }) => (
          <div key={code}>
            <div style={{ color: '#f5f5f5', fontSize: 'var(--size-body)', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--accent-soft)', fontWeight: 700, fontVariantCaps: 'normal' }}>{code}</span>{' '}
              {desc}
            </div>
            <div className="slide-muted" style={{ marginTop: '0.25rem', fontSize: 'var(--size-small)' }}>
              {example}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Quote author="Birgitta Böckeler" source="martinfowler.com">
          Классификация SF · SA · SaS
        </Quote>
      </div>
    </div>
  )
}
