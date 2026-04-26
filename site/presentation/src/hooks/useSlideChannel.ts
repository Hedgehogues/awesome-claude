import { useEffect, useRef } from 'react'

const CHANNEL_NAME = 'podlodka-slides'
const STORAGE_KEY = 'podlodka-slides-index'

interface SlideMessage {
  index: number
  source: 'main' | 'presenter'
  timestamp: number
}

type Listener = (msg: SlideMessage) => void

export function useSlideChannel(source: 'main' | 'presenter', listener: Listener) {
  const listenerRef = useRef(listener)
  listenerRef.current = listener

  useEffect(() => {
    let channel: BroadcastChannel | null = null
    let storageHandler: ((e: StorageEvent) => void) | null = null

    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = (event: MessageEvent<SlideMessage>) => {
        if (event.data.source !== source) {
          listenerRef.current(event.data)
        }
      }
    } else {
      storageHandler = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY || !event.newValue) return
        try {
          const parsed = JSON.parse(event.newValue) as SlideMessage
          if (parsed.source !== source) {
            listenerRef.current(parsed)
          }
        } catch (_err) {
          // ignore malformed payload
        }
      }
      window.addEventListener('storage', storageHandler)
    }

    return () => {
      channel?.close()
      if (storageHandler) {
        window.removeEventListener('storage', storageHandler)
      }
    }
  }, [source])

  return function send(index: number) {
    const msg: SlideMessage = { index, source, timestamp: Date.now() }
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME)
      bc.postMessage(msg)
      bc.close()
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(msg))
      } catch (_err) {
        // storage may be disabled
      }
    }
  }
}

export function readInitialSlideIndex(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SlideMessage
    return parsed.index
  } catch {
    return null
  }
}
