# Página de detalle de proyecto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar `/[locale]/proyectos/[slug]`, una página case study estática por proyecto, enlazada desde las cards del home.

**Architecture:** `slug` nuevo en `PROJECTS` + helpers puros en `src/lib/projects.ts`. El texto largo vive en `messages/{es,en}.json` bajo `projects.items.<id>.detail` (mismo patrón que título/descripción). Ruta server component con SSG, `dynamicParams = false` y metadata por proyecto. Navbar/Footer migran a `Link` de next-intl con `/#seccion` para funcionar fuera del home.

**Tech Stack:** Next.js 14.2 App Router, TypeScript, Tailwind, next-intl 4.8, lucide-react, Vitest (nuevo, devDependency).

**Spec:** `docs/superpowers/specs/2026-10-07-proyecto-detalle-design.md`

## Global Constraints

- Rama: `feature/proyecto-detalle` (ya creada desde `main` en 3fe94bd). Nunca trabajar en `main`.
- **No commitear ni pushear** sin pedido explícito de Agustin. Los pasos "Checkpoint" solo corren `git status`/`git diff --stat`.
- Path fijo `proyectos` en ambos locales: `/es/proyectos/<slug>` y `/en/proyectos/<slug>`.
- Slugs exactos: `ies`→`ies-desarrollos`, `luso`→`luso-estudio`, `saas`→`plataforma-saas`, `autoservicio`→`autoservicio-gastronomico`, `mobile`→`turistear`.
- Orden de `PROJECTS` sin cambios: ies, luso, saas, autoservicio, mobile.
- Sin librerías de UI/animación nuevas. Única dependencia nueva: `vitest` (dev).
- Design system: `section-container`, `section-label`, tokens `brand-*`, `font-display`, esquinas rectas, `ScrollReveal`.
- `ProjectCarousel` y su lightbox **no se modifican** (nunca agregar scroll lock).
- Textos visibles solo en `messages/*.json`; `constants.ts` guarda datos no traducibles.
- Nada de `[REVISAR]`/`TODO` dentro de `messages/*.json`: los datos sin fuente van al archivo de revisión (scratchpad), no al repo.

## Review Focus

1. **Cambio de idioma en el detalle**: `/es/proyectos/turistear` → EN debe ir a `/en/proyectos/turistear`, no al home. (Verificado en Task 5, paso 4.)
2. **Links del Navbar desde el detalle**: "Proyectos" en `/es/proyectos/x` debe llevar a `/es` y posicionarse en `#projects`; en el home debe seguir scrolleando sin recarga completa. (Task 5, paso 4.)
3. **Slug inválido o con mayúsculas** (`/es/proyectos/no-existe`, `/es/proyectos/Turistear`) → 404, nunca 500. (Test unitario de case-sensitivity en Task 1 + curl en Task 5, paso 3.)
4. **Proyecto con una sola imagen** (TuristeAR): el carrusel full width se ve sin flechas ni layout roto. (Screenshot en Task 5, paso 4.)
5. **Marcadores de borrador filtrándose a producción**: ningún `[REVISAR]`/`TODO`/string vacío en `detail`. (Test en Task 2.)

Limitación conocida, no se resuelve acá: no hay `metadataBase`, así que `og:image` usa la URL de Vercel (`VERCEL_URL`) o `localhost` con un warning en el build. Se resuelve cuando haya dominio propio.

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `package.json` | Modify | devDependency `vitest`, script `test` |
| `vitest.config.mts` | Create | alias `@` → `src`, entorno node |
| `src/lib/constants.ts` | Modify | export `ProjectData`, campo `slug`, `NAV_HREFS` con `/#` |
| `src/lib/projects.ts` | Create | `getProjectBySlug`, `getAdjacentProjects` |
| `src/lib/projects.test.ts` | Create | tests de slugs y helpers |
| `src/lib/messages.test.ts` | Create | paridad es/en de `detail` y `detailLabels` |
| `messages/es.json`, `messages/en.json` | Modify | `projects.detailLabels`, `projects.items.<id>.detail` |
| `src/app/[locale]/proyectos/[slug]/page.tsx` | Create | params, SSG, metadata, 404 |
| `src/components/project-detail/ProjectDetail.tsx` | Create | layout del case study |
| `src/components/project-detail/ProjectPager.tsx` | Create | anterior / siguiente |
| `src/components/sections/Projects.tsx` | Modify | link "Ver detalle" |
| `src/components/layout/Navbar.tsx` | Modify | `Link` de next-intl, logo a `/` |
| `src/components/layout/Footer.tsx` | Modify | `Link` de next-intl |

