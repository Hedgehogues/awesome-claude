import type { SlideMeta } from '@/types/slide'
import { config } from '@/data/config'

export const meta: SlideMeta = {
  id: 'cover',
  title: 'Cover',
  section: 1,
  notes:
    'Представиться. Сказать что доклад про то, как SDD помогает сохранить контроль в эпоху AI-агентов. Предупредить: во второй половине будет живой воркшоп, где аудитория пишет боту.',
}

export default function SlideCover() {
  return (
    <div className="slide-container intermission-root">
      <div style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{config.conferenceName}</div>
      <h1 className="slide-title" style={{ maxWidth: '80%' }}>
        {config.talkTitle}
      </h1>
      <div className="slide-muted" style={{ fontSize: '1.75rem' }}>
        OpenSpec, Spec Kit и продуктовая инженерия
      </div>
      <div style={{ marginTop: '2rem', fontSize: '1.5rem', color: 'var(--accent)' }}>
        {config.speaker}
      </div>
    </div>
  )
}
