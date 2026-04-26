import type { SlideMeta } from '@/types/slide'
import SectionIntermission from '@/components/SectionIntermission'

export const meta: SlideMeta = {
  id: 'section-2-intro',
  title: 'Раздел 2. Проблема → теория → решение',
  section: 2,
  notes:
    'Переход в раздел 2 (~30%). Нарратив: где болит → что предлагают фреймворки → как выбрать → с чем столкнёшься.',
}

export default function SlideSection2Intro() {
  return <SectionIntermission section={2} share="От боли к решению" />
}
