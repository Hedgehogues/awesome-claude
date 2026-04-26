import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { slides } from '@/data/slides'

interface KeyboardNavOptions {
  onOpenPresenter?: () => void
  onResetTimer?: () => void
  onToggleFullscreen?: () => void
  onSlideChange?: (newIndex: number) => void
  onTogglePatterns?: () => void
  isPatternsOpen?: boolean
}

function isTextInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || target.isContentEditable
}

export function useKeyboardNavigation(options: KeyboardNavOptions = {}) {
  const navigate = useNavigate()
  const params = useParams<{ index?: string }>()
  const currentIndex = Number.parseInt(params.index ?? '1', 10) || 1
  const total = slides.length

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (isTextInput(event.target)) return
      // ignore modifiers (Ctrl/Cmd) to not override browser shortcuts
      if (event.metaKey || event.ctrlKey) return

      const goTo = (next: number) => {
        const clamped = Math.max(1, Math.min(total, next))
        if (clamped !== currentIndex) {
          navigate(`/slide/${clamped}`)
          options.onSlideChange?.(clamped)
        }
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          if (options.isPatternsOpen) break
          event.preventDefault()
          goTo(currentIndex + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          if (options.isPatternsOpen) break
          event.preventDefault()
          goTo(currentIndex - 1)
          break
        case 'Home':
          if (options.isPatternsOpen) break
          event.preventDefault()
          goTo(1)
          break
        case 'End':
          if (options.isPatternsOpen) break
          event.preventDefault()
          goTo(total)
          break
        case 'f':
        case 'F':
          event.preventDefault()
          options.onToggleFullscreen?.()
          break
        case 'o':
        case 'O':
          event.preventDefault()
          options.onOpenPresenter?.()
          break
        case 'p':
        case 'P':
          event.preventDefault()
          options.onTogglePatterns?.()
          break
        case 'r':
        case 'R':
          event.preventDefault()
          options.onResetTimer?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [currentIndex, total, navigate, options])
}

export function useFullscreenToggle() {
  return () => {
    const el = document.documentElement
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen().catch((err: unknown) => {
        console.warn('Fullscreen request failed', err)
      })
    }
  }
}
