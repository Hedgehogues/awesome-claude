import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'stage-detail-orchestration',
  title: 'Этапы 6–8: параллельность и оркестрация',
  section: 2,
  notes:
    'Этапы 6–8 — переход от одного агента к нескольким инстансам, потом к параллельным агентам в git worktree, потом к оркестрации по доменам. Здесь SDD критичен: без единой спеки агенты дивергируют. Ссылки: interview-id-86 (DDD + агент на домен), interview-id-24 (параллельные worktree). Финальный тезис доклада: оркестрация по доменам — где SDD даёт наибольший ROI.',
}

export default function SlideStageDetailOrchestration() {
  return (
    <div className="slide-container">
      <h1>Этапы 6–8: параллельность и оркестрация</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2.5rem',
          marginTop: '1rem',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <svg viewBox="0 0 120 100" width="120" height="100">
            {/* Оркестратор */}
            <circle cx="60" cy="16" r="12" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <text x="60" y="20" textAnchor="middle" fontSize="7" fill="var(--accent)" fontWeight="700">
              orch
            </text>
            {/* Линии к агентам */}
            <line x1="48" y1="26" x2="20" y2="72" stroke="#555" strokeWidth="1.5" />
            <line x1="60" y1="28" x2="60" y2="72" stroke="#555" strokeWidth="1.5" />
            <line x1="72" y1="26" x2="100" y2="72" stroke="#555" strokeWidth="1.5" />
            {/* Агенты */}
            <circle cx="20" cy="80" r="10" fill="none" stroke="#555" strokeWidth="1.5" />
            <text x="20" y="83" textAnchor="middle" fontSize="6" fill="var(--fg-muted)">
              A
            </text>
            <circle cx="60" cy="80" r="10" fill="none" stroke="#555" strokeWidth="1.5" />
            <text x="60" y="83" textAnchor="middle" fontSize="6" fill="var(--fg-muted)">
              B
            </text>
            <circle cx="100" cy="80" r="10" fill="none" stroke="#555" strokeWidth="1.5" />
            <text x="100" y="83" textAnchor="middle" fontSize="6" fill="var(--fg-muted)">
              C
            </text>
          </svg>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--size-small)',
            }}
          >
            6 → 8
          </p>
        </div>

        <ul style={{ fontSize: 'var(--size-body)', lineHeight: 1.7 }}>
          <li>
            <strong>Что меняется:</strong> несколько агентов в git worktree, оркестратор распределяет задачи
          </li>
          <li>
            <strong>Пример:</strong> TDD + SDD + DDD — тесты как критерий готовности, спека как задание, домен как изоляция
          </li>
          <li>
            <strong>Боттлнек:</strong> токены и время фокуса разработчика — не хватает ни того, ни другого
          </li>
          <li>
            <strong>Решение:</strong> автономный агент на сервере — на основе логов, задач и скиллов с MCP
          </li>
        </ul>
      </div>
    </div>
  )
}
