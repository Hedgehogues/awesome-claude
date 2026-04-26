import type { SlideMeta } from '@/types/slide'
import CodeBlock from '@/components/CodeBlock'

export const meta: SlideMeta = {
  id: 'core-commands',
  title: 'Core команды OpenSpec',
  section: 3,
  notes:
    'Три команды Core профиля + опционально explore. Expanded профиль (8 команд) — для продвинутых, упомянуть кратко.',
}

export default function SlideCoreCommands() {
  return (
    <div className="slide-container">
      <h1>Три команды, весь воркфлоу</h1>
      <CodeBlock lang="bash">{`/opsx:propose "add /vote command" # создаёт папку change + 4 артефакта
/opsx:apply                      # AI реализует по tasks.md
/opsx:archive                    # мерж дельт в specs/ (source of truth)

/opsx:explore                    # когда непонятно что делать`}</CodeBlock>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Expanded профиль — ещё 8 команд: verify, sync, bulk-archive, ff и другие.
      </p>
    </div>
  )
}
