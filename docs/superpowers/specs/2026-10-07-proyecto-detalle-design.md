# Página de detalle de proyecto — `/[locale]/proyectos/[slug]`

Fecha: 2026-10-07 · Rama: `feature/proyecto-detalle`

## Objetivo

Cada proyecto del portfolio tiene una página propia con formato case study, pensada para
recruiters: muestra contexto, rol y decisiones técnicas, no solo el resultado visual.

**Éxito:**
- Las 5 páginas (× 2 locales = 10) se generan estáticamente y cargan en es/en.
- Un slug inexistente devuelve 404.
- Desde cada card del home se llega al detalle con un link "Ver detalle".
- Navbar y Footer funcionan desde la página de detalle (vuelven al home + sección).
- Cambiar de idioma en el detalle mantiene el proyecto.

## Decisiones

| Tema | Decisión |
|---|---|
| Audiencia | Recruiters — case study técnico |
| URL | Path fijo `proyectos` en ambos locales; slug legible |
| Contenido | Case study estructurado en `messages/{es,en}.json` (patrón existente) |
| Secciones | Contexto, Mi rol + período, Decisiones técnicas / desafíos (sin "Resultados") |
| Entrada | Link "Ver detalle" en cada card, junto a Código / Ver sitio |
| Extras | SSG + 404, metadata por proyecto, anterior/siguiente, Navbar funcional |
| Tests | Vitest (nueva devDependency) |
| Redacción | Claude redacta borrador es/en; datos no respaldados por fuente se listan para revisión |

## Datos

### `src/lib/constants.ts`

`ProjectData` se exporta y suma `slug`:

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

| id | slug |
|---|---|
| `ies` | `ies-desarrollos` |
| `luso` | `luso-estudio` |
| `saas` | `plataforma-saas` |
| `autoservicio` | `autoservicio-gastronomico` |
| `mobile` | `turistear` |

El `id` sigue siendo la clave de traducción; el `slug` es solo la URL pública.

### `src/lib/projects.ts` (nuevo, funciones puras)

- `getProjectBySlug(slug: string): ProjectData | undefined`
- `getAdjacentProjects(slug: string): { prev?: ProjectData; next?: ProjectData }` — según
  el orden de `PROJECTS`, sin wrap (el primero no tiene `prev`, el último no tiene `next`).

### `messages/{es,en}.json`

Por proyecto, dentro de `projects.items.<id>`:

```json
"detail": {
  "period": "2025 – presente",
  "role": "Desarrollador fullstack en Dagatek…",
  "context": ["párrafo 1", "párrafo 2"],
  "challenges": [{ "title": "…", "body": "…" }]
}
```

- `context`: 1–3 párrafos.
- `challenges`: 2–4 ítems. Opcional: si falta, la sección no se renderiza.

Labels comunes en `projects.detailLabels`: `back`, `context`, `role`, `period`, `stack`,
`challenges`, `prev`, `next`, `viewDetail`.

## Ruta

`src/app/[locale]/proyectos/[slug]/page.tsx` — server component.

- `generateStaticParams`: `routing.locales × PROJECTS.map(p => p.slug)`.
- `export const dynamicParams = false` + `notFound()` si `getProjectBySlug` no encuentra.
- `generateMetadata`: `title` = título del proyecto + nombre del sitio, `description` = la
  descripción corta existente, `openGraph.images` = primera imagen del proyecto.
- Textos vía `getTranslations` (server). Llama `setRequestLocale(locale)` al inicio para
  habilitar el render estático con next-intl.

## UI

Reutiliza `Navbar`, `Footer`, `ProjectCarousel`, `ScrollReveal` y las clases del design
system (`section-container`, `brand-*`, esquinas rectas).

```
← Volver a proyectos                     (Link → /#projects)

TÍTULO (Playfair)
BADGE · tags
[Código] [Ver sitio]

ProjectCarousel full width

┌─ main (lg: 2/3) ──────────┐  ┌─ aside (lg: 1/3) ┐
│ Contexto (párrafos)       │  │ Mi rol           │
│ Decisiones y desafíos     │  │ Período          │
│  01 título — body         │  │ Stack (lista)    │
└───────────────────────────┘  └──────────────────┘
← Anterior: X                         Siguiente: Y →
```

En mobile, una columna, con el aside antes del main.

### Cambios en componentes existentes

- `Projects.tsx`: link "Ver detalle" (`Link` de `@/i18n/navigation`, ícono `ArrowRight`) en
  la card destacada y en las cards comunes, con el mismo estilo que Código / Ver sitio.
- `NAV_HREFS`: `#about` → `/#about`, etc.
- `Navbar.tsx` / `Footer.tsx`: los links de navegación y el CTA "#contact" usan `Link` de
  `@/i18n/navigation` (resuelve `/es#about`); el logo pasa de `#` a `/`.
- El lightbox de `ProjectCarousel` no se toca (sin scroll lock).

## Tests

Vitest como devDependency, script `npm test`. Tests escritos antes de la implementación.

- `src/lib/projects.test.ts`
  - slugs únicos y kebab-case;
  - `getProjectBySlug` encuentra un slug válido y devuelve `undefined` para uno inválido;
  - `getAdjacentProjects` en el primero, en el medio y en el último.
- `src/lib/messages.test.ts`
  - cada `PROJECTS[i].id` tiene `detail` en `es` y `en`;
  - mismas claves en ambos locales, igual cantidad de `context` y `challenges`;
  - `detailLabels` con las mismas claves en ambos locales.

Verificación de cierre: `npm test`, `npm run lint`, `npm run build` (10 rutas de detalle),
curl a un slug válido (200) y a uno inválido (404), screenshot del detalle en es/en desktop
y mobile, y navegación Navbar desde el detalle.

## Contenido

Claude redacta el borrador es/en a partir de las descripciones actuales y del repo público
de autoservicio. Todo dato no respaldado por una fuente (períodos, tamaño de equipo,
desafíos concretos) se lista en un archivo de revisión fuera del repo para que Agustin lo
confirme antes de mergear.

## Fuera de alcance

- Paths traducidos (`/en/projects`).
- Sección "Resultados / aprendizajes".
- MDX o CMS.
- Tests E2E (Playwright).
