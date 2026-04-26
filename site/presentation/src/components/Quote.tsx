import type { ReactNode } from 'react'

interface Props {
  author?: string
  source?: string
  children: ReactNode
}

export default function Quote({ author, source, children }: Props) {
  return (
    <blockquote className="quote">
      {children}
      {author ? (
        <span className="quote-author">
          — {author}
          {source ? <span className="slide-muted"> · {source}</span> : null}
        </span>
      ) : null}
    </blockquote>
  )
}
