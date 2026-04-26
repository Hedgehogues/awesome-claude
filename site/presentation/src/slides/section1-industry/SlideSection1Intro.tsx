import type { SlideMeta } from '@/types/slide'
import SectionIntermission from '@/components/SectionIntermission'

export const meta: SlideMeta = {
  id: 'section-1-intro',
  title: 'Раздел 1. Индустрия',
  section: 1,
  notes:
    'Переход в раздел 1. Задача: за 10% времени показать где рынок. Три оси: карта зрелости, организационные этапы, уровни людей.',
}

export default function SlideSection1Intro() {
  return <SectionIntermission section={1} share="Где мы все сейчас" />
}
