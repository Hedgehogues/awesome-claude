interface Props {
  current: number
  total: number
}

export default function Progress({ current, total }: Props) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100))
  return (
    <>
      <span>{current} / {total}</span>
      <div className="presenter-progress-bar" aria-label="Progress">
        <div className="presenter-progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span>{pct.toFixed(0)}%</span>
    </>
  )
}
