import { useEffect, useState } from 'react'

interface Props {
  resetSignal: number
}

function format(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function Timer({ resetSignal }: Props) {
  const [start, setStart] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setStart(Date.now())
    setNow(Date.now())
  }, [resetSignal])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(interval)
  }, [])

  return <div className="presenter-timer">{format(now - start)}</div>
}
