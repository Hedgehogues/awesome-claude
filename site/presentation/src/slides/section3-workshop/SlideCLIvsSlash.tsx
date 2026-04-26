import type { SlideMeta } from '@/types/slide'
import CodeBlock from '@/components/CodeBlock'

export const meta: SlideMeta = {
  id: 'cli-vs-slash',
  title: 'Архитектура: vendor-agnostic',
  section: 3,
  notes:
    'Ключевая архитектурная идея OpenSpec. Поддержка 25+ AI-инструментов через openspec init --tools. Спеки — общие для всех. Переход Claude → Cursor за одну команду.',
}

export default function SlideCLIvsSlash() {
  return (
    <div className="slide-container">
      <h1>CLI + slash-команды</h1>
      <ul>
        <li><strong>CLI</strong> — полный контроль, скрипты, CI. Работает с любым AI.</li>
        <li><strong>Slash-команды</strong> — тонкая обёртка для работы с AI в IDE.</li>
        <li><strong style={{ color: 'var(--accent-soft)' }}>openspec/</strong> — спеки общие для всех инструментов.</li>
      </ul>
      <CodeBlock lang="bash">{`# Поддерживается 25+ AI-инструментов
openspec init --tools claude-code
openspec init --tools cursor
openspec init --tools windsurf
openspec init --tools codex`}</CodeBlock>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Поменяли инструмент — спеки остались.
      </p>
    </div>
  )
}
