import type { Metadata } from 'next'
import { AngebotView } from '@/components/angebot-view'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Angebot für Musiker:innen, Artist:innen und Bands — brandcultura',
  description:
    'Listenpreise für Musiker:innen, Artist:innen und Bands: MARK, RELEASE, SYSTEM und MIX. Wir machen Klang sichtbar.',
  alternates: { canonical: 'https://brandcultura.agency/angebot' },
}

export default function AngebotPage() {
  return (
    <main className="site-shell min-h-screen bg-background text-foreground">
      <SiteHeader />
      <AngebotView />
      <SiteFooter />
    </main>
  )
}
