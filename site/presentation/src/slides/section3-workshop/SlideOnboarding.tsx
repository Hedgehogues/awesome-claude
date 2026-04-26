import { useState, useEffect } from 'react'
import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'onboarding',
  title: 'Как начать',
  section: 3,
  notes: 'Онбординг. Клики/пробел раскрывают шаги. Шаг 0 — показать где кнопка ⊞ каталога паттернов. Шаги 1-4 — установка и первый флоу.',
}

const STEPS = [
  {
    label: 'Каталог паттернов — кнопка ⊞',
    code: null,
    note: '60+ паттернов работы с AI-агентами. Прямо сейчас в правом углу.',
    highlight: true,
  },
  {
    label: 'Установи OpenSpec в свой проект',
    code: 'npm install -g openspec  &&  openspec init --tools claude-code',
    note: null,
    highlight: false,
  },
  {
    label: 'Возьми реальную задачу из беклога',
    code: '/opsx:propose "твоя задача"',
    note: 'Не todo — а то, что сейчас болит',
    highlight: false,
  },
  {
    label: 'Дай AI реализовать по спеке',
    code: '/opsx:apply',
    note: 'Агент читает proposal → design → tasks. Не додумывает.',
    highlight: false,
  },
  {
    label: 'Зафиксируй и двигайся дальше',
    code: '/opsx:archive',
    note: 'specs/ знает о новой фиче. Следующий proposal — с контекстом.',
    highlight: false,
  },
]

export default function SlideOnboarding() {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.key === 'ArrowRight' || e.key === ' ') && revealed < STEPS.length) {
        e.stopPropagation()
        setRevealed(r => r + 1)
      } else if (e.key === 'ArrowLeft' && revealed > 0) {
        e.stopPropagation()
        setRevealed(r => r - 1)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [revealed])

  return (
    <div className="slide-container">
      <h1>Попробуй на этой неделе</h1>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {STEPS.map((step, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              opacity: i < revealed ? 1 : 0,
              transform: i < revealed ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            <div style={{
              flexShrink: 0,
              width: '1.8rem',
              height: '1.8rem',
              borderRadius: '50%',
              background: step.highlight ? 'var(--accent)' : 'var(--accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#000',
              marginTop: '0.15rem',
            }}>
              {i === 0 ? '⊞' : i}
            </div>
            <div>
              <div style={{ fontSize: 'var(--size-body)', fontWeight: 600, color: 'var(--fg)' }}>
                {step.label}
              </div>
              {step.code && (
                <code style={{
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  background: '#1e1e1e',
                  border: '1px solid #2a2a2a',
                  borderRadius: '6px',
                  padding: '0.2rem 0.6rem',
                  fontSize: 'var(--size-small)',
                  color: '#7c8ee0',
                  fontFamily: 'monospace',
                }}>
                  {step.code}
                </code>
              )}
              {step.note && (
                <div style={{ fontSize: 'var(--size-small)', color: 'var(--fg-muted)', marginTop: '0.2rem' }}>
                  {step.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
