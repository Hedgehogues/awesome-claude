import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'sdd-maturity-intro',
  title: 'Не все SDD одинаковы',
  section: 2,
  notes:
    'Мост от «зачем спека» к «как глубоко». Фреймворки кодифицируют то, что передовые команды уже делают руками — но делают по-разному. Глубина зависит от зрелости команды и целей.',
}

export default function SlideSDDMaturityIntro() {
  return (
    <div className="slide-container">
      <h1>Не все SDD одинаковы</h1>
      <div className="callout">
        Фреймворки кодифицируют то, что передовые команды уже делают руками — но с разной глубиной и формализмом.
      </div>
      <div className="callout">
        Birgitta Böckeler (martinfowler.com) выделила три уровня.
      </div>
    </div>
  )
}
