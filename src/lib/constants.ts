// Non-translatable data: ids, images, hrefs, tech tags, icon names, periods.
// All visible text lives in messages/en.json and messages/es.json.

interface ProjectData {
  id: string
  images: string[]
  tags: string[]
  github?: string
  live?: string
  featured?: boolean
}

export const NAV_HREFS = [
  { key: 'about', href: '#about' },
  { key: 'projects', href: '#projects' },
  { key: 'skills', href: '#skills' },
  { key: 'experience', href: '#experience' },
  { key: 'contact', href: '#contact' },
]

export const PROJECTS: ProjectData[] = [
  {
    id: 'autoservicio',
    images: ['/projects/sistema-autoservicio.webp', '/projects/sistema-autoservicio-1.webp', '/projects/sistema-autoservicio-2.webp'],
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'TailwindCSS', 'NextAuth.js'],
    github: 'https://github.com/agustinsosa10/sistemaAutoservicio',
    featured: true,
  },
  {
    id: 'mobile',
    images: ['/projects/aplicacion-movil.webp'],
    tags: ['React Native', 'TypeScript', 'Expo', 'Supabase'],
    github: 'https://github.com/agustinsosa10/sist-mantenimiento',
  },
  {
    id: 'inventario',
    images: ['/projects/sistema-gestion.webp'],
    tags: ['Python', 'FastAPI', 'Docker'],
    github: 'https://github.com/agustinsosa10/sistema-inventario',
  },
]

// Skill names are tech names — language-agnostic, no translation needed.
export const SKILL_NAMES: Record<string, string[]> = {
  frontend: [
    'React.js / Next.js',
    'React Native',
    'TypeScript',
    'TailwindCSS',
    'HTML & CSS',
    'Prisma ORM',
    'NextAuth.js',
  ],
  backend: [
    'Python / FastAPI',
    'Node.js / Express',
    'Java',
    'REST APIs',
    'Docker / Docker Compose',
    'Postman',
    'Supabase',
  ],
  data: [
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'SQL',
    'Modelado de datos / DER',
    'Git & GitHub',
  ],
}

export const EXPERIENCE_IDS = ['dagatek']

export const EXPERIENCE_PERIODS: Record<string, string> = {
  dagatek: 'Ene. 2026 — Presente',
}

export const EDUCATION = [
  {
    id: 'ing-sistemas',
    period: '2026 — Presente',
    degreeKey: 'ingSistemas',
    institution: 'Universidad Nacional de Villa Mercedes',
    statusKey: 'inProgress',
  },
  {
    id: 'prog-universitario',
    period: '2022 — 2025',
    degreeKey: 'progUniversitario',
    institution: 'Universidad Nacional de Villa Mercedes',
    statusKey: 'graduated',
  },
]

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/agustinsosa10', iconName: 'Github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/agustin-sosa-m10', iconName: 'Linkedin' },
]

export const CONTACT_EMAIL = 'agustin.sos.m10@gmail.com'
