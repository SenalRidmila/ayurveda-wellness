import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayurveda Wellness Admin Dashboard',
  description: 'Admin dashboard for managing doctor approvals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