---

### Task 1: Vitest + slugs + helpers de proyectos

**Files:**
- Modify: `package.json`
- Create: `vitest.config.mts`
- Modify: `src/lib/constants.ts:4-50`
- Create: `src/lib/projects.ts`
- Test: `src/lib/projects.test.ts`

**Interfaces:**
- Consumes: `PROJECTS` de `src/lib/constants.ts`.
- Produces:
  - `export interface ProjectData { id: string; slug: string; images: string[]; tags: string[]; github?: string; live?: string; featured?: boolean }` en `src/lib/constants.ts`.
  - `getProjectBySlug(slug: string): ProjectData | undefined`
  - `getAdjacentProjects(slug: string): { prev?: ProjectData; next?: ProjectData }`
  - Script `npm test` (= `vitest run`).

- [ ] **Step 1: Instalar Vitest y configurar**

Run: `npm install -D vitest`

En `package.json` → `scripts`, agregar `"test": "vitest run"`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

Crear `vitest.config.mts`:

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 2: Escribir el test que falla**

Crear `src/lib/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { PROJECTS } from '@/lib/constants'
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
```

- [ ] **Step 3: Correr y verificar que falla**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/projects"` (el módulo no existe).

- [ ] **Step 4: Agregar `slug` y exportar `ProjectData`**

En `src/lib/constants.ts`, reemplazar la interface:

```ts
export interface ProjectData {
  id: string
  slug: string
  images: string[]
  tags: string[]
  github?: string
  live?: string
  featured?: boolean
}
```

Agregar `slug` a cada entrada de `PROJECTS`, justo debajo de `id`:

```ts
  {
    id: 'ies',
    slug: 'ies-desarrollos',
    // ...resto sin cambios
  },
  {
    id: 'luso',
    slug: 'luso-estudio',
  },
  {
    id: 'saas',
    slug: 'plataforma-saas',
  },
  {
    id: 'autoservicio',
    slug: 'autoservicio-gastronomico',
  },
  {
    id: 'mobile',
    slug: 'turistear',
  },
```

- [ ] **Step 5: Implementar los helpers**

Crear `src/lib/projects.ts`:

```ts
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
```

- [ ] **Step 6: Correr y verificar que pasa**

Run: `npm test`
Expected: PASS — 9 tests en `src/lib/projects.test.ts`.

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 7: Checkpoint (sin commit)**

Run: `git status --short`
Expected: `package.json`, `package-lock.json`, `vitest.config.mts`, `src/lib/constants.ts`, `src/lib/projects.ts`, `src/lib/projects.test.ts`.

---

### Task 2: Contenido `detail` es/en + test de paridad

**Files:**
- Test: `src/lib/messages.test.ts`
- Modify: `messages/es.json` (`projects`)
- Modify: `messages/en.json` (`projects`)
- Create (fuera del repo): `<scratchpad>/content-review.md`

**Interfaces:**
- Consumes: `PROJECTS` (con `id`) de Task 1.
- Produces (consumido por Tasks 3 y 4):
  - `projects.detailLabels.{back, context, role, period, stack, challenges, prev, next, viewDetail}`: string.
  - `projects.items.<id>.detail.period`: string.
  - `projects.items.<id>.detail.role`: string.
  - `projects.items.<id>.detail.context`: `string[]` (1–3 párrafos).
  - `projects.items.<id>.detail.challenges?`: `{ title: string; body: string }[]` (2–4).

