import type { SlideMeta } from '@/types/slide'
import CodeBlock from '@/components/CodeBlock'

export const meta: SlideMeta = {
  id: 'artifacts',
  title: '4 артефакта и структура репо',
  section: 3,
  notes:
    'proposal.md — зачем. specs/ — требования (дельта). design.md — как. tasks.md — чеклист. В openspec/specs/ — source of truth. В openspec/changes/ — работа, потом в archive/.',
}

export default function SlideArtifacts() {
  return (
    <div className="slide-container">
      <h1>4 артефакта, 2 директории</h1>
      <CodeBlock lang="bash">{`openspec/
├── specs/              # source of truth — как работает СЕЙЧАС
│   └── auth/spec.md
└── changes/
    ├── add-vote-cmd/   # в работе
    │   ├── proposal.md    # зачем: проблема, подход
    │   ├── specs/         # дельта (ADDED / MODIFIED / REMOVED)
    │   ├── design.md      # как: архитектура, решения
    │   └── tasks.md       # чеклист для AI
    └── archive/        # завершённые (history)`}</CodeBlock>
      <p style={{ marginTop: '1.5rem', color: 'var(--fg-muted)', fontSize: 'var(--size-small)' }}>
        Набор файлов — не жёсткий стандарт. Можно кастомить под свой процесс.
      </p>
      <p className="callout" style={{ marginTop: '0.75rem' }}>
        Промпт без спеки — антипаттерн.
      </p>
    </div>
  )
}
