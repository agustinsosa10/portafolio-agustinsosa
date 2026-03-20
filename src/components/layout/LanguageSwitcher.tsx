'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-brand-border">·</span>}
          <button
            onClick={() => router.replace(pathname, { locale: l })}
            className={`transition-colors duration-200 ${
              locale === l
                ? 'text-brand-accent'
                : 'text-brand-muted hover:text-brand-body'
            }`}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
