import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import es from '../../messages/es.json'
import { EXPERIENCE_IDS, EXPERIENCE_PERIODS, PROJECTS } from '@/lib/constants'

interface Detail {
  period: string
  role: string
  context: string[]
  challenges?: { title: string; body: string }[]
}

interface ProjectMessages {
  projects: {
    detailLabels?: Record<string, string>
    items: Record<string, { detail?: Detail }>
  }
}

const locales = { es, en } as unknown as Record<'es' | 'en', ProjectMessages>

const LABEL_KEYS = [
  'back',
  'context',
  'role',
  'period',
  'stack',
  'challenges',
  'prev',
  'next',
  'viewDetail',
]

const FORBIDDEN = /\[REVISAR\]|TODO|TBD/

// Public copy must not hint at past security gaps or internal infra limits.
const SENSITIVE = /credencial|credential|plan gratuito|free plan/i

function allStrings(detail: Detail): string[] {
  return [
    detail.period,
    detail.role,
    ...detail.context,
    ...(detail.challenges ?? []).flatMap((c) => [c.title, c.body]),
  ]
}

describe('projects.detailLabels', () => {
  it.each(['es', 'en'] as const)('has every label in %s', (locale) => {
    const labels = locales[locale].projects.detailLabels ?? {}
    expect(Object.keys(labels).sort()).toEqual([...LABEL_KEYS].sort())
    for (const value of Object.values(labels)) expect(value.trim()).not.toBe('')
  })
})

describe('projects.items.<id>.detail', () => {
  for (const { id } of PROJECTS) {
    describe(id, () => {
      it.each(['es', 'en'] as const)('is complete in %s', (locale) => {
        const detail = locales[locale].projects.items[id]?.detail
        expect(detail).toBeDefined()
        if (!detail) return
        expect(detail.context.length).toBeGreaterThanOrEqual(1)
        expect(detail.context.length).toBeLessThanOrEqual(3)
        if (detail.challenges) {
          expect(detail.challenges.length).toBeGreaterThanOrEqual(2)
          expect(detail.challenges.length).toBeLessThanOrEqual(4)
        }
        for (const text of allStrings(detail)) {
          expect(text.trim()).not.toBe('')
          expect(text).not.toMatch(FORBIDDEN)
          expect(text).not.toMatch(SENSITIVE)
        }
      })

      it('has the same shape in es and en', () => {
        const a = locales.es.projects.items[id]?.detail
        const b = locales.en.projects.items[id]?.detail
        expect(a?.context.length).toBe(b?.context.length)
        expect(a?.challenges?.length).toBe(b?.challenges?.length)
      })
    })
  }
})

describe('experience', () => {
  it('dagatek period ends in May 2026', () => {
    expect(EXPERIENCE_PERIODS.dagatek).toBe('Ene. 2026 — May. 2026')
  })

  it.each(EXPERIENCE_IDS)('%s has the same keys in es and en', (id) => {
    const items = (m: unknown) =>
      (m as { experience: { items: Record<string, Record<string, string>> } }).experience.items
    expect(Object.keys(items(es)[id]).sort()).toEqual(Object.keys(items(en)[id]).sort())
  })
})
