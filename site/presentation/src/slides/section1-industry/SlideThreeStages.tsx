import { useState } from 'react'
import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'three-stages',
  title: '3 этапа внедрения AI в команде',
  section: 1,
  notes:
    'Кейсы: interview-id-12 — запрет писать код без Claude Code на 2 недели (принудительный сдвиг). interview-id-44 — механика "толков": 3-5 демонстраций и отказники включаются. interview-id-36 — "этот переход нельзя пройти оперативно". Финальный тезис: механизм — старая привычка побеждает, пока не закрыли старый способ. Добровольный режим = остаются в старом. НОВЫЙ АКЦЕНТ: техника — это лишь половина. Вторая половина — коммуникация, убеждение и модерация команды в переходный период. Без мягкого давления, без фасилитации — переход не случается массово.',
}

export default function SlideThreeStages() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="slide-container">
      <h1>Как компании сейчас внедряют AI</h1>
      <ol>
        <li>
          <strong>Корпоративная подписка</strong> — доступ всем, добровольный режим
          <div className="slide-muted">Месяцами — никакого результата</div>
        </li>
        <li>
          <strong>Воркшоп с эффектом «вау»</strong> — Happy Path прямо на месте
          <div className="slide-muted">Человек сам видит что работает</div>
        </li>
        <li>
          <strong>Прыжок веры</strong> — разработчик должен поверить, это разблокирует переход на следующий уровень
          <div className="slide-muted">Некоторые запрещают старый способ на 2 недели — и это работает</div>
        </li>
      </ol>

      <div style={{ marginTop: '1.5rem' }}>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            style={{
              background: 'transparent',
              border: '1px solid var(--fg-subtle)',
              borderRadius: '6px',
              color: 'var(--fg-muted)',
              fontSize: 'var(--size-small)',
              padding: '0.4rem 1rem',
              cursor: 'pointer',
            }}
          >
            но есть ещё кое-что…
          </button>
        ) : (
          <p style={{ paddingLeft: '1.25rem', borderLeft: '2px solid var(--fg-subtle)', color: 'var(--fg-muted)', margin: 0 }}>
            <strong style={{ color: 'var(--fg)' }}>Но есть и обратный эффект:</strong> рабочий день вырастает на 2–3 часа
            <br />
            <span style={{ fontSize: 'var(--size-small)' }}>данные одного крупного продуктового онлайн-ретейлера</span>
          </p>
        )}
      </div>

      <p className="callout" style={{ marginTop: 'auto' }}>
        Привычки меняются медленнее, чем инструменты. Это нормально — задача лида помогать и объяснять. Важно помнить, что скорость изменений катастрофическая.
      </p>
    </div>
  )
}
