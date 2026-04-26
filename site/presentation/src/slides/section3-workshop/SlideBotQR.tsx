import type { SlideMeta } from '@/types/slide'
import QRSlide from '@/components/QRSlide'
import { config } from '@/data/config'

export const meta: SlideMeta = {
  id: 'bot-qr',
  title: 'QR-код бота воркшопа',
  section: 3,
  notes:
    'Ключевой момент воркшопа. Аудитория сканирует QR, подключается к боту. Задержать на слайде 30-60 секунд чтобы успели все. Убедиться что ссылка правильная (настройки в src/data/config.ts).',
}

export default function SlideBotQR() {
  return (
    <QRSlide
      url={config.botUrl}
      displayText={`@${config.botUsername}`}
      caption="Напишите боту /start — будем работать с ним прямо в демо"
    />
  )
}
