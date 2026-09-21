import type { Metadata } from 'next'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { CONTACT_EMAIL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Datenschutz — brandcultura',
  description: 'Wie brandcultura Anfragen verarbeitet.',
}

export default function PrivacyPage() {
  return (
    <main className="site-shell min-h-screen bg-background text-foreground">
      <SiteHeader />
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-5 md:px-8">
        <p className="label-mono text-pink">Datenschutz</p>
        <h1 className="display mt-4 text-4xl font-bold sm:text-6xl">Anfragen</h1>
        <div className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Verantwortlich: brandcultura,{' '}
            <a className="text-foreground underline decoration-pink underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <p>
            Das Formular speichert Name, E-Mail, gewähltes Paket, Nachricht und — beim Paket MIX — die angehakten Module.
            Zweck ist allein die Antwort auf die Anfrage. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche
            Schritte) und die Einwilligung im Formular, Art. 6 Abs. 1 lit. a DSGVO.
          </p>
          <p>
            Die Nachricht wird zum Versand an {CONTACT_EMAIL} über FormSubmit (formsubmit.co) weitergeleitet. Es gibt
            keine eigene Datenbank für Formulare. Hosting und Auslieferung der Seite liegen bei Vercel Inc. In der
            produktiven Version läuft Vercel Web Analytics: Seitenaufrufe, ohne Marketing-Cookies und ohne Inhalt der
            Anfrage.
          </p>
          <p>
            Die Anfrage bleibt, bis sie beantwortet und der Vorgang erledigt ist, und wird danach gelöscht, sofern keine
            gesetzliche Pflicht entgegensteht. Du kannst Auskunft, Berichtigung und Löschung unter der genannten E-Mail
            verlangen und dich bei einer Aufsichtsbehörde beschweren.
          </p>
        </div>
      </article>
      <SiteFooter />
    </main>
  )
}
