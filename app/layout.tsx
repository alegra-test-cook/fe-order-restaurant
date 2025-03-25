import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alegra Restaurant',
  description: 'Created with love for alegra',
  generator: 'heanfig',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
