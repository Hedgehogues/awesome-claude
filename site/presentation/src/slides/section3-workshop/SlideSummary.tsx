import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'summary',
  title: '5 выводов из демо',
  section: 3,
  notes:
    'Зафиксировать что получили. Подчеркнуть что это не магия, а конкретный механизм с воспроизводимым результатом.',
}

export default function SlideSummary() {
  return (
    <div className="slide-container">
      <h1>Что мы получили</h1>
      <ol>
        <li><strong>Архитектура = контракт человека и AI</strong> — без него решает AI</li>
        <li><strong>Любая задача → спека</strong> — мелкая косметика исключение, всё остальное антипаттерн</li>
        <li><strong>OpenSpec: 3 команды, 4 артефакта</strong> — specs/ как живая карта системы</li>
        <li><strong>Мульти-репо → spec-repo</strong> — один источник правды для N сервисов</li>
        <li><strong>Vendor-agnostic</strong> — openspec/ переживёт любую смену AI-инструмента</li>
      </ol>
    </div>
  )
}
