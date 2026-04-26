import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'eight-stages-overview',
  title: '8 этапов внедрения AI — обзор',
  section: 2,
  notes:
    'Обзорный слайд с визуальными карточками. Цель — задать систему координат: где находится аудитория? Каждая карточка = шаг зрелости. Акцент: каждая следующая ступень снимает боттлнек предыдущей. Детали — на 3 следующих слайдах.',
}

const stages = [
  {
    n: 1,
    name: 'Автокомплит',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        <rect x="4" y="4" width="56" height="48" rx="6" fill="none" stroke="#555" strokeWidth="1.5" />
        <rect x="4" y="4" width="56" height="14" rx="6" fill="#1e1e1e" />
        <line x1="12" y1="30" x2="40" y2="30" stroke="#555" strokeWidth="1.5" />
        <line x1="12" y1="38" x2="52" y2="38" stroke="#555" strokeWidth="1.5" />
        <line x1="40" y1="30" x2="52" y2="30" stroke="var(--accent)" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    n: 2,
    name: 'Чат с Y/N',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Цепочка шагов с паузами Y/N */}
        <circle cx="8" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <text x="19" y="14" textAnchor="middle" fontSize="6" fill="var(--accent)" fontWeight="700">Y</text>
        <text x="19" y="21" textAnchor="middle" fontSize="6" fill="var(--fg-subtle)">N</text>
        <circle cx="30" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <text x="41" y="14" textAnchor="middle" fontSize="6" fill="var(--accent)" fontWeight="700">Y</text>
        <text x="41" y="21" textAnchor="middle" fontSize="6" fill="var(--fg-subtle)">N</text>
        <circle cx="52" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        {/* Итог — бледный, до него долго */}
        <circle cx="32" cy="44" r="10" fill="none" stroke="#555" strokeWidth="1.5" />
        <polyline points="27,44 31,49 38,38" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: 3,
    name: 'YOLO-режим',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Цепочка шагов агента без остановок */}
        <circle cx="10" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="15" y1="16" x2="22" y2="16" stroke="#555" strokeWidth="1.2" />
        <circle cx="27" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="32" y1="16" x2="39" y2="16" stroke="#555" strokeWidth="1.2" />
        <circle cx="44" cy="16" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="49" y1="16" x2="56" y2="16" stroke="#555" strokeWidth="1.2" />
        {/* Итог — галочка в кружке */}
        <circle cx="32" cy="40" r="12" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <polyline points="25,40 30,46 40,33" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: 4,
    name: 'YOLO + контекст',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Файл контекста сверху (CLAUDE.md / memory) */}
        <rect x="22" y="2" width="20" height="14" rx="2" fill="#1e1e1e" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="26" y1="7" x2="38" y2="7" stroke="var(--accent)" strokeWidth="1" />
        <line x1="26" y1="11" x2="35" y2="11" stroke="var(--accent)" strokeWidth="1" />
        {/* Стрелки контекст → шаги */}
        <line x1="20" y1="16" x2="12" y2="22" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="32" y1="16" x2="32" y2="22" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="44" y1="16" x2="52" y2="22" stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 2" />
        {/* Цепочка шагов */}
        <circle cx="10" cy="28" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="15" y1="28" x2="22" y2="28" stroke="#555" strokeWidth="1.2" />
        <circle cx="27" cy="28" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="32" y1="28" x2="39" y2="28" stroke="#555" strokeWidth="1.2" />
        <circle cx="44" cy="28" r="5" fill="#1e1e1e" stroke="#555" strokeWidth="1.5" />
        <line x1="49" y1="28" x2="56" y2="28" stroke="#555" strokeWidth="1.2" />
        {/* Итог */}
        <circle cx="32" cy="47" r="7" fill="none" stroke="var(--accent)" strokeWidth="2" />
        <polyline points="28,47 31,51 37,42" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    n: 5,
    name: 'CLI · Claude Code',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        <rect x="4" y="4" width="56" height="48" rx="6" fill="#2a2a2a" stroke="var(--accent)" strokeWidth="1.5" />
        <text x="12" y="26" fontSize="8.5" fill="var(--accent)" fontFamily="monospace">$ claude</text>
        <text x="12" y="38" fontSize="8.5" fill="var(--fg-muted)" fontFamily="monospace">{'> run...'}</text>
      </svg>
    ),
  },
  {
    n: 6,
    name: 'Несколько инстансов',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Терминал 1 */}
        <rect x="3" y="8" width="27" height="40" rx="5" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="3" y="8" width="27" height="9" rx="5" fill="#1a1a1a" />
        <circle cx="10" cy="12" r="2" fill="var(--accent)" />
        <line x1="8" y1="24" x2="24" y2="24" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="8" y1="30" x2="20" y2="30" stroke="#555" strokeWidth="1.2" />
        <line x1="8" y1="36" x2="22" y2="36" stroke="#555" strokeWidth="1.2" />
        {/* Терминал 2 */}
        <rect x="34" y="8" width="27" height="40" rx="5" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="34" y="8" width="27" height="9" rx="5" fill="#1a1a1a" />
        <circle cx="41" cy="12" r="2" fill="var(--accent)" />
        <line x1="39" y1="24" x2="55" y2="24" stroke="var(--accent)" strokeWidth="1.5" />
        <line x1="39" y1="30" x2="51" y2="30" stroke="#555" strokeWidth="1.2" />
        <line x1="39" y1="36" x2="53" y2="36" stroke="#555" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    n: 7,
    name: 'Параллельные агенты',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Терминал 1 */}
        <rect x="1" y="8" width="18" height="40" rx="4" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="1" y="8" width="18" height="8" rx="4" fill="#1a1a1a" />
        <circle cx="6" cy="12" r="1.5" fill="var(--accent)" />
        <line x1="4" y1="22" x2="16" y2="22" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="4" y1="28" x2="14" y2="28" stroke="#555" strokeWidth="1" />
        <line x1="4" y1="34" x2="15" y2="34" stroke="#555" strokeWidth="1" />
        {/* Терминал 2 */}
        <rect x="23" y="8" width="18" height="40" rx="4" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="23" y="8" width="18" height="8" rx="4" fill="#1a1a1a" />
        <circle cx="28" cy="12" r="1.5" fill="var(--accent)" />
        <line x1="26" y1="22" x2="38" y2="22" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="26" y1="28" x2="36" y2="28" stroke="#555" strokeWidth="1" />
        <line x1="26" y1="34" x2="37" y2="34" stroke="#555" strokeWidth="1" />
        {/* Терминал 3 — акцент */}
        <rect x="45" y="8" width="18" height="40" rx="4" fill="#2a2a2a" stroke="var(--accent)" strokeWidth="1.5" />
        <rect x="45" y="8" width="18" height="8" rx="4" fill="#1a1a1a" />
        <circle cx="50" cy="12" r="1.5" fill="var(--accent)" />
        <line x1="48" y1="22" x2="60" y2="22" stroke="var(--accent)" strokeWidth="1.2" />
        <line x1="48" y1="28" x2="58" y2="28" stroke="#555" strokeWidth="1" />
        <line x1="48" y1="34" x2="59" y2="34" stroke="#555" strokeWidth="1" />
      </svg>
    ),
  },
  {
    n: 8,
    name: 'Оркестрация',
    icon: (
      <svg viewBox="0 0 64 56" width="64" height="56">
        {/* Оркестратор */}
        <rect x="20" y="2" width="24" height="16" rx="4" fill="#141414" stroke="var(--accent)" strokeWidth="2" />
        <text x="32" y="13" textAnchor="middle" fontSize="7" fill="var(--accent)" fontWeight="700">orch</text>
        {/* Линии */}
        <line x1="22" y1="18" x2="10" y2="36" stroke="#555" strokeWidth="1.5" />
        <line x1="32" y1="18" x2="32" y2="36" stroke="#555" strokeWidth="1.5" />
        <line x1="42" y1="18" x2="54" y2="36" stroke="#555" strokeWidth="1.5" />
        {/* Агенты-домены */}
        <rect x="2" y="38" width="16" height="14" rx="3" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="24" y="38" width="16" height="14" rx="3" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
        <rect x="46" y="38" width="16" height="14" rx="3" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" />
      </svg>
    ),
  },
]

export default function SlideEightStagesOverview() {
  return (
    <div className="slide-container">
      <h1>Где вы сейчас?</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginTop: '0.75rem',
        }}
      >
        {stages.map((s) => (
          <div
            key={s.n}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.75rem 0.5rem',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '10px',
              gap: '0.4rem',
            }}
          >
            {s.icon}
            <div style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', fontSize: 'var(--size-small)' }}>
              {s.n}
            </div>
            <div style={{ fontSize: 'var(--size-small)', color: '#e0e0e0', textAlign: 'center', fontWeight: 600 }}>
              {s.name}
            </div>
          </div>
        ))}
      </div>
      <div className="callout" style={{ marginTop: 'auto' }}>
        Каждая ступень снимает боттлнек предыдущей.
      </div>
    </div>
  )
}
