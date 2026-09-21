import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, Onest } from 'next/font/google'
import { LocaleProvider } from '@/components/locale-provider'
import './globals.css'

const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://brandcultura.art'),
  title: 'brandcultura — Klangidentität für Artists und Labels',
  description:
    'Wir machen Klang sichtbar. Identitäten, Cover und Systeme für Musiker:innen und Labels — vom ersten Zeichen bis zur arbeitenden Hülle.',
  openGraph: {
    title: 'brandcultura — Klangidentität für Artists und Labels',
    description:
      'Wir machen Klang sichtbar. Identitäten, Cover und Systeme für Musiker:innen und Labels — vom ersten Zeichen bis zur arbeitenden Hülle.',
    url: 'https://brandcultura.art',
    siteName: 'brandcultura',
    locale: 'de_DE',
    type: 'website',
    images: [{ url: '/images/shape-your-sound.png', alt: 'Spektrogramm-Formen als visuelle Identität' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#010101',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="de"
      className={`bg-background ${onest.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <LocaleProvider>{children}</LocaleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
