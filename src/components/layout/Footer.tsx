import { getTranslations } from 'next-intl/server'
import { Github, Linkedin, Twitter } from 'lucide-react'
import { NAV_HREFS, SOCIAL_LINKS } from '@/lib/constants'

const iconMap: Record<string, React.ReactNode> = {
  Github: <Github className="w-5 h-5" />,
  Linkedin: <Linkedin className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
}

export default async function Footer() {
  const tSite = await getTranslations('site')
  const tNav = await getTranslations('nav')
  const tFooter = await getTranslations('footer')

  return (
    <footer className="bg-brand-surface border-t border-brand-border">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div>
            <p className="font-display text-lg font-semibold text-brand-text mb-2">
              {tSite('name')}
            </p>
            <p className="text-sm text-brand-muted">{tFooter('role')}</p>
          </div>

          <div className="flex flex-col items-start md:items-center gap-2">
            {NAV_HREFS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-brand-body hover:text-brand-accent transition-colors duration-200"
              >
                {tNav(link.key as Parameters<typeof tNav>[0])}
              </a>
            ))}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-muted hover:text-brand-accent transition-colors duration-200"
                  aria-label={social.label}
                >
                  {iconMap[social.iconName]}
                </a>
              ))}
            </div>
            <p className="text-xs text-brand-muted">
              &copy; {new Date().getFullYear()} {tSite('name')} — {tFooter('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
