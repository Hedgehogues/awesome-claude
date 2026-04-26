import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'landscape',
  title: 'Ландшафт инструментов',
  section: 2,
  notes:
    'Источники: analysis/sdd-landscape.md + frameworks-comparison.md. Разделение: настоящий SDD vs смежные vs adjacent. GSD и Superpowers — не SDD: GSD про исполнение, Superpowers — методология. В колонке «Где артефакт» — конкретная папка, чтобы аудитория могла сопоставить со своим репо.',
}

const rows: Array<{
  tool: string
  category: string
  whenToUse: string
  essence: string
  note?: string
  muted?: boolean
}> = [
  {
    tool: 'Spec Kit',
    category: 'SDD · SF · spec-first',
    whenToUse: 'Много команд · зависимости · проекты с нуля',
    essence: 'Структурирует проект через конституцию',
  },
  {
    tool: 'OpenSpec',
    category: 'SDD · SA · spec-anchored',
    whenToUse: 'Scrum-команда · brownfield · любой проект · DDD',
    essence: 'Ведёт историю изменений спеки',
  },
  {
    tool: 'Tessl',
    category: 'SDD · SaS · spec-as-source',
    whenToUse: 'Только для экспериментов',
    essence: 'Реестр скиллов и контекста для агентов',
    note: 'развивается медленно',
    muted: true,
  },
  {
    tool: 'Superpowers',
    category: 'AS · agent skills',
    whenToUse: 'Новички · первые кастомные скиллы · до выбора фреймворка · мелкие правки',
    essence: 'Задаёт правила поведения AI-агента',
    muted: true,
  },
  {
    tool: 'BMAD',
    category: 'AR · agent roles',
    whenToUse: 'После первых скиллов · появились процессы',
    essence: 'Оркестрирует роли и взаимодействие AI-агентов',
    muted: true,
  },
  {
    tool: 'GSD',
    category: 'AW · agent pipeline',
    whenToUse: 'Зрелые процессы · чёткая спека · команда доверяет агенту',
    essence: 'Автономно выполняет задачи',
    muted: true,
  },
]

export default function SlideLandscape() {
  return (
    <div className="slide-container">
      <h1>Ландшафт</h1>
      <table style={{ width: '100%', height: '100%', fontSize: 'var(--size-small)', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '0 0.5rem 0 0' }}>Инструмент</th>
            <th style={{ padding: '0 0.5rem' }}>Категория</th>
            <th style={{ padding: '0 0.5rem' }}>Когда применять</th>
            <th style={{ padding: '0 0 0 0.5rem' }}>Суть</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.tool} style={{ borderBottom: '1px solid var(--border)', opacity: r.note ? 0.55 : 1, background: r.note ? 'rgba(120,60,0,0.18)' : 'transparent', height: `${100 / rows.length}%` }}>
              <td style={{ padding: '0 0.5rem 0 0' }}>
                <strong>{r.tool}</strong>
              </td>
              <td style={{ padding: '0 0.5rem', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{r.category}</td>
              <td style={{ padding: '0 0.5rem', color: 'var(--fg-muted)' }}>{r.whenToUse}</td>
              <td style={{ padding: '0 0 0 0.5rem', color: 'var(--fg)' }}>
                {r.essence}
                {r.note && <span style={{ display: 'block', fontSize: '0.85em', color: '#e07b39', marginTop: '0.2rem' }}>{r.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
