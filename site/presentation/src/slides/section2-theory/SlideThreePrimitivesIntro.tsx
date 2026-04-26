import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'three-primitives-intro',
  title: '4 паттерна AI-разработки',
  section: 2,
  notes:
    'Вводим три оси, по которым различаются фреймворки. Это не альтернативы — это система координат. Роль — кто владеет решением. Артефакт — что передаётся между этапами. Процесс — контейнер для всего этого.',
}

const primitives = [
  {
    code: 'AR · Agent Role',
    desc: 'Кто принимает решения на каждом этапе — PM, аналитик, разработчик. Фреймворки задают, кто владеет артефактом и когда передаёт контроль.',
    example: 'Пример: BMAD',
  },
  {
    code: 'SDD · Spec-Driven Development',
    desc: 'Спека — единственный источник правды, который живёт рядом с кодом. Именно она движется через этапы и трансформируется.',
    example: 'Пример: OpenSpec, Spec Kit',
  },
  {
    code: 'AW · Agent Workflow',
    desc: 'Контейнер для работы: Discovery → Design → Delivery. Фреймворки работают с разными паттернами, поэтому их можно комбинировать.',
    example: 'Пример: GSD',
  },
  {
    code: 'AS · Agent Skills',
    desc: 'Правила поведения AI-агента: CLAUDE.md, .claude/, системные промпты. Задаёт что агент умеет, как рассуждает и какие ограничения соблюдает.',
    example: 'Пример: Superpowers, персональные скиллы',
  },
]

export default function SlideThreePrimitivesIntro() {
  return (
    <div className="slide-container">
      <h1 style={{ marginBottom: '1.25rem' }}>4 паттерна AI-разработки</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {primitives.map(({ code, desc, example }) => (
          <div key={code}>
            <div style={{ color: '#f5f5f5', fontSize: 'var(--size-body)', lineHeight: 1.4 }}>
              <span style={{ color: 'var(--accent-soft)', fontWeight: 700 }}>{code}</span>{' '}
              {desc}
            </div>
            <div className="slide-muted" style={{ marginTop: '0.25rem', fontSize: 'var(--size-small)' }}>
              {example}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
