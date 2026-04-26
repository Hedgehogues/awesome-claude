import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'

export type SupportedLang =
  | 'typescript'
  | 'ts'
  | 'javascript'
  | 'js'
  | 'tsx'
  | 'jsx'
  | 'markdown'
  | 'md'
  | 'bash'
  | 'shell'
  | 'python'
  | 'yaml'
  | 'yml'
  | 'json'
  | 'text'

interface Props {
  lang: SupportedLang
  children: string
  highlight?: number[]
  theme?: string
}

const cache = new Map<string, string>()

export default function CodeBlock({
  lang,
  children,
  highlight = [],
  theme = 'github-dark',
}: Props) {
  const [html, setHtml] = useState<string>('')
  const source = children.trim()

  useEffect(() => {
    let cancelled = false
    const cacheKey = `${lang}|${theme}|${source}`
    const cached = cache.get(cacheKey)
    if (cached) {
      setHtml(cached)
      return
    }
    codeToHtml(source, { lang, theme })
      .then((result) => {
        if (cancelled) return
        cache.set(cacheKey, result)
        setHtml(result)
      })
      .catch((err: unknown) => {
        console.warn('Shiki highlight failed', err)
        setHtml(`<pre><code>${escapeHtml(source)}</code></pre>`)
      })
    return () => {
      cancelled = true
    }
  }, [lang, source, theme])

  const applyHighlights = (rawHtml: string) => {
    if (!highlight.length) return rawHtml
    // Wrap lines in span with highlight class — shiki emits <span class="line">
    // We post-process by splitting on <span class="line"> markers
    return rawHtml.replace(/<span class="line">/g, (() => {
      let lineNumber = 0
      return () => {
        lineNumber += 1
        const cls = highlight.includes(lineNumber) ? ' line-highlight' : ''
        return `<span class="line${cls}">`
      }
    })())
  }

  return (
    <div
      className="code-block"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: applyHighlights(html) }}
    />
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
