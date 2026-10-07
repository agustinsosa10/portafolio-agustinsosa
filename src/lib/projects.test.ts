import { describe, expect, it } from 'vitest'
import { NAV_HREFS, PROJECTS } from '@/lib/constants'
import { getAdjacentProjects, getProjectBySlug } from '@/lib/projects'

describe('PROJECTS slugs', () => {
  it('are unique', () => {
    const slugs = PROJECTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('are kebab-case', () => {
    for (const p of PROJECTS) {
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })
})

describe('getProjectBySlug', () => {
  it('returns the matching project', () => {
    expect(getProjectBySlug('turistear')?.id).toBe('mobile')
    expect(getProjectBySlug('ies-desarrollos')?.id).toBe('ies')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('no-existe')).toBeUndefined()
  })

  it('is case-sensitive', () => {
    expect(getProjectBySlug('Turistear')).toBeUndefined()
  })
})

describe('getAdjacentProjects', () => {
  const first = PROJECTS[0]
  const last = PROJECTS[PROJECTS.length - 1]

  it('has no prev for the first project', () => {
    const { prev, next } = getAdjacentProjects(first.slug)
    expect(prev).toBeUndefined()
    expect(next?.slug).toBe(PROJECTS[1].slug)
  })

  it('has prev and next for a middle project', () => {
    const { prev, next } = getAdjacentProjects(PROJECTS[2].slug)
    expect(prev?.slug).toBe(PROJECTS[1].slug)
    expect(next?.slug).toBe(PROJECTS[3].slug)
  })

  it('has no next for the last project', () => {
    const { prev, next } = getAdjacentProjects(last.slug)
    expect(prev?.slug).toBe(PROJECTS[PROJECTS.length - 2].slug)
    expect(next).toBeUndefined()
  })

  it('returns neither for an unknown slug', () => {
    expect(getAdjacentProjects('no-existe')).toEqual({})
  })
})

describe('NAV_HREFS', () => {
  it('point to home sections so they work outside the home page', () => {
    for (const link of NAV_HREFS) {
      expect(link.href).toMatch(/^\/#[a-z]+$/)
    }
  })
})
