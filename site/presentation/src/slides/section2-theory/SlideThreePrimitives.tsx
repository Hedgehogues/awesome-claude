import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'three-primitives',
  title: 'Механика паттернов',
  section: 2,
  notes:
    'Главная мысль: это не три альтернативы — это система. Процесс — контейнер, Роль — актор на каждом этапе, Артефакт — то, что движется и трансформируется. PM/Arch/Dev — пример (BMAD), не жёсткая схема. Ключевой инсайт: именно потому что они оперируют разными примитивами, их можно комбинировать без конфликта — GSD-процесс + OpenSpec-артефакты работают вместе. Переход: "Зная эти три измерения, посмотрим на полный ландшафт."',
}

// Layout constants
const W = 760
const H = 200
const LEGEND_X = 10
const DIAGRAM_START = 162
const TRACK_Y = 95
const NODES_X = [282, 462, 642]
const DOC_LEFT_X = 187
const DOC_RIGHT_X = 707
const DOC_SIZE = 18

function docPath(cx: number, cy: number, s: number) {
  // Document shape: rectangle with folded top-right corner
  const w = s * 0.75
  const h = s
  const fold = s * 0.28
  const x = cx - w / 2
  const y = cy - h / 2
  return `M${x},${y} L${x + w - fold},${y} L${x + w},${y + fold} L${x + w},${y + h} L${x},${y + h} Z
          M${x + w - fold},${y} L${x + w - fold},${y + fold} L${x + w},${y + fold}`
}

