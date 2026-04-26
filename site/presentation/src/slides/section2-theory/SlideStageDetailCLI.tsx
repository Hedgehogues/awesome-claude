import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'stage-detail-cli',
  title: 'Этап 5: CLI как точка перелома',
  section: 2,
  notes:
    'Этап 5 — Claude Code / Claude CLI — точка перелома. До этого агент помогает в IDE. После — агент запускается из терминала, ведёт длинные сессии с tools и MCP. Боттлнек переезжает из разработки в архитектуру. Ссылки: interview-id-86 (переезд боттлнека), interview-id-24 (длинные сессии, MCP-сервера).',
}

export default function SlideStageDetailCLI() {
  return (
    <div className="slide-container">
      <h1>Этап 5: CLI как точка перелома</h1>
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
          <svg viewBox="0 0 120 90" width="120" height="90">
            <rect x="4" y="4" width="112" height="82" rx="8" fill="#0a0a0a" stroke="var(--accent)" strokeWidth="2" />
            <text x="16" y="28" fontSize="11" fill="var(--accent)" fontFamily="monospace" fontWeight="700">
              $ claude
            </text>
            <text x="16" y="46" fontSize="10" fill="var(--fg-muted)" fontFamily="monospace">
              {'> analyzing...'}
            </text>
            <text x="16" y="62" fontSize="10" fill="var(--fg-muted)" fontFamily="monospace">
              {'> writing code'}
            </text>
            <text x="16" y="78" fontSize="10" fill="#888" fontFamily="monospace">
              {'> done ✓'}
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
            5
          </p>
        </div>

        <ul style={{ fontSize: 'var(--size-body)', lineHeight: 1.6 }}>
          <li>
            <strong>Что меняется:</strong> агент из IDE переходит в терминал — длинные сессии, bash, MCP-серверы
          </li>
          <li>
            <strong>Пример:</strong> Claude Code — запускает тесты, читает базы, коммитит код
          </li>
          <li>
            <strong>Боттлнек переезжает:</strong> из разработки — в архитектуру. Без спеки агент «додумывает»
          </li>
          <li>
            <strong>Решение:</strong> структурировать работу через формальные подходы — архитектуру, спеку и верификацию
          </li>
        </ul>
      </div>
    </div>
  )
}
