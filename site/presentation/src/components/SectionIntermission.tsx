import type { SectionNumber } from '@/types/slide'
import { SECTION_TITLES } from '@/types/slide'

interface Props {
  section: SectionNumber
  share?: string
}

export default function SectionIntermission({ section, share }: Props) {
  return (
    <div className="slide-container intermission-root">
      <div className="intermission-number">{section}</div>
      <div className="intermission-title">{SECTION_TITLES[section]}</div>
      {share ? <div className="intermission-share">{share}</div> : null}
    </div>
  )
}
