import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'spec-repo',
  title: 'Spec-репа',
  section: 2,
  notes:
    'Ключевой паттерн доклада. Spec-репа — отдельный артефакт-стор: specs/, ADR, требования. Инженеры управляют ей через PR-дельты (как код). Code-репа подтягивает арх-репу как источник правды — агенты генерируют код по спеке. Решает мульти-репо дыру SDD: один набор требований на N сервисов.',
}

/*
  ViewBox 1200×390. Два ряда:
    Ряд 1: y=72..176 (h=104), center=124  — платформенный слой / code-репа A
    Ряд 2: y=194..298 (h=104), center=246 — спеки по репам  / code-репа B
  Внешние боксы: y=30..318 (h=288), центр 174 ≈ средина двух рядов (124+246)/2=185 ✓
  Люди: платф. инж. cx=62 cy=124; инженеры cx=62 cy=215,246,277 (r=15, шаг 31px ≥ 2r=30 ✓)
*/

export default function SlideArchRepo() {
  return (
    <div className="slide-container">
      <h1>Spec-репа</h1>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.2rem 0' }}>
        <svg viewBox="0 0 1200 390" style={{ width: '100%', maxWidth: 1200, height: 'auto' }}>
          <defs>
            <marker id="arch-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6b00" />
            </marker>
            <marker id="arch-grey" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#a0a0a0" />
            </marker>
            <marker id="arch-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a90d9" />
            </marker>
            <marker id="arch-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e05252" />
            </marker>
          </defs>

          <g transform="translate(-13 0)">
          {/* ── БОКСЫ ── */}

          {/* Spec-репа: x=130..430, y=30..320 */}
          <rect x="130" y="30" width="300" height="290" rx="14" fill="#141414" stroke="#ff6b00" strokeWidth="2" />
          <text x="280" y="58" textAnchor="middle" fontSize="20" fontWeight="700" fill="#ff6b00">Spec-репа</text>

          {/* Платформенный слой: y=72..176, center=124 */}
          <rect x="148" y="72" width="264" height="104" rx="8" fill="#0d1a2a" stroke="#4a90d9" strokeWidth="1.2" />
          <text x="280" y="92" textAnchor="middle" fontSize="10" fill="#4a90d9" style={{ textTransform: 'uppercase', letterSpacing: '0.09em' }}>платформенный слой</text>
          <text x="280" y="114" textAnchor="middle" fontSize="12" fill="#f5f5f5">скиллы · rules · ADR</text>
          <text x="280" y="134" textAnchor="middle" fontSize="12" fill="#f5f5f5">.cursorrules · conventions</text>

          {/* Спеки по репам: y=194..298, center=246 */}
          <rect x="148" y="194" width="264" height="104" rx="8" fill="#1a1200" stroke="#ff9a4c" strokeWidth="1.2" />
          <text x="280" y="214" textAnchor="middle" fontSize="10" fill="#ff9a4c" style={{ textTransform: 'uppercase', letterSpacing: '0.09em' }}>спеки по репам</text>
          <text x="280" y="236" textAnchor="middle" fontSize="12" fill="#f5f5f5">specs/repo-A/ · specs/repo-B/</text>
          <text x="280" y="256" textAnchor="middle" fontSize="11" fill="#a0a0a0">подтягивается как зависимость</text>
          <text x="280" y="274" textAnchor="middle" fontSize="11" fill="#a0a0a0">в каждую code-репу</text>

          {/* Code-репа A: y=72..176, center=124 */}
          <rect x="512" y="72" width="200" height="104" rx="10" fill="#1e1e1e" stroke="#2a2a2a" />
          <text x="612" y="118" textAnchor="middle" fontSize="15" fontWeight="600" fill="#f5f5f5">code-репа A</text>
          <text x="612" y="142" textAnchor="middle" fontSize="12" fill="#a0a0a0">сервис / фронт</text>

          {/* Code-репа B: y=194..298, center=246 */}
          <rect x="512" y="194" width="200" height="104" rx="10" fill="#1e1e1e" stroke="#2a2a2a" />
          <text x="612" y="240" textAnchor="middle" fontSize="15" fontWeight="600" fill="#f5f5f5">code-репа B</text>
          <text x="612" y="264" textAnchor="middle" fontSize="12" fill="#a0a0a0">соседний сервис</text>

          {/* «и так далее» — текстовая аннотация, не бокс */}
          <text x="612" y="330" textAnchor="middle" fontSize="12" fill="#555" fontStyle="italic">… и другие репо</text>

          {/* K8s: x=748..1182, y=30..320 */}
          <rect x="748" y="30" width="434" height="290" rx="14" fill="#0d1a2a" stroke="#4a90d9" strokeWidth="2" />
          <text x="780" y="53" fontSize="11" fill="#4a90d9" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>k8s кластер</text>

          {/* prod: x=765..939, y=62..308 */}
          <rect x="765" y="62" width="174" height="246" rx="9" fill="#0a1520" stroke="#2a4a6a" />
          <text x="852" y="178" textAnchor="middle" fontSize="18" fontWeight="600" fill="#f5f5f5">prod</text>
          <text x="852" y="202" textAnchor="middle" fontSize="12" fill="#a0a0a0">основной трафик</text>

          {/* canary: x=955..1175, y=62..308 */}
          <rect x="955" y="62" width="220" height="246" rx="9" fill="#0a1520" stroke="#ff9a4c" strokeWidth="1.5" />
          <text x="1065" y="158" textAnchor="middle" fontSize="18" fontWeight="600" fill="#ff9a4c">canary</text>
          <text x="1065" y="184" textAnchor="middle" fontSize="12" fill="#a0a0a0">5% трафика</text>
          <text x="1065" y="208" textAnchor="middle" fontSize="11" fill="#a0a0a0" fontStyle="italic">новая версия</text>

          {/* ── СТРЕЛКИ ── */}

          {/* Платф. инж. → платформенный слой, y=124 */}
          <path d="M 77 124 L 146 124" fill="none" stroke="#4a90d9" strokeWidth="1.8" markerEnd="url(#arch-blue)" />

          {/* Инженеры → спеки по репам, ведём к center=246 */}
          <path d="M 77 218 L 146 238" fill="none" stroke="#a0a0a0" strokeWidth="1.5" markerEnd="url(#arch-grey)" />
          <path d="M 77 246 L 146 246" fill="none" stroke="#a0a0a0" strokeWidth="1.5" markerEnd="url(#arch-grey)" />
          <path d="M 77 274 L 146 254" fill="none" stroke="#a0a0a0" strokeWidth="1.5" markerEnd="url(#arch-grey)" />

          {/* Spec-репа → code-репы, горизонтально */}
          <path d="M 430 124 L 510 124" fill="none" stroke="#ff6b00" strokeWidth="2" markerEnd="url(#arch-orange)" />
          <path d="M 430 246 L 510 246" fill="none" stroke="#ff6b00" strokeWidth="2" markerEnd="url(#arch-orange)" />

          {/* Code-репы → k8s, горизонтально */}
          <path d="M 712 124 L 746 124" fill="none" stroke="#4a90d9" strokeWidth="1.5" markerEnd="url(#arch-blue)" />
          <path d="M 712 246 L 746 246" fill="none" stroke="#4a90d9" strokeWidth="1.5" markerEnd="url(#arch-blue)" />

          {/* Откат: canary → prod */}
          <path d="M 1065 308 C 1040 360 870 360 852 308" fill="none" stroke="#e05252" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arch-red)" />

          {/* ── ЛЮДИ ── */}

          {/* Платф. инженер, cy=124 */}
          <circle cx="62" cy="124" r="18" fill="#1e1e1e" stroke="#4a90d9" strokeWidth="2" />
          <text x="62" y="130" textAnchor="middle" fontSize="12" fill="#f5f5f5">👤</text>
          <text x="62" y="157" textAnchor="middle" fontSize="11" fill="#4a90d9">платф. инж.</text>

          {/* Инженеры: cy=218,246,274, r=15, шаг=28px > 2r=30 — чуть соприкасаются, визуально ок */}
          <circle cx="62" cy="218" r="15" fill="#1e1e1e" stroke="#a0a0a0" />
          <text x="62" y="223" textAnchor="middle" fontSize="11" fill="#f5f5f5">👤</text>
          <circle cx="62" cy="249" r="15" fill="#1e1e1e" stroke="#a0a0a0" />
          <text x="62" y="254" textAnchor="middle" fontSize="11" fill="#f5f5f5">👤</text>
          <circle cx="62" cy="280" r="15" fill="#1e1e1e" stroke="#a0a0a0" />
          <text x="62" y="285" textAnchor="middle" fontSize="11" fill="#f5f5f5">👤</text>
          <text x="62" y="312" textAnchor="middle" fontSize="11" fill="#a0a0a0">инженеры</text>

          {/* ── ПОДПИСИ ── */}
          <text x="108" y="350" textAnchor="middle" fontSize="12" fill="#ff9a4c" fontStyle="italic">PR</text>
          <text x="470" y="350" textAnchor="middle" fontSize="11" fill="#ff9a4c" fontStyle="italic">зависимость</text>
          <text x="612" y="350" textAnchor="middle" fontSize="11" fill="#ff9a4c" fontStyle="italic">агенты генерируют код по спеке</text>
          <text x="958" y="378" textAnchor="middle" fontSize="12" fill="#e05252" fontStyle="italic">откат если нужно</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
