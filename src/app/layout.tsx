// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LaptopFinder - SPK Rekomendasi Laptop',
  description: 'Sistem Pendukung Keputusan untuk menemukan laptop terbaik sesuai kebutuhan Anda menggunakan metode TOPSIS',
  keywords: 'laptop, rekomendasi, SPK, TOPSIS, sistem pendukung keputusan',
  authors: [{ name: 'LaptopFinder Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'LaptopFinder - SPK Rekomendasi Laptop',
    description: 'Sistem Pendukung Keputusan untuk menemukan laptop terbaik sesuai kebutuhan Anda',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaptopFinder - SPK Rekomendasi Laptop',
    description: 'Sistem Pendukung Keputusan untuk menemukan laptop terbaik sesuai kebutuhan Anda',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}