- [ ] **Step 1: Escribir el test que falla**

Crear `src/lib/messages.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import es from '../../messages/es.json'
import { PROJECTS } from '@/lib/constants'

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
```

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- src/lib/messages.test.ts`
Expected: FAIL — `detailLabels` vacío y `expected undefined to be defined` en cada proyecto.

- [ ] **Step 3: Agregar `detailLabels`**

En `messages/es.json` → `projects`, después de `"liveLabel"`:

```json
    "detailLabels": {
      "back": "Volver a proyectos",
      "context": "Contexto",
      "role": "Mi rol",
      "period": "Período",
      "stack": "Stack",
      "challenges": "Decisiones técnicas y desafíos",
      "prev": "Anterior",
      "next": "Siguiente",
      "viewDetail": "Ver detalle"
    },
```

En `messages/en.json` → `projects`, después de `"liveLabel"`:

```json
    "detailLabels": {
      "back": "Back to projects",
      "context": "Context",
      "role": "My role",
      "period": "Period",
      "stack": "Stack",
      "challenges": "Technical decisions & challenges",
      "prev": "Previous",
      "next": "Next",
      "viewDetail": "View details"
    },
```

- [ ] **Step 4: Juntar fuentes para el borrador**

Fuentes, en orden de confianza (no inventar más allá de esto):
1. `description` actual de cada proyecto en `messages/es.json` y `messages/en.json`.
2. Repo público de autoservicio: `gh repo view agustinsosa10/sistemaAutoservicio` y `gh api repos/agustinsosa10/sistemaAutoservicio/contents` (README, `prisma/schema.prisma`, estructura de `app/`).
3. Sitio en producción de Luso: `https://lusoestudio.com.ar` (estructura de páginas).
4. Repos locales, si existen: `ls ~/proyectos ~/proyectos/antigravity` para buscar ies, saas o turistear y leer su README y `package.json`/`pyproject.toml`.
5. Experiencia laboral en `messages/es.json` → `experience` (Dagatek: período, rol).

- [ ] **Step 5: Redactar `detail` para los 5 proyectos (es + en)**

Agregar `detail` dentro de cada `projects.items.<id>` en ambos archivos, con este formato. Ejemplo de **forma** para `ies` (el texto real sale de las fuentes del paso 4):

```json
      "ies": {
        "title": "...sin cambios...",
        "badge": "...sin cambios...",
        "description": "...sin cambios...",
        "detail": {
          "period": "2025 – presente",
          "role": "Desarrollador frontend en Dagatek. Implementé el sitio completo, desde el modelado de contenido en Sanity hasta el deploy en Vercel.",
          "context": [
            "Párrafo 1: quién es el cliente y qué problema tenía su sitio actual.",
            "Párrafo 2: qué se construyó y para quién (equipo comercial que edita contenido sin depender de un dev)."
          ],
          "challenges": [
            { "title": "CMS headless editable por el cliente", "body": "Por qué Sanity, cómo se modelaron los desarrollos y cómo se regeneran las páginas por slug." },
            { "title": "Catálogo con filtros por estado", "body": "Cómo se resolvieron los filtros y el estado en la URL." }
          ]
        }
      },
```

Reglas:
- `role` en primera persona: qué hiciste, solo o en equipo, dónde.
- `context`: 1–3 párrafos sobre el problema, el cliente/usuario y el alcance.
- `challenges`: 2–4 decisiones técnicas concretas con su porqué, ancladas en el stack real (`tags`).
- `es` y `en` con la misma cantidad de párrafos y desafíos (el test lo exige).
- Tono sobrio y técnico, sin superlativos. Español rioplatense neutro.
- Todo dato que no salga de una fuente (período, tamaño de equipo, desafío puntual) se escribe igual con la suposición más razonable **y** se anota en el archivo de revisión del paso 6. Nunca va un `[REVISAR]` dentro del JSON.

