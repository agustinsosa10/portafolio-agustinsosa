'use client'

import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader'
import { EXPERIENCE_IDS, EXPERIENCE_PERIODS } from '@/lib/constants'

const HIGHLIGHT_COUNT = 4

export default function Experience() {
  const t = useTranslations('experience')

  return (
    <section id="experience" className="section-padding bg-brand-bg">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </ScrollReveal>

        <div className="mt-16 relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-brand-border" />

          <div className="space-y-14">
            {EXPERIENCE_IDS.map((id, i) => {
              const highlights = Array.from({ length: HIGHLIGHT_COUNT }, (_, k) => {
                const key = `items.${id}.highlight${k}` as Parameters<typeof t>[0]
                try { return t(key) } catch { return null }
              }).filter(Boolean) as string[]

              return (
                <ScrollReveal key={id} delay={100 + i * 100}>
                  <div className="pl-8 relative">
                    <div className="absolute left-0 top-2 w-2 h-2 bg-brand-accent -translate-x-[3.5px]" />

                    <p className="text-xs uppercase tracking-[0.15em] text-brand-muted font-medium mb-2">
                      {EXPERIENCE_PERIODS[id]}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-brand-text mb-1">
                      {t(`items.${id}.role` as Parameters<typeof t>[0])}
                    </h3>
                    <p className="text-brand-accent text-sm font-medium mb-3">
                      {t(`items.${id}.company` as Parameters<typeof t>[0])}
                    </p>
                    <p className="text-brand-body text-sm leading-relaxed mb-4">
                      {t(`items.${id}.description` as Parameters<typeof t>[0])}
                    </p>
                    <ul className="space-y-1.5">
                      {highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="text-sm text-brand-body flex items-start gap-2"
                        >
                          <span className="mt-1.5 w-1 h-1 bg-brand-accent inline-block flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
