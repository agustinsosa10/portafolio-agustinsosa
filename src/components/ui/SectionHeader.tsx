interface SectionHeaderProps {
  label: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
}: SectionHeaderProps) {
  return (
    <div className={centered ? 'text-center' : ''}>
      <p className="section-label">{label}</p>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      <hr className="border-brand-border mt-6 mb-0 max-w-[80px]" style={centered ? { margin: '1.5rem auto 0' } : undefined} />
    </div>
  )
}
