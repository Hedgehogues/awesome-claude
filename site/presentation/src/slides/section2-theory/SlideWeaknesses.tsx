import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'weaknesses',
  title: 'На что обратить внимание',
  section: 2,
  notes:
    'Честность повышает доверие к воркшопу. Grid «слабость → решение» — важнее оставить аудиторию с рабочим ответом, а не со списком проблем. Источники: analysis/openspec-problems.md, analysis/practical-insights.md, critical analysis from Böckeler (Fowler). Решения — опора на engineering-patterns.md.',
}

const rows: Array<{ problem: string; fix: string }> = [
  {
    problem: 'Любая задача → спека',
    fix: 'Исключение: мелкая косметика (покрасить кнопку). Задача без спеки — антипаттерн',
  },
  {
    problem: 'Мульти-репо: нет общего контекста',
    fix: 'Spec-repo: отдельная репа со specs/, ADR, rules. Подтягивается зависимостью в каждую code-репу — агент везде видит одну правду',
  },
  {
    problem: 'AI дрейфует от спеки',
    fix: 'Подгружать specs/ в контекст явно. В CLAUDE.md: «перед задачей читай спеку». Сверять итог с исходным требованием',
  },
  {
    problem: 'Дельты хрупкие',
    fix: 'Мелкие дельты, архивировать сразу',
  },
  {
    problem: 'Токены дорого',
    fix: 'Sonnet — обычные задачи, Opus — кросс-доменная архитектура',
  },
  {
    problem: 'Jira / Confluence',
    fix: 'MCP-сервер: тянет задачи и комментирует напрямую. Confluence — тоже. Картинки не поддерживаются',
  },
]

export default function SlideWeaknesses() {
  return (
    <div className="slide-container">
      <h1>Ограничения — и как жить</h1>
      <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          columnGap: '2rem',
          padding: '0 0 0.3rem',
          borderBottom: '1px solid #2a2a2a',
          marginBottom: '0.1rem',
        }}>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--size-small)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Слабость</div>
          <div style={{ color: 'var(--fg-muted)', fontSize: 'var(--size-small)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Решение</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {rows.map((r) => (
            <div key={r.problem} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr',
              columnGap: '2rem',
              alignItems: 'center',
              flex: 1,
              borderBottom: '1px solid #1a1a1a',
              padding: '0.2rem 0',
            }}>
              <div style={{ fontSize: 'var(--size-small)', color: '#ff9a4c', fontWeight: 600 }}>{r.problem}</div>
              <div style={{ fontSize: 'var(--size-small)', color: 'var(--fg-muted)' }}>{r.fix}</div>
            </div>
          ))}
        </div>
        <p className="callout" style={{ marginTop: '0.5rem', flexShrink: 0 }}>
          Попробуй на следующей задаче: proposal → код
        </p>
      </div>
    </div>
  )
}
