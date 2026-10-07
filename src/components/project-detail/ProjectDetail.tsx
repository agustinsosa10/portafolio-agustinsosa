import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import ProjectCarousel from '@/components/ui/ProjectCarousel'
import ScrollReveal from '@/components/ui/ScrollReveal'
import type { ProjectData } from '@/lib/constants'
import ProjectPager from './ProjectPager'

interface Challenge {
  title: string
  body: string
}

const linkClass =
  'inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors'

export default async function ProjectDetail({ project }: { project: ProjectData }) {
  const t = await getTranslations('projects')
  const key = (k: string) => `items.${project.id}.${k}` as Parameters<typeof t>[0]

  const title = t(key('title'))
  const badge = t.has(key('badge')) ? t(key('badge')) : ''
  const context = t.raw(key('detail.context')) as string[]
  const challenges = t.has(key('detail.challenges'))
    ? (t.raw(key('detail.challenges')) as Challenge[])
    : []

  return (
    <article className="pt-28 lg:pt-36 pb-20 lg:pb-28 bg-brand-bg">
      <div className="section-container">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-muted hover:text-brand-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('detailLabels.back')}
        </Link>

        <header className="mt-8 max-w-3xl">
          <h1 className="font-display text-3xl lg:text-5xl font-semibold text-brand-text leading-tight">
            {title}
          </h1>
          {badge && (
            <p className="mt-4 text-xs uppercase tracking-wide text-brand-accent font-medium">
              {badge}
            </p>
          )}
          {(project.github || project.live) && (
            <div className="mt-6 flex items-center gap-4">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <Github className="w-4 h-4" />
                  {t('codeLabel')}
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ExternalLink className="w-4 h-4" />
                  {t('liveLabel')}
                </a>
              )}
            </div>
          )}
        </header>

        <ScrollReveal className="mt-12">
          <div className="border border-brand-border bg-brand-card">
            <ProjectCarousel
              images={project.images}
              alt={title}
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          </div>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <aside className="lg:order-2 space-y-8 lg:border-l lg:border-brand-border lg:pl-10">
            <div>
              <p className="section-label">{t('detailLabels.role')}</p>
              <p className="text-brand-body leading-relaxed">{t(key('detail.role'))}</p>
            </div>
            <div>
              <p className="section-label">{t('detailLabels.period')}</p>
              <p className="text-brand-body">{t(key('detail.period'))}</p>
            </div>
            <div>
              <p className="section-label">{t('detailLabels.stack')}</p>
              <ul className="space-y-1">
                {project.tags.map((tag) => (
                  <li key={tag} className="text-sm text-brand-body">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2 lg:order-1 space-y-14">
            <ScrollReveal>
              <section>
                <h2 className="font-display text-2xl font-semibold text-brand-text mb-6">
                  {t('detailLabels.context')}
                </h2>
                <div className="space-y-4">
                  {context.map((paragraph, i) => (
                    <p key={i} className="text-brand-body leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {challenges.length > 0 && (
              <ScrollReveal>
                <section>
                  <h2 className="font-display text-2xl font-semibold text-brand-text mb-8">
                    {t('detailLabels.challenges')}
                  </h2>
                  <ol className="space-y-8">
                    {challenges.map((challenge, i) => (
                      <li key={challenge.title} className="grid grid-cols-[auto_1fr] gap-x-6">
                        <span className="font-display text-2xl text-brand-accent">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-semibold text-brand-text mb-2">{challenge.title}</h3>
                          <p className="text-brand-body leading-relaxed">{challenge.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </ScrollReveal>
            )}
          </div>
        </div>

        <ProjectPager slug={project.slug} />
      </div>
    </article>
  )
}
