import { PROJECTS, type ProjectData } from '@/lib/constants'

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug: string): {
  prev?: ProjectData
  next?: ProjectData
} {
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? PROJECTS[index - 1] : undefined,
    next: index < PROJECTS.length - 1 ? PROJECTS[index + 1] : undefined,
  }
}
