import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProjectDetail from '@/components/project-detail/ProjectDetail'
import { PROJECTS } from '@/lib/constants'
import { getProjectBySlug } from '@/lib/projects'

type Params = { locale: string; slug: string }

export const dynamicParams = false

// Runs once per locale from the parent [locale] layout → locales × slugs.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  if (!project) return {}

  const t = await getTranslations({ locale: params.locale, namespace: 'projects' })
  const tSite = await getTranslations({ locale: params.locale, namespace: 'site' })
  const projectTitle = t(`items.${project.id}.title` as Parameters<typeof t>[0])
  const title = `${projectTitle} — ${tSite('name')}`
  const description = t(`items.${project.id}.description` as Parameters<typeof t>[0])

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [project.images[0]],
    },
  }
}

export default function ProjectPage({ params }: { params: Params }) {
  setRequestLocale(params.locale)
  const project = getProjectBySlug(params.slug)
  if (!project) notFound()

  return (
    <>
      <Navbar />
      <main>
        <ProjectDetail project={project} />
      </main>
      <Footer />
    </>
  )
}
