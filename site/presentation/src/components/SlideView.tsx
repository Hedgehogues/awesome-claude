import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { slides } from '@/data/slides'
import { SECTION_TITLES } from '@/types/slide'
import { useKeyboardNavigation, useFullscreenToggle } from '@/hooks/useKeyboardNavigation'
import { useSlideChannel } from '@/hooks/useSlideChannel'
import SlideErrorBoundary from './SlideErrorBoundary'

export default function SlideView() {
  const params = useParams<{ index?: string }>()
  const navigate = useNavigate()
  const total = slides.length
  const toggleFullscreen = useFullscreenToggle()

  const openPatterns = () => {
    sessionStorage.setItem('lastSlide', String(currentIndex))
    navigate('/patterns')
  }

  const openLinks = () => {
    sessionStorage.setItem('lastSlide', String(currentIndex))
    navigate('/links')
  }
  const rawIndex = Number.parseInt(params.index ?? '1', 10) || 1
  const currentIndex = Math.max(1, Math.min(total, rawIndex))

  // Redirect out-of-bounds URLs
  useEffect(() => {
    if (rawIndex !== currentIndex) {
      navigate(`/slide/${currentIndex}`, { replace: true })
    }
  }, [rawIndex, currentIndex, navigate])

  const sendToChannel = useSlideChannel('main', (msg) => {
    if (msg.index !== currentIndex) {
      navigate(`/slide/${msg.index}`)
    }
  })

  const lastBroadcastRef = useRef<number | null>(null)
  useEffect(() => {
    if (lastBroadcastRef.current !== currentIndex) {
      lastBroadcastRef.current = currentIndex
      sendToChannel(currentIndex)
    }
  }, [currentIndex, sendToChannel])

  const openPresenter = () => {
    window.open('/presenter', 'podlodka-presenter', 'width=1200,height=800')
  }

  useKeyboardNavigation({
    onToggleFullscreen: toggleFullscreen,
    onOpenPresenter: openPresenter,
    onTogglePatterns: openPatterns,
  })

  const entry = slides[currentIndex - 1]
  if (!entry) {
    return (
      <div className="slide-root">
        <div className="slide-error">
          <div className="slide-error-title">Слайд {currentIndex} не найден</div>
        </div>
      </div>
    )
  }

  const { Component, meta } = entry

  return (
    <div className="slide-root" data-section={meta.section}>
      <SlideErrorBoundary slideIndex={currentIndex}>
        <Component />
      </SlideErrorBoundary>
      <button
        className="links-btn"
        onClick={openLinks}
        title="Ссылки"
      >
        ☰
      </button>
      <button
        className="patterns-btn"
        onClick={openPatterns}
        title="Каталог паттернов (P)"
      >
        ⊞
      </button>
      {!meta.hideFooter && (
        <div className="slide-footer">
          {SECTION_TITLES[meta.section] && (
            <span className="section-badge">
              Раздел {meta.section} · {SECTION_TITLES[meta.section]}
            </span>
          )}
          <span>
            {currentIndex} / {total}
          </span>
        </div>
      )}
    </div>
  )
}
