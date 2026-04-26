import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'discovery-delivery',
  title: 'Discovery → Delivery и продуктовая инженерия',
  section: 2,
  notes:
    'Главный тезис раздела 2. Две дорожки: Discovery (PM ведёт PoC и vibe-coding, проверяем гипотезу быстро) и Delivery (продуктовый инженер заворачивает проверенную гипотезу в SDD — прод-качество). Мост между ними: требования + PoC → спека. Цитаты Koval + Egor — подписи под схемой. PM как модератор: interview-id-3, interview-id-68. Примеры: interview-id-78 (Linear-агент), interview-id-50 (GraphQL SDL).',
}

export default function SlideDiscoveryDelivery() {
  return (
    <div className="slide-container">
      <h1>Discovery → Delivery</h1>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        <svg viewBox="0 0 940 390" style={{ width: '100%', maxWidth: 940, height: 'auto' }}>
          <defs>
            <marker id="arr-dd" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6b00" />
            </marker>
          </defs>

          {/* Discovery — верхняя дорожка */}
          <rect x="20" y="20" width="900" height="120" rx="12" fill="#141414" stroke="#2a2a2a" strokeWidth="1" />
          <text x="44" y="68" fontSize="18" fontWeight="700" fill="#ff9a4c">Discovery</text>
          <text x="44" y="90" fontSize="14" fill="#a0a0a0">PM · быстрая проверка гипотезы</text>
          <g>
            <rect x="210" y="42" width="170" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="295" y="73" textAnchor="middle" fontSize="15" fill="#f5f5f5">требования</text>
            <text x="295" y="98" textAnchor="middle" fontSize="13" fill="#a0a0a0">что реально нужно</text>

            <rect x="405" y="42" width="170" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="490" y="73" textAnchor="middle" fontSize="15" fill="#f5f5f5">спека</text>
            <text x="490" y="98" textAnchor="middle" fontSize="13" fill="#a0a0a0">формализуем</text>

            <rect x="600" y="42" width="196" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="698" y="66" textAnchor="middle" fontSize="15" fill="#f5f5f5">прототип в коде</text>
            <text x="698" y="88" textAnchor="middle" fontSize="13" fill="#a0a0a0">задеплоен, не на проде</text>
            <text x="698" y="108" textAnchor="middle" fontSize="12" fill="#a0a0a0" fontStyle="italic">vibe-coding</text>
          </g>

          {/* Мост — стрелка с зазором 80px */}
          <path d="M 698 142 L 698 238" fill="none" stroke="#ff6b00" strokeWidth="3" markerEnd="url(#arr-dd)" />

          {/* Delivery — нижняя дорожка */}
          <rect x="20" y="250" width="900" height="120" rx="12" fill="#141414" stroke="#ff6b00" strokeWidth="2" />
          <text x="44" y="298" fontSize="18" fontWeight="700" fill="#ff6b00">Delivery</text>
          <text x="44" y="320" fontSize="14" fill="#a0a0a0">продуктовый инженер · SDD · прод-качество</text>
          <g>
            <rect x="210" y="272" width="170" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="295" y="303" textAnchor="middle" fontSize="15" fill="#f5f5f5">спека</text>
            <text x="295" y="325" textAnchor="middle" fontSize="13" fill="#a0a0a0">согласовано до кода</text>

            <rect x="405" y="272" width="170" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="490" y="303" textAnchor="middle" fontSize="15" fill="#f5f5f5">агент генерит</text>
            <text x="490" y="325" textAnchor="middle" fontSize="13" fill="#a0a0a0">по tasks.md</text>

            <rect x="600" y="272" width="196" height="72" rx="8" fill="#1e1e1e" stroke="#2a2a2a" />
            <text x="698" y="303" textAnchor="middle" fontSize="15" fill="#f5f5f5">приёмка + merge</text>
            <text x="698" y="325" textAnchor="middle" fontSize="13" fill="#a0a0a0">как у джуна</text>
          </g>
        </svg>
      </div>

      <p className="slide-muted" style={{ fontSize: 'var(--size-small)', textAlign: 'center' }}>
        «Теперь ты контролируешь не код, а требования и ДоДы» — Koval Konstantin · «Код теперь побочный эффект» — Егор
      </p>
    </div>
  )
}
