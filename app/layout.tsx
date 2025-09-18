import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Railway Mission Control - AI Traffic Optimizer',
  description: 'Advanced AI-powered train traffic optimization system with real-time monitoring and control',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-control-bg">
          {children}
        </div>
      </body>
    </html>
  )
}
