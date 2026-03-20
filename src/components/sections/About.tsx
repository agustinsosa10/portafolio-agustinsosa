import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { GraduationCap } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader'
import { EDUCATION } from '@/lib/constants'

export default async function About() {
  const t = await getTranslations('about')

  const bio = [t('bio0'), t('bio1'), t('bio2')]

  return (
    <section id="about" className="section-padding bg-brand-surface">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <ScrollReveal className="lg:col-span-2" delay={100}>
            <div className="aspect-square relative border border-brand-border overflow-hidden">
              <Image
                src="/foto-perfil.webp"
                alt={t('photoAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-3" delay={200}>
            <div className="space-y-5 mb-10">
              {bio.map((paragraph, i) => (
                <p key={i} className="text-brand-body leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Education block */}
            <div className="border-t border-brand-border pt-8">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-brand-muted font-semibold mb-5">
                <GraduationCap className="w-4 h-4" />
                {t('educationLabel')}
              </p>
              <ul className="space-y-4">
                {EDUCATION.map((edu) => (
                  <li key={edu.id} className="flex items-start gap-4">
                    <span className="text-xs text-brand-muted font-medium w-24 flex-shrink-0 pt-0.5">
                      {edu.period}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-text">
                        {t(edu.degreeKey as Parameters<typeof t>[0])}
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {edu.institution} &mdash;{' '}
                        <span className="text-brand-accent">
                          {t(edu.statusKey as Parameters<typeof t>[0])}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
