import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'stage-detail-early',
  title: 'Этапы 1–4: эволюция ассистента',
  section: 2,
  notes:
    'Этапы 1–4 — переход от пассивного автокомплита к активному агенту, который работает без подтверждений. Боттлнек на этапах 1–4: сам разработчик — он не доверяет AI, постоянно прерывает. Каждое следующее поколение инструментов снижает трение. Ссылки: interview-id-24 (боттлнек в разработчике), interview-id-86 (переход к YOLO — «это страшно только первые 20 минут»).',
}

export default function SlideStageDetailEarly() {
  return (
    <div className="slide-container">
      <h1>Этапы 1–4: эволюция ассистента</h1>
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
          {/* Цепочка: автокомплит → Y/N → YOLO → YOLO+контекст */}
          <svg viewBox="0 0 100 110" width="100" height="110">
            {/* 1: автокомплит */}
            <rect x="10" y="2" width="36" height="24" rx="4" fill="#0a0a0a" stroke="#555" strokeWidth="1.5" />
            <line x1="15" y1="11" x2="34" y2="11" stroke="#555" strokeWidth="1" />
            <line x1="34" y1="11" x2="40" y2="11" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="2 1" />
            <line x1="15" y1="18" x2="30" y2="18" stroke="#555" strokeWidth="1" />
            <text x="58" y="17" textAnchor="middle" fontSize="8" fill="#888">1</text>
            {/* стрелка вниз */}
            <line x1="28" y1="26" x2="28" y2="34" stroke="#555" strokeWidth="1" markerEnd="url(#arr-d)" />
            {/* 2: Y/N */}
            <rect x="10" y="36" width="36" height="24" rx="4" fill="#0a0a0a" stroke="#555" strokeWidth="1.5" />
            <rect x="13" y="48" width="10" height="8" rx="2" fill="var(--accent)" />
            <text x="18" y="55" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700">Y</text>
            <rect x="27" y="48" width="10" height="8" rx="2" fill="none" stroke="#555" strokeWidth="1" />
            <text x="32" y="55" textAnchor="middle" fontSize="6" fill="#888">N</text>
            <text x="58" y="51" textAnchor="middle" fontSize="8" fill="#888">2</text>
            {/* стрелка вниз */}
            <line x1="28" y1="60" x2="28" y2="68" stroke="#555" strokeWidth="1" />
            {/* 3: YOLO */}
            <rect x="10" y="70" width="36" height="20" rx="4" fill="#0a0a0a" stroke="#555" strokeWidth="1.5" />
            <circle cx="22" cy="80" r="6" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <polyline points="18,80 21,84 27,75" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="58" y="83" textAnchor="middle" fontSize="8" fill="#888">3–4</text>
            <defs>
              <marker id="arr-d" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M 0 0 L 4 6 L 8 0" fill="none" stroke="#555" strokeWidth="1.5" />
              </marker>
            </defs>
          </svg>
          <p style={{ textAlign: 'center', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 'var(--size-small)' }}>
            1 → 4
          </p>
        </div>

        <ul style={{ fontSize: 'var(--size-body)', lineHeight: 1.7 }}>
          <li>
            <strong>Что меняется:</strong> от строчки-подсказки до агента, который сам пишет файлы и запускает тесты без подтверждений
          </li>
          <li>
            <strong>Пример:</strong> Cursor → Copilot → ранний Cline в YOLO-режиме + контекст из memory-файлов
          </li>
          <li>
            <strong>Боттлнек здесь:</strong> сам разработчик — недоверие к AI, постоянные прерывания, откат к старой привычке
          </li>
          <li>
            <strong>Решение:</strong> воркшопы, корпоративные подписки, обучение — и принудительный сдвиг
          </li>
        </ul>
      </div>
    </div>
  )
}
