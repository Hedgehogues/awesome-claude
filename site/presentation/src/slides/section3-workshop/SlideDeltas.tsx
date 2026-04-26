import type { SlideMeta } from '@/types/slide'
import CodeBlock from '@/components/CodeBlock'

export const meta: SlideMeta = {
  id: 'deltas',
  title: 'Дельты — why',
  section: 3,
  notes:
    'Не переписывать всю спеку при каждой фиче. После archive дельта мержится в specs/. Решает "AI забывает что уже сделано" — specs/ накапливает знание о системе.',
}

export default function SlideDeltas() {
  return (
    <div className="slide-container">
      <h1>Дельты — как git diff для требований</h1>
      <CodeBlock lang="markdown">{`## ADDED Requirements

### Requirement: Команда /vote
Бот SHALL принимать /vote и показывать кнопки с вариантами ответа.

#### Scenario: Пользователь отправляет /vote
- **WHEN** пользователь отправляет /vote
- **THEN** бот отвечает inline-кнопками с вариантами`}</CodeBlock>
      <ul style={{ marginTop: '1.5rem' }}>
        <li><strong style={{ color: 'var(--accent-soft)' }}>Дельта</strong> — пишешь только изменения, не перепечатываешь всю спеку</li>
        <li><strong style={{ color: 'var(--accent-soft)' }}>archive</strong> — мержит дельту в <code>specs/</code></li>
        <li><strong style={{ color: 'var(--accent-soft)' }}>specs/</strong> — живая карта системы, всегда актуальна</li>
      </ul>
    </div>
  )
}
