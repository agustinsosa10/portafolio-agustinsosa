import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getAdjacentProjects } from '@/lib/projects'

export default async function ProjectPager({ slug }: { slug: string }) {
  const t = await getTranslations('projects')
  const { prev, next } = getAdjacentProjects(slug)
  const titleOf = (id: string) => t(`items.${id}.title` as Parameters<typeof t>[0])

  return (
    <nav className="mt-20 pt-8 border-t border-brand-border grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        {prev && (
          <Link href={`/proyectos/${prev.slug}`} className="group block">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-brand-muted font-medium">
              <ArrowLeft className="w-4 h-4" />
              {t('detailLabels.prev')}
            </span>
            <span className="mt-2 block font-display text-lg text-brand-text group-hover:text-brand-accent transition-colors">
              {titleOf(prev.id)}
            </span>
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link href={`/proyectos/${next.slug}`} className="group block">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-brand-muted font-medium">
              {t('detailLabels.next')}
              <ArrowRight className="w-4 h-4" />
            </span>
            <span className="mt-2 block font-display text-lg text-brand-text group-hover:text-brand-accent transition-colors">
              {titleOf(next.id)}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