export default function SlideThreePrimitives() {
  return (
    <div className="slide-container">
      <h1>Механика паттернов</h1>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          fill="none"
        >
          {/* ── Left legend ── */}
          {/* АРТЕФАКТ label — aligned with doc/track level */}
          <text x={LEGEND_X} y={TRACK_Y - 1} fontSize="11" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="1">
            АРТЕФАКТ
          </text>
          {/* РОЛЬ label — aligned with person icons */}
          <text x={LEGEND_X} y={TRACK_Y - 46} fontSize="11" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="1">
            РОЛЬ
          </text>
          {/* ПРОЦЕСС label — aligned with stage labels below */}
          <text x={LEGEND_X} y={TRACK_Y + 42} fontSize="11" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="1">
            ПРОЦЕСС
          </text>

          {/* ── Category badges — all left-aligned at x=84, width=36 ── */}
          {/* AR badge — РОЛЬ (y-center=44) */}
          <rect x="84" y="37" width="36" height="14" rx="3" stroke="#ff9a4c" strokeWidth="0.8" fill="none" />
          <text x="102" y="48" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="0.5">AR</text>
          {/* SDD badge — АРТЕФАКТ (y-center=90) */}
          <rect x="84" y="83" width="36" height="14" rx="3" stroke="#ff9a4c" strokeWidth="0.8" fill="none" />
          <text x="102" y="94" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="0.5">SDD</text>
          {/* AW badge — ПРОЦЕСС (y-center=132) */}
          <rect x="84" y="125" width="36" height="14" rx="3" stroke="#ff9a4c" strokeWidth="0.8" fill="none" />
          <text x="102" y="136" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ff9a4c" fontFamily="system-ui, sans-serif" letterSpacing="0.5">AW</text>

          {/* ── Icons after badges (x=134 center) ── */}
          {/* Person icon — РОЛЬ, center (134, 44) */}
          <circle cx="134" cy="40" r="3.5" stroke="#ff9a4c" strokeWidth="1" />
          <path d="M128,49 C128,45.5 130.5,44 134,44 C137.5,44 140,45.5 140,49" stroke="#ff9a4c" strokeWidth="1" strokeLinecap="round" />
          {/* Document icon — АРТЕФАКТ, center (134, 90) */}
          <path d="M130,84 L136,84 L139,87 L139,96 L130,96 Z M136,84 L136,87 L139,87" stroke="#ff9a4c" strokeWidth="1" strokeLinejoin="round" />
          {/* Three-nodes icon — ПРОЦЕСС, center (134, 132) */}
          <circle cx="127" cy="132" r="2" stroke="#ff9a4c" strokeWidth="1" />
          <circle cx="134" cy="132" r="2" stroke="#ff9a4c" strokeWidth="1" />
          <circle cx="141" cy="132" r="2" stroke="#ff9a4c" strokeWidth="1" />
          <line x1="129.5" y1="132" x2="131.5" y2="132" stroke="#ff9a4c" strokeWidth="1" strokeLinecap="round" />
          <line x1="136.5" y1="132" x2="138.5" y2="132" stroke="#ff9a4c" strokeWidth="1" strokeLinecap="round" />

          {/* ── Divider between legend and diagram ── */}
          <line x1={DIAGRAM_START - 10} y1="20" x2={DIAGRAM_START - 10} y2={H - 10} stroke="#2a2a2a" strokeWidth="1" />

          {/* ── Document icon LEFT (input spec) ── */}
          <path d={docPath(DOC_LEFT_X, TRACK_Y, DOC_SIZE)} stroke="#ff9a4c" strokeWidth="1.5" strokeLinejoin="round" fill="#1a1a1a" />
          <text x={DOC_LEFT_X} y={TRACK_Y + DOC_SIZE / 2 + 14} textAnchor="middle" fontSize="10" fill="#888" fontFamily="monospace">
            spec
          </text>

          {/* ── Horizontal track ── */}
          <line
            x1={DOC_LEFT_X + DOC_SIZE / 2 + 4}
            y1={TRACK_Y}
            x2={DOC_RIGHT_X - DOC_SIZE / 2 - 4}
            y2={TRACK_Y}
            stroke="#ff9a4c"
            strokeWidth="1.5"
          />

          {/* ── Track arrow at end ── */}
          <polyline
            points={`${DOC_RIGHT_X - DOC_SIZE / 2 - 10},${TRACK_Y - 5} ${DOC_RIGHT_X - DOC_SIZE / 2 - 4},${TRACK_Y} ${DOC_RIGHT_X - DOC_SIZE / 2 - 10},${TRACK_Y + 5}`}
            stroke="#ff9a4c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* ── Document icon RIGHT (output spec') ── */}
          <path d={docPath(DOC_RIGHT_X, TRACK_Y, DOC_SIZE)} stroke="#ff9a4c" strokeWidth="1.5" strokeLinejoin="round" fill="#1a1a1a" />
          <text x={DOC_RIGHT_X} y={TRACK_Y + DOC_SIZE / 2 + 14} textAnchor="middle" fontSize="10" fill="#888" fontFamily="monospace">
            spec'
          </text>

          {/* ── Nodes, person icons, stage labels ── */}
          {NODES_X.map((nx, i) => {
            const roles = ['PM', 'Analyst', 'Dev']
            const stages = ['Discovery', 'Design', 'Delivery']
            const stageColors = ['#666', '#888', '#888']
            const personY = TRACK_Y - 28
            const headR = 7
            const headCy = personY - headR - 2

            return (
              <g key={nx}>
                {/* Node circle on track */}
                <circle cx={nx} cy={TRACK_Y} r="6" fill="#0a0a0a" stroke="#ff9a4c" strokeWidth="2" />

                {/* Vertical connector to person */}
                <line x1={nx} y1={TRACK_Y - 6} x2={nx} y2={personY + 4} stroke="#333" strokeWidth="1" strokeDasharray="2 2" />

                {/* Person head */}
                <circle cx={nx} cy={headCy} r={headR} fill="#1a1a1a" stroke="#ff9a4c" strokeWidth="1.5" />

                {/* Person shoulders */}
                <path
                  d={`M${nx - 13},${headCy + headR + 14} C${nx - 13},${headCy + headR + 6} ${nx - 6},${headCy + headR + 2} ${nx},${headCy + headR + 2} C${nx + 6},${headCy + headR + 2} ${nx + 13},${headCy + headR + 6} ${nx + 13},${headCy + headR + 14}`}
                  stroke="#ff9a4c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Role label above person */}
                <text
                  x={nx}
                  y={headCy - headR - 5}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#f5f5f5"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="500"
                >
                  {roles[i]}
                </text>

                {/* Stage label below track */}
                <text
                  x={nx}
                  y={TRACK_Y + 24}
                  textAnchor="middle"
                  fontSize="11"
                  fill={stageColors[i]}
                  fontFamily="system-ui, sans-serif"
                >
                  {stages[i]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
