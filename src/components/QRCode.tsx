'use client'
import { QRCodeCanvas } from 'qrcode.react'

interface Props {
  url: string
  size?: number
}

export default function QRCode({ url, size = 240 }: Props) {
  return (
    <QRCodeCanvas
      value={url}
      size={size}
      bgColor="#0A121E"
      fgColor="#F96A1B"
      level="M"
      style={{ borderRadius: 8 }}
    />
  )
}