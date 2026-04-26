import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'bottleneck-shift',
  title: 'Куда переезжает боттлнек',
  section: 2,
  notes:
    'Опорная цитата — Егор в интервью interview-id-86. Три состояния: без вайб-кодинга боттлнек в разработке; с вайб-кодингом — в требованиях; с SDD — боттлнек убирается. Параллельно: interview-id-24 (bottleneck переместился), chat-vibe-coding Denis (30% код / 70% UX — пост-AI боттлнек), audience-patterns.md §8 (UX и продуктовая часть как новый боттлнек). Это нарратив доклада: «где ваш боттлнек сейчас».',
}

export default function SlideBottleneckShift() {
  return (
    <div className="slide-container">
      <h1>Куда переезжает боттлнек</h1>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        <svg viewBox="0 0 1000 220" style={{ width: '100%', maxWidth: 1000, height: 'auto' }}>
          <defs>
            <marker id="arr-bs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6b00" />
            </marker>
          </defs>

          {/* Состояние 1 */}
          <g>
            <rect x="30" y="50" width="280" height="130" rx="12" fill="#141414" stroke="#2a2a2a" />
            <text x="170" y="80" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              без вайб-кодинга
            </text>
            <text x="170" y="120" textAnchor="middle" fontSize="18" fill="#f5f5f5">боттлнек</text>
            <text x="170" y="150" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff9a4c">в разработке</text>
          </g>
          <path d="M 320 115 L 368 115" stroke="#ff6b00" strokeWidth="2" markerEnd="url(#arr-bs)" fill="none" />

          {/* Состояние 2 */}
          <g>
            <rect x="370" y="50" width="280" height="130" rx="12" fill="#141414" stroke="#2a2a2a" />
            <text x="510" y="80" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              с вайб-кодингом
            </text>
            <text x="510" y="120" textAnchor="middle" fontSize="18" fill="#f5f5f5">боттлнек</text>
            <text x="510" y="150" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff9a4c">в требованиях</text>
          </g>
          <path d="M 660 115 L 708 115" stroke="#ff6b00" strokeWidth="2" markerEnd="url(#arr-bs)" fill="none" />

          {/* Состояние 3 */}
          <g>
            <rect x="710" y="50" width="280" height="130" rx="12" fill="#141414" stroke="#ff6b00" strokeWidth="2" />
            <text x="850" y="80" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              с SDD
            </text>
            <text x="850" y="120" textAnchor="middle" fontSize="18" fill="#f5f5f5">боттлнек</text>
            <text x="850" y="150" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff6b00">убирается</text>
          </g>
        </svg>
      </div>

      <div className="callout" style={{ marginTop: 'auto' }}>
        Без вайб-кодинга — боттлнек в разработке. Когда внедрён — перекочёвывает в требования. SDD убирает и этот.
      </div>
    </div>
  )
}
