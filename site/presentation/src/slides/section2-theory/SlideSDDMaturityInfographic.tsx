import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'sdd-maturity-infographic',
  title: 'Механика каждого уровня',
  section: 2,
  notes:
    'Фиксированная сетка: СПЕКА и КОД всегда на одном месте, меняется только связь между ними. SF: фрагментация. SA: схлопывание через человека. SaS: генерация. SiL: петля без человека.',
}

const mono = { fontFamily: 'var(--font-mono)', fontSize: '0.9rem' } as const
const SPEC_W = '12rem'
const CODE_W = '12rem'
const ARROW_W = '9rem'

function Artifact({
  lines,
  accent = false,
  width = SPEC_W,
}: {
  lines: string[]
  accent?: boolean
  width?: string
}) {
  const border = accent ? '1.5px solid #f97316' : '1px solid rgba(255,255,255,0.22)'
  const bg = accent ? 'rgba(249,115,22,0.07)' : 'rgba(255,255,255,0.03)'
  const color = accent ? '#f97316' : '#e0e0e0'

  return (
    <div style={{
      width,
      minHeight: '4.5rem',
      border,
      background: bg,
      borderRadius: 8,
      padding: '0.5rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 2,
      flexShrink: 0,
    }}>
      {lines.map(l => (
        <span key={l} style={{ ...mono, color, lineHeight: 1.6 }}>{l}</span>
      ))}
    </div>
  )
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
    </svg>
  )
}

function SolidArrow({ label, showPerson, color = 'rgba(255,255,255,0.3)' }: { label?: string; showPerson?: boolean; color?: string }) {
  return (
    <div style={{ width: ARROW_W, flexShrink: 0, position: 'relative', alignSelf: 'stretch' }}>
      {showPerson && (
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)' }}>
          <PersonIcon color={color} />
        </div>
      )}
      <svg style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%' }} height="20" viewBox="0 0 144 20">
        <line x1="2" y1="10" x2="132" y2="10" stroke={color} strokeWidth="2" />
        <polygon points="144,10 132,4 132,16" fill={color} />
      </svg>
      {label && (
        <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.8rem', color }}>{label}</span>
        </div>
      )}
    </div>
  )
}

function BiArrow({ forwardLabel, backLabel, backColor = '#f97316', showPersonBack = false }: { forwardLabel?: string; backLabel?: string; backColor?: string; showPersonBack?: boolean }) {
  const c = '#f97316'
  const hasExtras = forwardLabel || backLabel || showPersonBack
  const h = hasExtras ? 80 : 50
  const fY = hasExtras ? 16 : 12   // forward arrow y
  const bY = hasExtras ? 58 : 36   // back arrow y
  return (
    <div style={{ width: ARROW_W, flexShrink: 0, position: 'relative', alignSelf: 'stretch' }}>
      <svg style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '100%' }} height={h} viewBox={`0 0 144 ${h}`}>
        {/* Forward arrow */}
        {forwardLabel && <text x="72" y={fY - 4} textAnchor="middle" fill={c} fillOpacity="0.8" fontSize="13" fontFamily="var(--font-mono)">{forwardLabel}</text>}
        <line x1="2" y1={fY} x2="132" y2={fY} stroke={c} strokeWidth="2" />
        <polygon points={`144,${fY} 132,${fY - 6} 132,${fY + 6}`} fill={c} />
        {/* Person icon between arrows */}
        {showPersonBack && (
          <>
            <circle cx="72" cy={(fY + bY) / 2 - 6} r="5" stroke={backColor} strokeWidth="1.5" fill="none" />
            <path d={`M62,${(fY + bY) / 2 + 8} C62,${(fY + bY) / 2 + 2} 82,${(fY + bY) / 2 + 2} 82,${(fY + bY) / 2 + 8}`} stroke={backColor} strokeWidth="1.5" fill="none" />
          </>
        )}
        {/* Back arrow */}
        <line x1="142" y1={bY} x2="12" y2={bY} stroke={backColor} strokeWidth="2" />
        <polygon points={`0,${bY} 12,${bY - 6} 12,${bY + 6}`} fill={backColor} />
        {backLabel && <text x="72" y={bY + 16} textAnchor="middle" fill={backColor} fillOpacity="0.7" fontSize="13" fontFamily="var(--font-mono)">{backLabel}</text>}
      </svg>
    </div>
  )
}

