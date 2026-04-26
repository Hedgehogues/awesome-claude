import { useEffect, useState } from 'react'
import { PATTERN_CATEGORIES, type PatternCategory } from '@/data/patterns'

interface PatternsOverlayProps {
  onClose: () => void
}

export default function PatternsOverlay({ onClose }: PatternsOverlayProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      // Block slide navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [onClose])

  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id)

  return (
    <div className="patterns-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="patterns-panel">
        <div className="patterns-header">
          <span className="patterns-title">Каталог архитектурных паттернов</span>
          <button className="patterns-close" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        <div className="patterns-grid">
          {PATTERN_CATEGORIES.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              isExpanded={expanded === cat.id}
              onToggle={() => toggle(cat.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CategoryTile({ category, isExpanded, onToggle }: {
  category: PatternCategory
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className={`pattern-tile ${isExpanded ? 'pattern-tile--expanded' : ''}`}>
      <button className="pattern-tile-header" onClick={onToggle}>
        <span className="pattern-tile-title">{category.title}</span>
        <span className="pattern-tile-count">{category.patterns.length}</span>
        <span className="pattern-tile-chevron">{isExpanded ? '▲' : '▼'}</span>
      </button>
      <p className="pattern-tile-desc">{category.description}</p>
      {isExpanded && (
        <ul className="pattern-list">
          {category.patterns.map((p) => (
            <li key={p.title} className="pattern-item">
              <span className="pattern-item-title">{p.title}</span>
              <span className="pattern-item-summary">{p.summary}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
