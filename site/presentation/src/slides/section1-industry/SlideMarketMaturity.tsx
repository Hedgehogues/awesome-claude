import type { SlideMeta } from '@/types/slide'
import Quote from '@/components/Quote'

export const meta: SlideMeta = {
  id: 'market-maturity',
  title: 'Где мы все сейчас',
  section: 1,
  notes:
    '20 из 35 самостоятельно изобрели SDD-подобные практики — без знания термина. 35 интервью: ~5 реально пробовали SDD-фреймворк, 8-10 слышали, 22-25 не знали. 0.1% формального SDD vs сотни раз "спека". Цитата Anton K — за полгода огромный скачок, старые эксперименты стоит повторить.',
}

export default function SlideMarketMaturity() {
  return (
    <div className="slide-container">
      <h1>Где мы все сейчас</h1>
      <ul>
        <li><strong>~20 из 35</strong> самостоятельно изобрели SDD-практику — не зная этого слова</li>
        <li><strong>35 интервью</strong> — реально пробовали SDD: <strong>~5 человек</strong>, слышали 8-10, не знали 22-25</li>
        <li><strong>0.1%</strong> упоминаний «SDD» в чатах. А «спека» — сотни раз.</li>
      </ul>
      <div style={{ marginTop: 'auto' }}>
        <Quote author="Anton K" source="чат «Agent coding», 16 марта">
          если вы пробовали что-то полгода назад и вам не понравилось — стоит попробовать сейчас ещё раз. За последние полгода скачок очень сильный
        </Quote>
      </div>
    </div>
  )
}
