import { useEffect } from 'react'
import type { PatternItem } from '@/data/patterns'

interface PatternDetailOverlayProps {
  pattern: PatternItem
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const NAV_KEYS = ['ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End']

export default function PatternDetailOverlay({
  pattern,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: PatternDetailOverlayProps) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowLeft') { e.stopPropagation(); onPrev(); return }
      if (e.key === 'ArrowRight') { e.stopPropagation(); onNext(); return }
      if (NAV_KEYS.includes(e.key)) e.stopPropagation()
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [onClose, onPrev, onNext])

  const { detail } = pattern
  const num = String(index + 1).padStart(2, '0')
  const tot = String(total).padStart(2, '0')

  return (
    <div
      className="pattern-detail-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="pattern-detail-panel">
        <div className="pattern-detail-header">
          <span className="pattern-detail-num">{num}</span>
          <span className="pattern-detail-title">{pattern.title}</span>
          <div className="pattern-detail-nav">
            <button
              className="pattern-detail-nav-btn"
              onClick={onPrev}
              disabled={index === 0}
              aria-label="Предыдущий"
            >←</button>
            <span className="pattern-detail-counter">{num} / {tot}</span>
            <button
              className="pattern-detail-nav-btn"
              onClick={onNext}
              disabled={index === total - 1}
              aria-label="Следующий"
            >→</button>
            <button className="pattern-detail-close" onClick={onClose} aria-label="Закрыть">✕</button>
          </div>
        </div>

        {detail ? (
          <div className="pattern-detail-body">
            <div className="pattern-detail-left">
              {detail.problem && (
                <section className="detail-section detail-problem">
                  <h3 className="detail-section-label">Проблема</h3>
                  <p>{detail.problem}</p>
                </section>
              )}
              {detail.solution && (
                <section className="detail-section detail-solution">
                  <h3 className="detail-section-label">Решение</h3>
                  <p>{detail.solution}</p>
                </section>
              )}
              {detail.quote && (
                <blockquote className="detail-quote">
                  <p>«{detail.quote.text}»</p>
                  <cite>— {detail.quote.author}</cite>
                </blockquote>
              )}
              {(detail.worksWhen || detail.failsWhen) && (
                <div className="detail-conditions">
                  {detail.worksWhen && (
                    <div className="detail-works">
                      <h3 className="detail-section-label detail-label--ok">Работает когда</h3>
                      <ul>
                        {detail.worksWhen.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                  {detail.failsWhen && (
                    <div className="detail-fails">
                      <h3 className="detail-section-label detail-label--fail">Не работает когда</h3>
                      <ul>
                        {detail.failsWhen.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="pattern-detail-right">
              {detail.visual?.type === 'ascii' && (
                <pre className="detail-visual detail-visual--ascii">{detail.visual.content}</pre>
              )}
            </div>
          </div>
        ) : (
          <div className="pattern-detail-fallback">
            <p className="pattern-detail-fallback-summary">{pattern.summary}</p>
          </div>
        )}
      </div>
    </div>
  )
}
