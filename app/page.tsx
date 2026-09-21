import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { ProcessSteps } from '@/components/process-steps'
import { SoundSkin } from '@/components/sound-skin'
import { Analyse } from '@/components/analyse'
import { Packages } from '@/components/packages'
import { Contact } from '@/components/contact'
import { SiteFooter } from '@/components/site-footer'

export default function Page() {
  return (
    <main className="site-shell relative isolate min-h-screen overflow-hidden bg-background">
      <SiteHeader />
      <Hero />
      <ProcessSteps />
      <Analyse />
      <Packages />
      <SoundSkin />
      <Contact />
      <SiteFooter />
    </main>
  )
}
