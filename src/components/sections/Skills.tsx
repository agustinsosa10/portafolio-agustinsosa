import { getTranslations } from 'next-intl/server'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader'
import { SKILL_NAMES } from '@/lib/constants'

const CATEGORY_KEYS = ['frontend', 'backend', 'data'] as const

export default async function Skills() {
  const t = await getTranslations('skills')

  return (
    <section id="skills" className="section-padding bg-brand-surface">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {CATEGORY_KEYS.map((key, i) => (
            <ScrollReveal key={key} delay={100 + i * 100}>
              <div>
                <h3 className="font-display text-xl font-semibold text-brand-text mb-4">
                  {t(`categories.${key}`)}
                </h3>
                <hr className="border-brand-border mb-5" />
                <ul className="space-y-0">
                  {SKILL_NAMES[key].map((skill) => (
                    <li
                      key={skill}
                      className="py-3 border-b border-brand-border text-brand-body text-sm last:border-b-0"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
