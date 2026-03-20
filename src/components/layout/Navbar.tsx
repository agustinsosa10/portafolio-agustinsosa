'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NAV_HREFS } from '@/lib/constants'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const tSite = useTranslations('site')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => setIsMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-bg/95 backdrop-blur-md border-b border-brand-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a
            href="#"
            className="font-display text-xl font-semibold text-brand-text tracking-tight"
          >
            {tSite('name')}
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_HREFS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm text-brand-body font-medium transition-colors duration-200 hover:text-brand-accent"
                >
                  {t(link.key as Parameters<typeof t>[0])}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-5">
            <LanguageSwitcher />
            <a href="#contact" className="btn-primary text-sm">
              {t('cta')}
            </a>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-10 h-10 text-brand-body hover:text-brand-accent transition-colors duration-200"
              aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 border-t border-brand-border pt-4 space-y-1">
            {NAV_HREFS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="block px-4 py-3 text-sm text-brand-body font-medium transition-colors duration-200 hover:text-brand-accent"
              >
                {t(link.key as Parameters<typeof t>[0])}
              </a>
            ))}
            <div className="pt-3 px-4">
              <a
                href="#contact"
                onClick={handleNavClick}
                className="btn-primary w-full text-center text-sm"
              >
                {t('cta')}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
