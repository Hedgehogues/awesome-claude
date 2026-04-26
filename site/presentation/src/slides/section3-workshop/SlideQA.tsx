import type { SlideMeta } from '@/types/slide'
import { QRCodeSVG } from 'qrcode.react'
import { config } from '@/data/config'

export const meta: SlideMeta = {
  id: 'qa',
  title: 'Q&A',
  section: 3,
  notes:
    'Опорные ответы в audience-questions.md: мульти-репо, legacy, токены, brownfield, конкурентность с Jira. Если вопросов мало — самому бросить тему: "А что у вас дома с AI?"',
}

const LINKEDIN_URL = 'https://www.linkedin.com/in/eurvanov/'

export default function SlideQA() {
  return (
    <div className="slide-container intermission-root">
      <div className="slide-title" style={{ color: 'var(--accent)' }}>Q&A</div>
      <div className="slide-muted" style={{ fontSize: '2rem' }}>
        {config.talkTitle}
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div>
          <div style={{ fontSize: '1.5rem' }}>Спасибо · {config.speaker}</div>
          <div style={{ marginTop: '0.75rem', fontSize: '1.2rem' }}>
            <a href={LINKEDIN_URL} style={{ color: 'var(--accent-soft)', textDecoration: 'none' }}>
              linkedin.com/in/eurvanov
            </a>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '0.5rem', borderRadius: '8px', flexShrink: 0 }}>
          <QRCodeSVG value={LINKEDIN_URL} size={140} level="M" bgColor="#ffffff" fgColor="#000000" />
        </div>
      </div>
    </div>
  )
}
