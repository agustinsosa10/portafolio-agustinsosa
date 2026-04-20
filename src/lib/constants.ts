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
    id: 'ies',
    images: ['/projects/ies-desarrollos-1.png', '/projects/ies-desarrollos-2.png', '/projects/ies-desarrollos-3.png'],
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'Sanity CMS', 'Vercel'],
    featured: true,
  },
  {
    id: 'saas',
    images: ['/projects/saas-1.png', '/projects/saas-2.png', '/projects/saas-3.png', '/projects/saas-4.png'],
    tags: ['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker', 'Claude Code'],
  },
  {
    id: 'autoservicio',
    images: ['/projects/sistema-autoservicio.webp', '/projects/sistema-autoservicio-1.webp', '/projects/sistema-autoservicio-2.webp'],
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth.js', 'TailwindCSS'],
    github: 'https://github.com/agustinsosa10/sistemaAutoservicio',
  },
]

// Skill names are tech names — language-agnostic, no translation needed.
export const SKILL_NAMES: Record<string, string[]> = {
  frontend: [
    'React.js / Next.js',
    'React Native',
    'TypeScript',
    'TailwindCSS',
    'HTML5 & CSS3',
    'NextAuth.js',
    'Responsive Design'
  ],
  backend: [
    'Python / FastAPI',
    'Node.js / Express',
    'Java',
    'REST APIs',
    'Docker / Docker Compose',
    'Postman',
    'Supabase',
    'Sanity CMS',
    'Prisma ORM',
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
