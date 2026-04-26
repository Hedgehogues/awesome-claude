import { useNavigate } from 'react-router-dom'

interface LinkItem {
  url: string
  label: string
  comment?: string
}

interface LinkSection {
  title: string
  items: LinkItem[]
}

const sections: LinkSection[] = [
  {
    title: 'Личное',
    items: [
      { url: 'https://www.linkedin.com/in/eurvanov/', label: 'LinkedIn', comment: 'CTO · AI' },
      { url: 'https://ru.stackoverflow.com/users/188116/eurvanov', label: 'Stack Overflow', comment: '#103 year rank · 10 256 репутации · 10+ лет' },
      { url: 'http://github.com/hedgehogues/', label: 'GitHub', comment: '100+ звёзд' },
      { url: 'https://t.me/eurvanov', label: 'Telegram' },
      { url: 'https://vk.com/eurvanov', label: 'VK' },
      { url: 'https://getmentor.dev/mentor/egor-urvanov-1077', label: 'GetMentor', comment: 'Топ-1 ментор · 1500+ часов консультаций' },
      { url: 'https://www.linkedin.com/in/eurvanov/details/certifications/', label: 'LinkedIn · Сертификаты' },
      { url: 'https://www.linkedin.com/in/eurvanov/details/projects/', label: 'LinkedIn · Проекты' },
      { url: 'https://www.linkedin.com/in/eurvanov/details/recommendations/?detailScreenTabIndex=0', label: 'LinkedIn · Рекомендации' },
      { url: 'https://www.linkedin.com/in/eurvanov/details/honors/', label: 'LinkedIn · Достижения', comment: 'Best Onboarding Manager · Sbermarket. Winner · Self-driving cars' },
    ],
  },
  {
    title: 'IT-комьюнити',
    items: [
      { url: 'https://t.me/batumi_it_digital', label: 'Батуми' },
      { url: 'https://t.me/it_danang', label: 'Дананг' },
      { url: 'https://t.me/bangkok_it', label: 'Бангкок' },
      { url: 'https://t.me/bali_digital_it', label: 'Бали' },
      { url: 'https://t.me/phuket_digital_it', label: 'Пхукет' },
      { url: 'https://t.me/almati_it', label: 'Алматы' },
      { url: 'https://t.me/spb_digital_it', label: 'Санкт-Петербург' },
      { url: 'https://t.me/antalia_it', label: 'Анталья' },
      { url: 'https://t.me/moscow_digital_it', label: 'Москва' },
      { url: 'https://t.me/belgrade_it_digital', label: 'Белград' },
      { url: 'https://t.me/berlin_it_digital', label: 'Берлин' },
    ],
  },
  {
    title: 'Каналы',
    items: [
      { url: 'https://t.me/tales_from_it', label: 'Tales from IT' },
      { url: 'https://t.me/man_and_business', label: 'Человек и бизнес' },
      { url: 'https://t.me/want_to_it', label: 'Want to IT' },
      { url: 'https://t.me/agent_coding', label: 'Agent Coding' },
      { url: 'https://t.me/ptd_vnzh_georgia', label: 'PTD VNzh Georgia' },
      { url: 'https://t.me/customer_success_team', label: 'Customer Success Team' },
      { url: 'https://t.me/digital_nomads_asia', label: 'Digital Nomads Asia' },
      { url: 'https://www.youtube.com/@Digital_nomads_asia/videos', label: 'YouTube · Digital Nomads Asia', comment: 'Конференция в Таиланде' },
    ],
  },
  {
    title: 'Медиа',
    items: [
      { url: 'https://www.linkedin.com/feed/update/urn:li:activity:7198977579297456128/', label: 'LinkedIn · Публикация' },
      { url: 'https://ysnit.mave.digital/ep-40', label: 'Подкаст · Знай и Умей ИТ', comment: 'CTO Егор — страх кода, event storming и будущее с ИИ' },
      { url: 'https://www.youtube.com/watch?v=ycjmtkwQf8E', label: 'YouTube · SDD фреймворки для детерминированной AI разработки' },
      { url: 'https://www.youtube.com/watch?v=O8VbhnRUyJQ', label: 'YouTube · Рождённые копипастить: LLM-подходы и паттерны' },
      { url: 'https://www.youtube.com/watch?v=NqMS-UOU0os', label: 'YouTube · Модификация Event Storming для использования в команде' },
      { url: 'https://www.youtube.com/watch?v=F5dOtAwmpMQ', label: 'YouTube · Интеграционные тесты на Go | Golang Meetup 2022' },
      { url: 'https://www.youtube.com/watch?v=bHewQCWJE2g', label: 'YouTube · Confluence/Jira. Transformers for Cayley', comment: 'ML для кубика Рубика · превзошли SOTA' },
      { url: 'https://www.youtube.com/watch?v=V_bRcl6EjFk', label: 'YouTube · Golang by Rebrain. Сбор данных в интернете' },
      { url: 'https://www.youtube.com/watch?v=1LobFwBLel8', label: 'YouTube · Очумелые ручки беспилотников: Битва дата саентистов', comment: 'Winner · Self-driving cars competition' },
    ],
  },
]

export default function LinksView() {
  const navigate = useNavigate()

  return (
    <div className="links-page">
      <div className="links-header">
        <span className="links-title">Ссылки</span>
        <button className="links-close" onClick={() => navigate(-1)}>✕</button>
      </div>
      <div className="links-content">
        {sections.map((section) => (
          <div key={section.title} className="links-section">
            <h2 className="links-section-title">{section.title}</h2>
            <ul className="links-list">
              {section.items.map((item) => (
                <li key={item.url} className="links-item">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="links-link">
                    {item.label}
                  </a>
                  {item.comment && <span className="links-comment">{item.comment}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