- [ ] **Step 6: Escribir el archivo de revisión**

Crear `<scratchpad>/content-review.md` (el directorio scratchpad de la sesión, no el repo). Una sección por proyecto con cada afirmación no respaldada, en formato:

```markdown
## ies
- [ ] period "2025 – presente" — supuesto, no hay fecha en las fuentes
- [ ] challenge "Catálogo con filtros por estado": detalle de URL state inferido
```

- [ ] **Step 7: Correr y verificar que pasa**

Run: `npm test`
Expected: PASS — `projects.test.ts` (9) + `messages.test.ts` (2 + 5×3 = 17).

Run: `node -e "JSON.parse(require('fs').readFileSync('messages/es.json'));JSON.parse(require('fs').readFileSync('messages/en.json'));console.log('ok')"`
Expected: `ok`

- [ ] **Step 8: Checkpoint (sin commit)**

Run: `git diff --stat`
Expected: `messages/es.json`, `messages/en.json` modificados; `src/lib/messages.test.ts` nuevo (untracked).

---

### Task 3: Ruta `/[locale]/proyectos/[slug]`

**Files:**
- Create: `src/app/[locale]/proyectos/[slug]/page.tsx`
- Create: `src/components/project-detail/ProjectDetail.tsx`
- Create: `src/components/project-detail/ProjectPager.tsx`

**Interfaces:**
- Consumes: `ProjectData`, `PROJECTS` (Task 1); `getProjectBySlug`, `getAdjacentProjects` (Task 1); claves `projects.detailLabels.*` y `projects.items.<id>.detail.*` (Task 2); `Link` de `@/i18n/navigation`; `ProjectCarousel({ images, alt, sizes })`; `ScrollReveal({ children, className, delay })`.
- Produces: rutas estáticas `/{es,en}/proyectos/{slug}` (consumidas por los links de Task 4).

No hay test unitario para RSC en este setup (sin testing-library). La verificación es build + curl + navegador; está en el paso 5 y en Task 5.

- [ ] **Step 1: Crear `ProjectPager`**

`src/components/project-detail/ProjectPager.tsx`:

```tsx
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
```

- [ ] **Step 2: Crear `ProjectDetail`**

`src/components/project-detail/ProjectDetail.tsx`:

```tsx
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
```

En mobile (`grid-cols-1`) el `aside` va primero en el DOM, así que queda arriba del contenido. Desde `lg`, `order` lo manda a la derecha.

- [ ] **Step 3: Crear la página**

`src/app/[locale]/proyectos/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Type-check y lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores ni warnings nuevos.

- [ ] **Step 5: Build y smoke test**

Run: `npm run build 2>&1 | tail -25`
Expected: aparece `● /[locale]/proyectos/[slug]` con 10 paths (`/en/proyectos/ies-desarrollos`, …, `[+N more paths]`). El build termina sin errores.

Run: `npm run start -- -p 3100` en background y después:

```bash
for p in /es/proyectos/turistear /en/proyectos/ies-desarrollos /es/proyectos/no-existe /es/proyectos/Turistear; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3100$p"
done
curl -s http://localhost:3100/es/proyectos/turistear | grep -o '<title>[^<]*</title>'
```

Expected:
```
/es/proyectos/turistear 200
/en/proyectos/ies-desarrollos 200
/es/proyectos/no-existe 404
/es/proyectos/Turistear 404
<title>TuristeAR — App Móvil de Turismo — Marcelo Agustin Sosa</title>
```

Cortar el server al terminar.

- [ ] **Step 6: Checkpoint (sin commit)**

Run: `git status --short`
Expected: `src/app/[locale]/proyectos/` y `src/components/project-detail/` nuevos.

---

### Task 4: Entrada desde el home + Navbar/Footer fuera del home

**Files:**
- Modify: `src/lib/constants.ts:13-19` (`NAV_HREFS`)
- Modify: `src/components/sections/Projects.tsx`
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Test: `src/lib/projects.test.ts` (agregar caso de `NAV_HREFS`)

**Interfaces:**
- Consumes: `slug` en cada proyecto (Task 1); `projects.detailLabels.viewDetail` (Task 2); ruta `/proyectos/[slug]` (Task 3); `Link` de `@/i18n/navigation`.
- Produces: nada que consuma otra task.

- [ ] **Step 1: Escribir el test que falla**

Agregar al final de `src/lib/projects.test.ts`:

```ts
import { NAV_HREFS } from '@/lib/constants'

