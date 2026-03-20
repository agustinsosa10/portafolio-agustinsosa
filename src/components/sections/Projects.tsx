'use client'

import { ExternalLink, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader'
import ProjectCarousel from '@/components/ui/ProjectCarousel'
import { PROJECTS } from '@/lib/constants'

export default function Projects() {
  const t = useTranslations('projects')

  const projects = PROJECTS.map((p) => ({
    ...p,
    title: t(`items.${p.id}.title` as Parameters<typeof t>[0]),
    description: t(`items.${p.id}.description` as Parameters<typeof t>[0]),
  }))

  const featured = projects.find((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-padding bg-brand-bg">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeader
            label={t('label')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
        </ScrollReveal>

        {featured && (
          <ScrollReveal className="mt-16" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border border-brand-border bg-brand-card">
              <div className="lg:col-span-3">
                <ProjectCarousel
                  images={featured.images}
                  alt={featured.title}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
              <div className="lg:col-span-2 p-8 lg:p-10 flex flex-col justify-center">
                <p className="section-label">{t('featuredLabel')}</p>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-brand-text mb-4">
                  {featured.title}
                </h3>
                <p className="text-brand-body leading-relaxed mb-6">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-8">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase tracking-wide text-brand-muted font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  {featured.github && (
                    <a
                      href={featured.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      {t('codeLabel')}
                    </a>
                  )}
                  {featured.live && (
                    <a
                      href={featured.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('liveLabel')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {others.map((project, i) => (
            <ScrollReveal key={project.id} delay={150 + i * 100}>
              <div className="border border-brand-border bg-brand-card group">
                <ProjectCarousel
                  images={project.images}
                  alt={project.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-brand-text mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-brand-body leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs uppercase tracking-wide text-brand-muted font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 border-t border-brand-border pt-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        {t('codeLabel')}
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t('liveLabel')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
