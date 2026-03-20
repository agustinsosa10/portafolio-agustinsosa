import { getTranslations } from 'next-intl/server'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { SOCIAL_LINKS, CONTACT_EMAIL } from '@/lib/constants'

const iconMap: Record<string, React.ReactNode> = {
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
}

export default async function Contact() {
  const t = await getTranslations('contact')

  return (
    <section id="contact" className="section-padding bg-brand-surface">
      <div className="section-container text-center">
        <ScrollReveal>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">{t('title')}</h2>
          <p className="section-subtitle mx-auto">{t('subtitle')}</p>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="mt-12">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-brand-accent hover:text-brand-accent-hover transition-colors duration-200"
            >
              <Mail className="w-6 h-6 md:w-7 md:h-7" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 flex items-center justify-center gap-6">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-body hover:text-brand-accent transition-colors duration-200 text-sm font-medium"
              >
                {iconMap[social.iconName]}
                {social.label}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
