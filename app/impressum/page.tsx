import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Impressum — brandcultura',
  description: 'Kontaktangaben von brandcultura.',
}

export default function ImpressumPage() {
  return (
    <main className="site-shell min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-5 md:px-8">
        <p className="label-mono text-pink">Impressum</p>
        <h1 className="display mt-4 text-4xl font-bold sm:text-6xl">brandcultura</h1>
        <div className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
          <p>Angaben gemäß § 5 DDG.</p>
          <p>
            brandcultura
            <br />
            E-Mail:{' '}
            <a className="text-foreground underline decoration-pink underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <br />
            Website: brandcultura.agency
          </p>
          <p>
            Eine ladungsfähige Postanschrift wird auf Anfrage an diese Adresse mitgeteilt. Hier steht keine erfundene Straße.
          </p>
          <p>Verantwortlich für den Inhalt dieser Website: brandcultura, erreichbar unter der genannten E-Mail.</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
