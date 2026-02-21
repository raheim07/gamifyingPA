import type { Metadata, Viewport } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const viewport: Viewport = {
  themeColor: "#1a2a3a",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Gamified Physical Activity & Social Support Intervention | CVD Study',
  description: 'A gamified physical activity and social support intervention for cardiovascular risk reduction. Track steps, earn badges, and support each other toward better heart health.',
  icons: {
    icon: [
      {
        url: '/favicon.co',
        media: '(prefers-color-scheme: light)',
      },
      
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
