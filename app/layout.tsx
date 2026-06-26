import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pro Sound — კონტრ-რაიდერი',
  description: 'აუდიო აღჭურვილობის მართვა და კონტრ-რაიდერის გენერაცია',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  )
}
