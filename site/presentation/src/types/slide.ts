import type { ComponentType } from 'react'

export type SectionNumber = 0 | 1 | 2 | 3

export interface SlideMeta {
  id: string
  title: string
  section: SectionNumber
  notes: string
  hideFooter?: boolean
}

export interface SlideEntry {
  meta: SlideMeta
  Component: ComponentType
}

export const SECTION_TITLES: Record<SectionNumber, string> = {
  0: '',
  1: 'Индустрия',
  2: 'Проблема → теория → решение',
  3: 'Воркшоп OpenSpec',
}
