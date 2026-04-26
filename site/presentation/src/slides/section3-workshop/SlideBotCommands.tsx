import type { SlideMeta } from '@/types/slide'

export const meta: SlideMeta = {
  id: 'bot-commands',
  title: 'Что написать боту',
  section: 3,
  notes:
    'Показать основные команды до того как начнём propose. Во время propose список расширится тем, что запросит аудитория.',
}

export default function SlideBotCommands() {
  return (
    <div className="slide-container">
      <h1>Что написать боту</h1>
      <div className="bot-commands">
        <div className="command">
          <span className="command-name">/start</span>
          <span className="command-desc">Начать работу с ботом</span>
        </div>
        <div className="command">
          <span className="command-name">/help</span>
          <span className="command-desc">Список доступных команд</span>
        </div>
        <div className="command">
          <span className="command-name">любой текст</span>
          <span className="command-desc">Эхо — бот отправит ответ</span>
        </div>
        <div className="command">
          <span className="command-name">новые команды</span>
          <span className="command-desc">Появятся после `/opsx:apply` в live-демо</span>
        </div>
      </div>
    </div>
  )
}
