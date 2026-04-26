import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'roles-mechanism',
  title: 'Две роли и механизм связки',
  section: 2,
  notes:
    'Показать явно две роли и механизм между ними. PM (продакт): делает кликабельный прототип на основе существующего кода в Claude Code + формулирует требования — interview-id-12, 3, 22, 47. Product Engineer (продуктовый инженер): встраивает это в основной код. Механизм: промпты + репа со скиллами — interview-id-81 (продуктовая репа + QA-репа, скиллы на роль), interview-id-86 («точки контроля переезжают в skills»). Цитата interview-id-78 — канон. Подпись стрелки PM→Механизм: «кликабельный прототип на основе кода» — подчеркнуть, что это не абстрактный вайбкодинг, а код поверх существующей базы.',
}

export default function SlideRolesMechanism() {
  return (
    <div className="slide-container">
      <h1>Как это выглядит на практике</h1>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        <svg viewBox="0 0 1300 330" style={{ width: '100%', maxWidth: 1300, height: 'auto' }}>
          <defs>
            <marker id="arr-rm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff9a4c" />
            </marker>
            <marker id="arr-feedback" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
            </marker>
          </defs>

          {/* Discovery над ролью 1 */}
          <text x="165" y="30" textAnchor="middle" fontSize="18" fontWeight="700" fill="#ff9a4c" style={{ letterSpacing: '0.05em' }}>DISCOVERY</text>

          {/* Product Manager слева */}
          <g>
            <rect x="20" y="50" width="290" height="210" rx="14" fill="#141414" stroke="#ff9a4c" strokeWidth="2" />
            <text x="165" y="85" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              роль 1
            </text>
            <text x="165" y="120" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff9a4c">Product Manager</text>
            <line x1="60" y1="140" x2="270" y2="140" stroke="#2a2a2a" />
            <text x="165" y="168" textAnchor="middle" fontSize="16" fontWeight="600" fill="#f5f5f5">пишет код · PoC · спека</text>
            <text x="165" y="198" textAnchor="middle" fontSize="14" fill="#a0a0a0">вся репа · отдельный каталог</text>
            <text x="165" y="240" textAnchor="middle" fontSize="13" fill="#a0a0a0" fontStyle="italic">Claude Code · свои скиллы</text>
          </g>

          {/* Стрелка PM → Механизм */}
          <path d="M 312 155 L 408 155" stroke="#ff9a4c" strokeWidth="2" markerEnd="url(#arr-rm)" fill="none" />

          {/* Артефакты / Контракт в центре */}
          <g>
            <rect x="410" y="50" width="460" height="210" rx="14" fill="#0a0a0a" stroke="#ff6b00" strokeWidth="2" strokeDasharray="6 4" />
            <text x="640" y="85" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              механизм связки
            </text>
            <text x="640" y="122" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff6b00">Артефакты / Контракт</text>
            <line x1="450" y1="140" x2="830" y2="140" stroke="#2a2a2a" />
            <text x="640" y="170" textAnchor="middle" fontSize="16" fill="#f5f5f5">спека / требования → контракт</text>
            <text x="640" y="200" textAnchor="middle" fontSize="16" fill="#f5f5f5">промпты + скиллы</text>
            <text x="640" y="240" textAnchor="middle" fontSize="14" fill="#a0a0a0" fontStyle="italic">версионируется как код</text>
          </g>

          {/* Стрелка Механизм → PE */}
          <path d="M 872 155 L 968 155" stroke="#ff9a4c" strokeWidth="2" markerEnd="url(#arr-rm)" fill="none" />

          {/* Delivery над ролью 2 */}
          <text x="1115" y="30" textAnchor="middle" fontSize="18" fontWeight="700" fill="#ff9a4c" style={{ letterSpacing: '0.05em' }}>DELIVERY</text>

          {/* Product Engineer справа */}
          <g>
            <rect x="970" y="50" width="290" height="210" rx="14" fill="#141414" stroke="#ff9a4c" strokeWidth="2" />
            <text x="1115" y="85" textAnchor="middle" fontSize="14" fill="#a0a0a0" style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              роль 2
            </text>
            <text x="1115" y="120" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ff9a4c">Product Engineer</text>
            <line x1="1010" y1="140" x2="1220" y2="140" stroke="#2a2a2a" />
            <text x="1115" y="168" textAnchor="middle" fontSize="14" fontWeight="600" fill="#f5f5f5">адаптирует · тестирует · встраивает</text>
            <text x="1115" y="198" textAnchor="middle" fontSize="16" fill="#f5f5f5">прод-качество</text>
            <text x="1115" y="240" textAnchor="middle" fontSize="13" fill="#a0a0a0" fontStyle="italic">Claude Code · свои скиллы</text>
          </g>

          {/* Обратная стрелка: Delivery → Артефакты (правит спеку) */}
          <text x="920" y="195" textAnchor="middle" fontSize="12" fill="#555" fontStyle="italic">правит спеку</text>
          <path d="M 968 204 L 872 204" stroke="#555" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr-feedback)" fill="none" />

          {/* Подпись внизу */}
          <text x="640" y="310" textAnchor="middle" fontSize="16" fill="#555" fontStyle="italic">всё в репе</text>
        </svg>
      </div>

      <div className="callout" style={{ marginTop: 'auto' }}>
        Есть условный product manager и есть условный product engineer. Все, у кого это работает — делают примерно одинаково.
      </div>

    </div>
  )
}
