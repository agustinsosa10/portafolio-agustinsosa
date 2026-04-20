# Prompt para Claude Code — Actualización de Portfolio

## Contexto

Este es mi portfolio personal (https://agustinsosa-chi.vercel.app/es). Necesito que actualices dos secciones:

1. **Proyectos**: reemplazar/actualizar los proyectos actuales con una nueva lista.
2. **Experiencia laboral**: actualizar la descripción de mi rol en Dagatek para incluir un proyecto nuevo.

El portfolio tiene soporte multiidioma (español e inglés), así que los cambios deben aplicarse en **ambos idiomas** si corresponde.

## Paso 1: Exploración inicial

Antes de hacer cambios, explorá el proyecto y contame:

1. Qué framework/stack usa (Next.js App Router, Pages Router, etc.).
2. Cómo está estructurada la sección de proyectos: ¿hay un archivo de datos central (ej: `projects.ts`, `projects.json`, `data/projects.ts`)? ¿O están hardcodeados en JSX dentro de un componente?
3. Cómo está estructurada la internacionalización (i18n): ¿archivos JSON de traducciones, diccionarios, `next-intl`, etc.? ¿Dónde están los textos en español e inglés?
4. Cómo está estructurada la sección de experiencia laboral (componente, datos, etc.).
5. Cómo se manejan las imágenes de proyectos (carpeta `/public/projects/`, URLs externas, etc.).

Mostrame un resumen breve antes de empezar a editar.

## Paso 2: Actualizar la sección de Proyectos

Quiero que la sección de proyectos quede con **exactamente 3 proyectos en este orden**:

### Proyecto 1 (destacado) — IES Desarrollos Inmobiliarios

- **Título (ES)**: Sitio Corporativo — IES Desarrollos Inmobiliarios
- **Título (EN)**: Corporate Website — IES Desarrollos Inmobiliarios
- **Badge/Estado (ES)**: En desarrollo · Próximo lanzamiento
- **Badge/Estado (EN)**: In development · Upcoming launch
- **Stack**: Next.js, TypeScript, TailwindCSS, Sanity CMS, Vercel
- **Descripción (ES)**: Sitio corporativo en desarrollo para IES Desarrollos Inmobiliarios, empresa del sector construcción en Salta Capital. Incluye hero multi-slide, catálogo de desarrollos con filtros dinámicos por estado, páginas detalle generadas por slug, formulario de contacto con integración a WhatsApp y CMS headless con Sanity para gestión de contenido por parte del cliente. Desarrollado en Dagatek. Próximamente reemplazará al sitio actual en iesdesarrollos.com.ar.
- **Descripción (EN)**: Corporate website in development for IES Desarrollos Inmobiliarios, a construction company based in Salta, Argentina. Features a multi-slide hero, a projects catalog with dynamic filters by status, slug-based detail pages, a contact form with WhatsApp integration, and Sanity headless CMS for client-managed content. Developed at Dagatek. Will soon replace the current website at iesdesarrollos.com.ar.
- **Links**: **NO agregar link "Visitar sitio" ni "Código"**. Este proyecto no tiene links públicos todavía. Si el componente de proyecto requiere link obligatorio, dejalo como placeholder deshabilitado o quitá los botones para este proyecto específico.
- **Imagen**: dejar placeholder (`/projects/ies-desarrollos.webp` o similar) — después subo las capturas reales.

### Proyecto 2 — Plataforma SaaS Multi-Tenant (ERP propio)

- **Título (ES)**: Plataforma SaaS Multi-Tenant para Gestión Empresarial
- **Título (EN)**: Multi-Tenant SaaS Platform for Business Management
- **Badge/Estado (ES)**: Producto propio · En desarrollo
- **Badge/Estado (EN)**: Own product · In development
- **Stack**: Next.js, TypeScript, FastAPI, PostgreSQL, Docker
- **Descripción (ES)**: Plataforma SaaS multi-tenant orientada a la gestión empresarial para pequeños y medianos comercios. Arquitectura fullstack con backend en FastAPI exponiendo APIs REST, frontend en Next.js con TypeScript y base de datos PostgreSQL con aislamiento de datos por tenant. Proyecto comercial propio en desarrollo activo.
- **Descripción (EN)**: Multi-tenant SaaS platform focused on business management for small and medium-sized businesses. Fullstack architecture with a FastAPI backend exposing REST APIs, Next.js frontend with TypeScript, and a PostgreSQL database with tenant-level data isolation. Own commercial product under active development.
- **Links**: **NO agregar link al repositorio de GitHub** (código privado, producto comercial). Si el componente requiere link obligatorio, quitá los botones para este proyecto.
- **Imagen**: placeholder (después subo mockup del dashboard).

### Proyecto 3 — Sistema de Autoservicio Gastronómico

Este ya existe en el portfolio. **Mantenerlo como está**, solo verificá que el stack listado incluya: `Next.js, TypeScript, Prisma, PostgreSQL, NextAuth.js, TailwindCSS`. Si falta alguna tecnología, agregala.

- **Link al código**: https://github.com/agustinsosa10/sistemaAutoservicio (mantener)

### Proyectos a eliminar

- **Aplicación móvil para turismo**: eliminarla del portfolio. El proyecto es trabajo freelance para un cliente privado bajo confidencialidad; no debería estar en el portfolio público.

## Paso 3: Actualizar la sección de Experiencia Laboral

En la experiencia de Dagatek (Software Developer, Ene. 2026 – Actualidad), actualizá los bullets por estos:

**Versión en español**:

- Desarrollo end-to-end del sitio web corporativo para un cliente del sector inmobiliario/construcción con Next.js, TypeScript, TailwindCSS y Sanity CMS: landing con hero multi-slide, catálogo de proyectos con filtros dinámicos, páginas detalle por slug, formulario de contacto e integración con WhatsApp.
- Extensión y mantenimiento de landings en producción con Next.js y TailwindCSS: implementación de nuevas secciones, componentes reutilizables, optimización de imágenes con Next/Image y debugging de errores funcionales asegurando consistencia cross-browser.
- Colaboración en stack backend con FastAPI, PostgreSQL y Docker: apoyo en containerización con Docker Compose. Flujo profesional con Git/GitHub, pull requests y code reviews en equipo multidisciplinario.

**Versión en inglés**:

- End-to-end development of a corporate website for a client in the real estate/construction sector using Next.js, TypeScript, TailwindCSS, and Sanity CMS: multi-slide hero landing, projects catalog with dynamic filters, slug-based detail pages, contact form, and WhatsApp integration.
- Extension and maintenance of production landings with Next.js and TailwindCSS: implementation of new sections, reusable components, image optimization with Next/Image, and debugging of functional errors ensuring cross-browser consistency.
- Collaboration on the backend stack with FastAPI, PostgreSQL, and Docker: supporting containerization with Docker Compose. Professional workflow with Git/GitHub, pull requests, and code reviews in a multidisciplinary team.

## Paso 4: Habilidades (Skills)

Verificá en la sección de habilidades/skills si falta **Sanity CMS** (backend o herramientas). Si falta, agregala. Si ya está, no hagas nada.

## Reglas generales

- **Preservá el estilo visual y estructura** del portfolio. No cambies el diseño, solo el contenido.
- **Mantené consistencia de idioma**: español en la versión ES, inglés correcto en la versión EN.
- **No toques** el hero, "Sobre mí", formación, contacto, footer, ni ningún componente fuera de Proyectos, Experiencia y Skills.
- Si encontrás algún archivo de tipos (ej: `Project.ts`) que tenga campos obligatorios que yo no mencioné, usá valores sensatos por defecto y avisame qué campos completaste vos.
- **Si hay cualquier ambigüedad o decisión importante** (ej: cómo manejar proyectos sin links, qué placeholder de imagen usar, etc.), preguntame antes de hacer el cambio en lugar de asumir.

## Paso 5: Resumen final

Al terminar, mostrame:

1. Lista de archivos modificados.
2. Breve resumen de los cambios aplicados en cada uno.
3. Cualquier decisión que hayas tomado y quieras confirmar conmigo.
4. Si hay algo pendiente (ej: imágenes por subir, links por completar cuando IES salga a producción).

No hagas commit ni push — solo dejá los cambios listos para que yo los revise localmente.