describe('NAV_HREFS', () => {
  it('point to home sections so they work outside the home page', () => {
    for (const link of NAV_HREFS) {
      expect(link.href).toMatch(/^\/#[a-z]+$/)
    }
  })
})
```

(Mover el `import` arriba, junto al import existente de `@/lib/constants`: `import { NAV_HREFS, PROJECTS } from '@/lib/constants'`.)

- [ ] **Step 2: Correr y verificar que falla**

Run: `npm test -- src/lib/projects.test.ts`
Expected: FAIL — `expected '#about' to match /^\/#[a-z]+$/`.

- [ ] **Step 3: Actualizar `NAV_HREFS`**

En `src/lib/constants.ts`:

```ts
export const NAV_HREFS = [
  { key: 'about', href: '/#about' },
  { key: 'projects', href: '/#projects' },
  { key: 'skills', href: '/#skills' },
  { key: 'experience', href: '/#experience' },
  { key: 'contact', href: '/#contact' },
]
```

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Navbar con `Link` de next-intl**

En `src/components/layout/Navbar.tsx`:
- Agregar `import { Link } from '@/i18n/navigation'`.
- Logo: `<a href="#" ...>` → `<Link href="/" ...>` (mismas clases, cerrar con `</Link>`).
- Links desktop y mobile: `<a key=... href={link.href} ...>` → `<Link key=... href={link.href} ...>` (el mobile conserva `onClick={handleNavClick}`).
- CTA desktop y mobile: `<a href="#contact" ...>` → `<Link href="/#contact" ...>` (el mobile conserva `onClick={handleNavClick}`).

Resultado del bloque desktop, como referencia:

```tsx
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_HREFS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 text-sm text-brand-body font-medium transition-colors duration-200 hover:text-brand-accent"
                >
                  {t(link.key as Parameters<typeof t>[0])}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher />
            <Link href="/#contact" className="btn-primary text-sm">
              {t('cta')}
            </Link>
          </div>
```

- [ ] **Step 5: Footer con `Link` de next-intl**

En `src/components/layout/Footer.tsx`:
- Agregar `import { Link } from '@/i18n/navigation'`.
- En el `NAV_HREFS.map`, `<a ...>`/`</a>` → `<Link ...>`/`</Link>`, mismas props. Los links sociales siguen siendo `<a>` (externos).

- [ ] **Step 6: Link "Ver detalle" en `Projects.tsx`**

En `src/components/sections/Projects.tsx`:
- Imports: `import { ArrowRight, ExternalLink, Github } from 'lucide-react'` y `import { Link } from '@/i18n/navigation'`.
- En la card destacada, dentro de `<div className="flex items-center gap-4">`, después del link `live`:

```tsx
                  <Link
                    href={`/proyectos/${featured.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                  >
                    {t('detailLabels.viewDetail')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
```

- En las cards comunes, dentro de `<div className="flex items-center gap-4 border-t border-brand-border pt-4">`, después del link `live`:

```tsx
                    <Link
                      href={`/proyectos/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand-body hover:text-brand-accent transition-colors"
                    >
                      {t('detailLabels.viewDetail')}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
```

`project`/`featured` ya traen `slug` por el spread `...p` del `map` existente.

- [ ] **Step 7: Type-check, lint, tests**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: sin errores; todos los tests PASS.

- [ ] **Step 8: Checkpoint (sin commit)**

Run: `git diff --stat`
Expected: `constants.ts`, `Projects.tsx`, `Navbar.tsx`, `Footer.tsx`, `projects.test.ts` modificados.

---

### Task 5: Verificación end-to-end y memoria

**Files:**
- Modify: `/home/agustin/.claude/projects/-home-agustin-proyectos-antigravity-portfolio/memory/project_portfolio.md`
- Modify: `/home/agustin/.claude/projects/-home-agustin-proyectos-antigravity-portfolio/memory/MEMORY.md`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: evidencia de verificación (output + screenshots) para Agustin.

- [ ] **Step 1: Suite completa**

Run: `npm test && npm run lint && npx tsc --noEmit`
Expected: todo PASS / sin errores. Mostrar el output.

- [ ] **Step 2: Build de producción**

Run: `npm run build 2>&1 | tail -25`
Expected: `● /[locale]` y `● /[locale]/proyectos/[slug]` (SSG), sin errores. El warning de `metadataBase` es aceptable (ver Review Focus).

- [ ] **Step 3: Smoke HTTP**

Con `npm run start -- -p 3100` en background:

```bash
for l in es en; do for s in ies-desarrollos luso-estudio plataforma-saas autoservicio-gastronomico turistear; do
  printf '%s ' "/$l/proyectos/$s"; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3100/$l/proyectos/$s"
done; done
for p in /es/proyectos/no-existe /en/proyectos/Turistear; do
  printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "http://localhost:3100$p"
done
curl -s http://localhost:3100/es | grep -o 'href="/es/proyectos/[a-z-]*"' | sort -u
curl -s http://localhost:3100/es/proyectos/turistear | grep -o 'href="/es#[a-z]*"' | sort -u
```

Expected: 10 × `200`; 2 × `404`; 5 hrefs `/es/proyectos/<slug>` en el home; hrefs `/es#about` … `/es#contact` en el detalle. Si next-intl genera `/es/#about` en lugar de `/es#about`, ajustar el grep. Las dos formas son válidas siempre que el paso 4 confirme la navegación.

- [ ] **Step 4: Navegador (skill `webapp-testing` o `browse`)**

Contra `http://localhost:3100`, con screenshot de cada uno:
1. `/es` → click "Ver detalle" en TuristeAR → URL `/es/proyectos/turistear`, se ven título, carrusel (una imagen, sin flechas), rol, período, stack y contexto.
2. En el detalle, LanguageSwitcher → EN → URL `/en/proyectos/turistear`, textos en inglés.
3. En el detalle, Navbar "Projects" → URL `/en` y viewport en la sección `#projects`.
4. En `/es`, Navbar "Sobre mí" → scrollea a `#about` sin recarga completa.
5. Pager: en `/es/proyectos/ies-desarrollos` hay solo "Siguiente"; en `/es/proyectos/turistear` hay solo "Anterior".
6. Viewport 390×844 en `/es/proyectos/luso-estudio`: una columna, aside arriba del contexto, sin scroll horizontal.
7. Consola sin errores en todas las páginas.

Cortar el server al terminar.

- [ ] **Step 5: Actualizar memoria**

En `project_portfolio.md`, agregar una línea `Update 2026-10-07` con lo siguiente:
- ruta `/[locale]/proyectos/[slug]`, slugs, contenido en `projects.items.<id>.detail`, Vitest agregado;
- rama `feature/proyecto-detalle`, sin commitear salvo que Agustin lo haya pedido;
- qué quedó verificado (tests, build, curl, navegador);
- lo pendiente: revisar `content-review.md`, `metadataBase` cuando haya dominio.

Actualizar el hook de la línea del índice en `MEMORY.md`.

- [ ] **Step 6: Reporte a Agustin**

Resumen con:
- output de tests, build y curl;
- links o paths de los screenshots;
- contenido de `content-review.md` (lo que tiene que confirmar);
- estado de git (`git status --short`).

No commitear.
