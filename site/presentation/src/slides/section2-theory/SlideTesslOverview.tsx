import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'tessl-overview',
  title: 'Tessl — обзор',
  section: 2,
  notes:
    'Логический предел SDD: .spec как единственный источник истины, из которого генерируется весь код. Закрытая бета, Kiro (AWS) движется в том же направлении. Самый строгий вариант spec-as-source — код становится побочным эффектом спеки. Greenfield-only: слишком радикально для brownfield.',
}

function OverviewCard({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string
  value: string
  subtitle?: string
  accent?: boolean
}) {
  return (
    <div
      style={{
        padding: '0.9rem 1.1rem',
        background: '#141414',
        border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '8px',
      }}
    >
      <div style={{ fontSize: 'var(--size-small)', color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--size-body)', color: accent ? 'var(--accent)' : 'var(--fg)', fontWeight: accent ? 600 : 400 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 'var(--size-small)', color: 'var(--fg-muted)', marginTop: '0.3rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

export default function SlideTesslOverview() {
  return (
    <div className="slide-container">
      <h1>Tessl</h1>
      <p style={{ color: 'var(--fg-muted)', marginTop: '-0.25rem', marginBottom: '1.25rem' }}>
        SDD · spec-as-source · закрытая бета
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <OverviewCard label="Философия" value="spec-as-source" subtitle="спека — единственный источник истины, код генерируется из неё полностью" accent />
        <OverviewCard label="Ключевая идея" value="spec as source of truth" subtitle="код — побочный эффект спеки; меняешь .spec — получаешь новый код" />
        <OverviewCard label="Воркфлоу" value="edit spec → generate code → sync" subtitle="все изменения через спеку; прямое редактирование кода не поддерживается" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <OverviewCard label="Применимость" value="greenfield · закрытая бета · только эксперименты" subtitle="Kiro (AWS) движется в том же направлении; слишком радикально для brownfield" />
        <OverviewCard label="Артефакт" value="tessl.io/registry" />
        <OverviewCard label="Когда применять" value="Только для экспериментов" subtitle="развивается медленно" />
      </div>
      <p className="callout" style={{ marginTop: 'auto' }}>
        Сильная сторона: код генерируется из .spec — меняешь спеку, получаешь новый код; максимальный контроль архитектуры
      </p>
    </div>
  )
}
