'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface ProjectCarouselProps {
  images: string[]
  alt: string
  sizes?: string
}

export default function ProjectCarousel({
  images,
  alt,
  sizes = '100vw',
}: ProjectCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrent((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrent((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const prevLightbox = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const nextLightbox = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const openLightbox = () => {
    setLightboxIndex(current)
    setLightbox(true)
  }

  const closeLightbox = () => setLightbox(false)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevLightbox()
      if (e.key === 'ArrowRight') nextLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prevLightbox, nextLightbox])


  const showNav = images.length > 1

  return (
    <>
      {/* Carousel */}
      <div className="relative group/carousel bg-brand-bg">
        <div
          className="relative aspect-video overflow-hidden cursor-zoom-in"
          onClick={openLightbox}
        >
          <Image
            src={images[current]}
            alt={`${alt} — ${current + 1}`}
            fill
            className="object-contain transition-opacity duration-300"
            sizes={sizes}
          />
          {/* Zoom hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-black/40 rounded-full p-2">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {showNav && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                  aria-label={`Imagen ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    i === current ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-white"
          onClick={closeLightbox}
        >
          {/* Image — full image visible, no crop */}
          <Image
            src={images[lightboxIndex]}
            alt={`${alt} — ${lightboxIndex + 1}`}
            fill
            className="object-contain pointer-events-none"
            sizes="100vw"
            quality={95}
          />

          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Cerrar"
            className="absolute z-10 top-4 right-4 text-black/50 hover:text-black transition-colors"
          >
            <X className="w-7 h-7" />
          </button>

          {/* Counter */}
          {showNav && (
            <span className="absolute z-10 top-4 left-1/2 -translate-x-1/2 text-black/40 text-sm tabular-nums">
              {lightboxIndex + 1} / {images.length}
            </span>
          )}

          {/* Lightbox nav */}
          {showNav && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox() }}
                aria-label="Anterior"
                className="absolute z-10 left-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox() }}
                aria-label="Siguiente"
                className="absolute z-10 right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
