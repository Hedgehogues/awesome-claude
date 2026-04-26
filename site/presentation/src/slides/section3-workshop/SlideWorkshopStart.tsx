import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'workshop-start',
  title: 'Воркшоп — старт',
  section: 3,
  notes: 'Переход к живому демо. Объявить аудитории: сейчас делаем фичу вместе — они предлагают, AI пишет.',
}

export default function SlideWorkshopStart() {
  return (
    <div className="slide-container intermission-root">
      <div className="intermission-number">4</div>
      <div className="intermission-title">Воркшоп</div>
      <div className="intermission-share">Делаем фичу для бота вместе</div>
    </div>
  )
}
