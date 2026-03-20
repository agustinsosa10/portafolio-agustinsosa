export interface NavLink {
  label: string
  href: string
}

export interface Project {
  id: string
  title: string
  description: string
  images: string[]
  tags: string[]
  github?: string
  live?: string
  featured?: boolean
}

export interface SkillCategory {
  title: string
  skills: string[]
}

export interface Experience {
  id: string
  period: string
  role: string
  company: string
  description: string
  highlights: string[]
}

export interface SocialLink {
  label: string
  href: string
  iconName: string
}

export interface SiteConfig {
  name: string
  title: string
  description: string
  email: string
  role: string
  tagline: string
}