function Label({ solves, result, problem }: { solves?: string; result?: string; problem?: string }) {
  return (
    <div style={{ marginLeft: '1.25rem', flexShrink: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
      {solves && (
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>решает: {solves}</span>
      )}
      <span style={{ fontSize: '1.05rem' }}>
        {result && <span style={{ color: '#f97316', fontWeight: 700 }}>{result}</span>}
        {result && problem && <span style={{ color: 'rgba(255,255,255,0.25)' }}> · </span>}
        {problem && <span style={{ color: 'var(--fg-muted)', fontWeight: 400 }}>{problem}</span>}
      </span>
    </div>
  )
}

function LevelTag({ name }: { name: string }) {
  return (
    <span style={{ ...mono, color: 'var(--fg-muted)', width: '3.5rem', flexShrink: 0, fontSize: '1rem' }}>
      {name}
    </span>
  )
}

function ColHeader({ title, width }: { title: string; width: string }) {
  return (
    <div style={{ width, flexShrink: 0, ...mono, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontSize: '0.85rem' }}>
      {title}
    </div>
  )
}

export default function SlideSDDMaturityInfographic() {
  return (
    <div className="slide-container">
      <h1 style={{ marginBottom: '1.25rem' }}>Механика каждого уровня</h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Заголовки колонок */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingLeft: '4rem' }}>
          <ColHeader title="СПЕКА" width={SPEC_W} />
          <div style={{ width: ARROW_W }} />
          <ColHeader title="КОД" width={CODE_W} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* SF */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LevelTag name="SF" />
            <Artifact lines={['spec-v1.md', 'spec-v2.md']} width={SPEC_W} />
            <SolidArrow color="rgba(255,255,255,0.3)" />
            <Artifact lines={['src/']} width={CODE_W} />
            <Label solves="Хаос" result="Есть структура" problem="Спека фрагментируется" />
          </div>

          {/* SA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LevelTag name="SA" />
            <Artifact lines={['specs/domain.md']} accent width={SPEC_W} />
            <SolidArrow label="схлопывает" showPerson color="rgba(255,255,255,0.4)" />
            <Artifact lines={['src/']} accent width={CODE_W} />
            <Label solves="Фрагментацию" result="Домен актуален" problem="Нужна дисциплина команды" />
          </div>

          {/* SaS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LevelTag name="SaS" />
            <Artifact lines={['specs/domain.md']} accent width={SPEC_W} />
            <BiArrow forwardLabel="≈ генерирует" backLabel="ручные итерации" backColor="rgba(255,255,255,0.4)" showPersonBack />
            <Artifact lines={['DO NOT EDIT']} accent width={CODE_W} />
            <Label solves="Дисциплину" result="Спека генерирует код" problem="Недетерминизм LLM" />
          </div>

          {/* SiL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LevelTag name="SiL" />
            <Artifact lines={['specs/domain.md']} accent width={SPEC_W} />
            <BiArrow backLabel="ошибки · latency" />
            <Artifact lines={['DO NOT EDIT']} accent width={CODE_W} />
            <Label solves="Недетерминизм" result="Техн. метрики корректируют спеку" problem="Продуктовые метрики — вручную" />
          </div>

        </div>

        {/* Легенда */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingLeft: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, border: '1.5px solid #f97316', background: 'rgba(249,115,22,0.07)' }} />
            <span style={{ fontSize: '0.8rem', color: '#f97316', fontFamily: 'var(--font-mono)' }}>решение</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.03)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>проблема</span>
          </div>
        </div>
      </div>
    </div>
  )
}
