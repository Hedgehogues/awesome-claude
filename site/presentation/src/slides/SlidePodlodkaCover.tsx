import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'podlodka-cover',
  title: 'Podlodka Cover',
  section: 0,
  notes: 'Официальная карточка доклада от организаторов Podlodka PHP Crew.',
  hideFooter: true,
}

export default function SlidePodlodkaCover() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    }}>
      <img
        src="/podlodka-cover.png"
        alt="Podlodka PHP Crew — обложка доклада"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}
