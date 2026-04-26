import type { SlideMeta } from '@/types/slide'
import SectionIntermission from '@/components/SectionIntermission'

export const meta: SlideMeta = {
  id: 'section-3-intro',
  title: 'Раздел 3. Воркшоп OpenSpec',
  section: 3,
  notes:
    'Переход в раздел 3 (~60%). Это ядро доклада. Живое демо на Telegram-боте. Сразу объявить: аудитория будет участвовать — смотрите QR в конце.',
}

export default function SlideSection3Intro() {
  return <SectionIntermission section={3} share="Живой воркшоп по OpenSpec" />
}
