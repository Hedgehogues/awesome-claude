import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'domain-boundary',
  title: 'Стоимость фичи и техдолг',
  section: 2,
  notes:
    'PM моделирует новый домен — когда он не пересекается с существующими, инженер просто встраивает. Чисто. Но когда новый домен пересекается с существующим — нужно делить домен и договариваться с продактом: где граница, чья ответственность, что остаётся общим. Это не SDD-проблема — это обычная архитектурная работа. Именно здесь спека работает как контракт между ролями. Переход к следующему разделу: «И вот зачем нужен SDD-фреймворк — чтобы этот контракт жил в репо, а не в головах».',
}

export default function SlideDomainBoundary() {
  return (
    <div className="slide-container">
      <h1>Стоимость фичи и техдолг</h1>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1.25rem' }}>
        <svg viewBox="0 0 510 260" style={{ width: '100%', maxWidth: 510, height: 'auto' }}>
          <defs>
            {/* Обрезаем оранжевый бордер домен B справа: скрываем от x=246 (230+rx16) */}
            <clipPath id="clip-b-bdr">
              <rect x="0" y="0" width="246" height="260" />
            </clipPath>
            {/* Overlap fill по форме домен B (правые закругления) */}
            <clipPath id="clip-a-shape">
              <rect x="10" y="55" width="270" height="175" rx="16" />
            </clipPath>
            {/* Обрезаем серый бордер домен A слева: скрываем до x=246 (230+rx16) */}
            <clipPath id="clip-a-bdr">
              <rect x="246" y="0" width="264" height="260" />
            </clipPath>
          </defs>

          {/* PM над домен B (центр non-overlap: 10..230 = 120) */}
          <text x="120" y="20" textAnchor="middle" fontSize="20" fontWeight="700" fill="#ff9a4c">Product Manager</text>
          <text x="120" y="40" textAnchor="middle" fontSize="15" fill="#555" fontStyle="italic">создаёт</text>

          {/* Engineer над домен A (центр non-overlap: 280..500 = 390) */}
          <text x="390" y="20" textAnchor="middle" fontSize="20" fontWeight="600" fill="#f5f5f5">Product Engineer</text>
          <text x="390" y="40" textAnchor="middle" fontSize="15" fill="#555" fontStyle="italic">встраивает</text>

          {/* Слой 1: fills */}
          <rect x="10" y="55" width="270" height="175" rx="16" fill="#141414" />
          <rect x="230" y="55" width="270" height="175" rx="16" fill="#141414" />
          {/* Перекрытие: сплошная заливка закрывает артефакты закруглений */}
          <rect x="230" y="55" width="50" height="175" fill="#141414" />

          {/* Слой 2: overlap fill (x=230..280, 50px) */}
          <rect x="230" y="55" width="50" height="175" fill="#ff6b0030" clipPath="url(#clip-a-shape)" />

          {/* Слой 3: бордер домен B (оранжевый), полный замкнутый */}
          <rect x="10" y="55" width="270" height="175" rx="16" fill="none" stroke="#ff9a4c" strokeWidth="2" />

          {/* Слой 4: бордер домен A (оранжевый приглушённый), обрезан слева */}
          <rect x="230" y="55" width="270" height="175" rx="16" fill="none" stroke="#ff9a4c" strokeWidth="1.5" strokeOpacity="0.45" clipPath="url(#clip-a-bdr)" />

          {/* Domain B */}
          <text x="120" y="140" textAnchor="middle" fontSize="20" fill="#ff9a4c">домен B</text>
          <text x="120" y="163" textAnchor="middle" fontSize="12" fill="#cc7a30" fontStyle="italic">новый</text>

          {/* warning triangle в центре overlap (x=255) */}
          <g transform="translate(237, 120)">
            <polygon points="18,2 34,30 2,30" fill="none" stroke="#ff9a4c" strokeWidth="2.5" strokeLinejoin="round" />
            <text x="18" y="26" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ff9a4c">!</text>
          </g>

          {/* Domain A */}
          <text x="390" y="140" textAnchor="middle" fontSize="20" fill="#555">домен A</text>
          <text x="390" y="163" textAnchor="middle" fontSize="12" fill="#444" fontStyle="italic">существующий</text>
        </svg>
      </div>

      <p style={{ textAlign: 'center', fontSize: 'var(--size-body)', color: '#f5f5f5', fontWeight: 600, margin: '0 0 0.5rem' }}>
        Пересечение не решается промптом
      </p>

      <p className="slide-muted" style={{ textAlign: 'center', fontSize: 'var(--size-small)', margin: '0 0 1.5rem' }}>
        Придётся делить домен и договариваться с продактом
      </p>

      <div className="callout" style={{ marginTop: 'auto' }}>
        Сохранение границ доменов — это цена следующей фичи. Пересекаешь границу — цена растёт, разносишь домены сейчас или копишь техдолг.
      </div>
    </div>
  )
}
