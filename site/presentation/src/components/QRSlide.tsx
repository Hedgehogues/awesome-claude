import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
  displayText: string
  caption?: string
  size?: number
}

export default function QRSlide({ url, displayText, caption, size = 512 }: Props) {
  return (
    <div className="slide-container qr-slide">
      <div className="qr-slide-qr">
        <QRCodeSVG value={url} size={size} level="M" bgColor="#ffffff" fgColor="#000000" />
      </div>
      <div className="qr-slide-info">
        <h1 className="slide-title">Подключайтесь к боту</h1>
        <p className="display-text">{displayText}</p>
        {caption ? <p className="caption">{caption}</p> : null}
      </div>
    </div>
  )
}
