import { useNavigate } from 'react-router-dom'
import { PATTERN_CATEGORIES } from '@/data/patterns'

export default function PatternsView() {
  const navigate = useNavigate()

  const closePatterns = () => {
    const last = sessionStorage.getItem('lastSlide') ?? '1'
    navigate(`/slide/${last}`)
  }

  return (
    <div className="patterns-page">
      <button className="patterns-close" onClick={closePatterns} title="Закрыть">×</button>
      <div className="patterns-header">
        <span className="patterns-title">Каталог архитектурных паттернов</span>
      </div>
      <div className="patterns-grid">
        {PATTERN_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="pattern-tile"
            onClick={() => navigate(`/patterns/${cat.id}`)}
          >
            <div className="pattern-tile-header">
              <span className="pattern-tile-title">{cat.title}</span>
              <span className="pattern-tile-count">{cat.patterns.length}</span>
            </div>
            <p className="pattern-tile-desc">{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
