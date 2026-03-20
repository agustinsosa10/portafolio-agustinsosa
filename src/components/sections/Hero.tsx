'use client'

import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const tSite = useTranslations('site')
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative bg-brand-bg">
      <div className="section-container text-center">
        <p
          className={`section-label mb-6 transition-all duration-700 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {t('overline')}
        </p>

        <h1
          className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-brand-text leading-[0.9] tracking-tight mb-8 transition-all duration-700 delay-150 ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {tSite('name')}
        </h1>

        <div
          className={`flex justify-center mb-8 transition-all duration-700 delay-300 ${
            revealed ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        >
          <hr className="border-brand-accent w-24" />
        </div>

        <p
          className={`text-brand-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-700 delay-[450ms] ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {tSite('tagline')}
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-[600ms] ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a href="#projects" className="btn-primary">
            {t('cta1')}
          </a>
          <a href="#contact" className="btn-outline">
            {t('cta2')}
          </a>
        </div>
      </div>

      <a
        href="#about"
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-muted hover:text-brand-accent transition-all duration-700 delay-[800ms] ${
          revealed ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label={t('scrollLabel')}
      >
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  )
}
