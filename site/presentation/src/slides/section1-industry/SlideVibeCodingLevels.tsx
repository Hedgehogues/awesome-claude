import type { SlideMeta } from '@/types/slide'
import Quote from '@/components/Quote'

export const meta: SlideMeta = {
  id: 'vibe-coding-levels',
  title: '4 уровня vibe coding',
  section: 2,
  notes:
    'Диагностика аудитории: где вы? Ход с залом. Ключевая концепция Егора. Подтверждение из chat-vibe-coding, Константин Чуйков (6 августа 2025) — эволюция autocomplete → code completion → code generation → spec-first → полная автономия.',
}

export default function SlideVibeCodingLevels() {
  return (
    <div className="slide-container">
      <h1>Где вы сейчас?</h1>
      <ol>
        <li><strong>Tab-completion.</strong> Cursor дополняет строки</li>
        <li><strong>Существенные куски кода.</strong> AI пишет функции целиком</li>
        <li><strong>Агентный режим.</strong> Смотришь, жмёшь Enter</li>
        <li><strong>Прыжок веры.</strong> Кажется можно не смотреть — но ещё не веришь</li>
      </ol>
      <div style={{ marginTop: 'auto' }}>
        <Quote author="Константин Чуйков" source="Vibe Coding Community, 6 августа 2025">
          autocomplete → code completion → code generation → spec-first → полная автономия
        </Quote>
      </div>
    </div>
  )
}
