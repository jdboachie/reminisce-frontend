import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppProvider from '../components/AppProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reminisce',
  description: 'A platform for sharing and preserving memories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
} 