import { SiteHeader } from '../site-header'
import { Hero } from '../hero'
import { ProcessSteps } from '../process-steps'
import { SoundSkin } from '../sound-skin'
import { Analyse } from '../analyse'
import { ShapeYourSound } from '../shape-your-sound'
import { SystemDna } from '../system-dna'
import { Contact } from '../contact'
import { SiteFooter } from '../site-footer'
import { LocaleProvider } from '../locale-provider'

export default function Page() {
  return (
    <LocaleProvider>
      <main className="site-shell relative isolate min-h-screen overflow-hidden bg-background">
        <SiteHeader />
        <Hero />
        <ProcessSteps />
        <SoundSkin />
        <Analyse />
        <ShapeYourSound />
        <SystemDna />
        <Contact />
        <SiteFooter />
      </main>
    </LocaleProvider>
  )
}
