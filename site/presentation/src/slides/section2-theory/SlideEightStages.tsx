import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'eight-stages',
  title: '8 этапов внедрения AI',
  section: 2,
  notes:
    'Тут не «8 шагов что делать», а лестница зрелости: где ты сейчас? Каждый следующий уровень снимает боттлнек предыдущего. Источник: talk-part1-problem.md + interview-id-86 (Егор → собеседнику). YOLO — агент работает без подтверждения на каждом шаге. Детали смещения боттлнека — на следующем слайде.',
}

const stages: Array<{ n: number; name: string; where: string; accent?: boolean }> = [
  { n: 1, name: 'Автокомплит', where: 'Cursor · Copilot', accent: true },
  { n: 2, name: 'Чат с Y/N на каждом шаге', where: 'ранний Cline / Aider' },
  { n: 3, name: 'YOLO-режим', where: 'агент идёт без подтверждений', accent: true },
  { n: 4, name: 'YOLO + форм-фактор', where: 'контекст, память, файлы' },
  { n: 5, name: 'CLI · Claude Code', where: 'длинные сессии, tools, MCP', accent: true },
  { n: 6, name: 'Несколько инстансов', where: 'ручная синхронизация состояний' },
  { n: 7, name: 'Параллельные агенты', where: 'worktree, очереди задач' },
  { n: 8, name: 'Оркестрация по доменам', where: 'DDD · один домен = один агент', accent: true },
]

export default function SlideEightStages() {
  return (
    <div className="slide-container">
      <h1>Где вы сейчас?</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '2.5rem',
          rowGap: '0.55rem',
          marginTop: '0.5rem',
        }}
      >
        {stages.map((s) => (
          <div
            key={s.n}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5rem 1fr',
              alignItems: 'baseline',
              padding: '0.35rem 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ color: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 'var(--size-body)', color: s.accent ? 'var(--accent-soft)' : 'var(--fg)', fontWeight: s.accent ? 600 : 400 }}>
                {s.name}
              </div>
              <div style={{ fontSize: 'var(--size-small)', color: 'var(--fg-muted)' }}>{s.where}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="callout" style={{ marginTop: 'auto' }}>
        Каждая ступень снимает боттлнек предыдущей — дальше смотрим, куда он переезжает.
      </div>
    </div>
  )
}
