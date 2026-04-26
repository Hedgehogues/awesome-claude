import type { SlideMeta } from '@/types/slide'
import Quote from '@/components/Quote'

export const meta: SlideMeta = {
  id: 'manual-sdd-problem',
  title: 'Проблема ручного SDD',
  section: 1,
  notes:
    'Ход с залом: "Кто пишет ТЗ перед задачей AI? → Поздравляю, вы уже делаете SDD. Вопрос — где она живёт: в чате или в репо". 20+ человек в интервью пришли к SDD сами: map.md, архитектура.md, GraphQL SDL, Figma as source of truth.',
}

export default function SlideManualSDDProblem() {
  return (
    <div className="slide-container">
      <h1>Многие уже пишут спеки. Вручную.</h1>
      <ul>
        <li><strong>Спека живёт в чате</strong> — через неделю не найдёшь почему приняли решение</li>
        <li><strong>Контекст теряется при копипасте</strong> — ChatGPT → Claude: Claude не видит рассуждений</li>
        <li><strong>Спека и код разъезжаются</strong> — в процессе меняешь архитектуру — спека старая</li>
        <li><strong>Не масштабируется на команду</strong> — один человек — ок, три — хаос</li>
      </ul>
      <div style={{ marginTop: 'auto' }}>
        <Quote author="Олег Дегтярев" source="чат «Крабоводоведы», 7 марта">
          делайте спеки и доки, блин, вайбкодеры юные. spec-first разработка, мазафака
        </Quote>
      </div>
    </div>
  )
}
