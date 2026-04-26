import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PATTERN_CATEGORIES } from '@/data/patterns'
import PatternDetailOverlay from './PatternDetailOverlay'

export default function PatternsCategoryView() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const navigate = useNavigate()
  const [activePatternIndex, setActivePatternIndex] = useState<number | null>(null)

  const closePatterns = () => {
    const last = sessionStorage.getItem('lastSlide') ?? '1'
    navigate(`/slide/${last}`)
  }

  const category = PATTERN_CATEGORIES.find(c => c.id === categoryId)

  if (!category) {
    return (
      <div className="patterns-category-page">
        <button className="patterns-close" onClick={closePatterns} title="Закрыть">×</button>
        <div className="patterns-category-header">
          <button className="patterns-back-btn" onClick={() => navigate('/patterns')}>←</button>
          <h1 className="patterns-category-title">Категория не найдена</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="patterns-category-page">
      <button className="patterns-close" onClick={closePatterns} title="Закрыть">×</button>
      <div className="patterns-category-header">
        <button className="patterns-back-btn" onClick={() => navigate('/patterns')}>←</button>
        <h1 className="patterns-category-title">{category.title}</h1>
      </div>
      <div className="patterns-category-grid">
        {category.patterns.map((p, i) => (
          <div
            key={p.title}
            className="pattern-card"
            onClick={() => setActivePatternIndex(i)}
          >
            <span className="pattern-card-number">{String(i + 1).padStart(2, '0')}</span>
            <span className="pattern-card-title">{p.title}</span>
            <span className="pattern-card-summary">{p.summary}</span>
          </div>
        ))}
      </div>

      {activePatternIndex !== null && (
        <PatternDetailOverlay
          pattern={category.patterns[activePatternIndex]}
          index={activePatternIndex}
          total={category.patterns.length}
          onClose={() => setActivePatternIndex(null)}
          onPrev={() => setActivePatternIndex(i => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setActivePatternIndex(i => (i !== null && i < category.patterns.length - 1 ? i + 1 : i))}
        />
      )}
    </div>
  )
}
