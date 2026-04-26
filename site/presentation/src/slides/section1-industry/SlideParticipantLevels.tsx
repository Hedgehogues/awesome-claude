import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'participant-levels',
  title: 'Уровни участников',
  section: 1,
  notes:
    'Из chat-agent-coding. Ключевой тезис: SDD не только для разработчиков. Shift left — PM, аналитики, продакты, даже режиссёры. Кейсы: interview-id-3 (PM делает кликабельный прототип), interview-id-68 (владелец онлайн-школы вайбкодит), chat-vibe-coding (режиссёр монтажа пишет AE-скрипты).',
}

export default function SlideParticipantLevels() {
  return (
    <div className="slide-container">
      <h1>Кто сейчас использует AI</h1>
      <ul>
        <li><strong>Новички</strong> — 60%. «Слышал про агентов, хочу вкатиться»</li>
        <li><strong>Продвинутые</strong> — 25%. Tmux с 4 Claude, MCP, эксперименты</li>
        <li><strong>Техлиды</strong> — 10%. Внедряют в командах, строят процессы</li>
        <li><strong>Основатели / CTO</strong> — 5%. Строят продукт поверх AI</li>
        <li><strong>Не-разработчики</strong> — 10%. PM, аналитики, дизайнеры, режиссёры</li>
      </ul>
      <p className="callout" style={{ marginTop: 'auto' }}>
        SDD нужен не только разработчикам. Shift left захватывает PM и аналитиков.
      </p>
    </div>
  )
}
