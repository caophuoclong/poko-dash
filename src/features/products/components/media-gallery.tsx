import { useState } from 'react'
import { cn } from '#/shared/utils'

interface MediaItem {
  type: 'image' | 'video'
  url: string
}

interface MediaGalleryProps {
  coverImage?: string
  variantImages?: string[]
  videoUrl?: string
}

export default function MediaGallery({
  coverImage,
  variantImages = [],
  videoUrl,
}: MediaGalleryProps) {
  console.log(
    '🚀 ~ MediaGallery ~ coverImage, variantImages = [], videoUrl:',
    coverImage,
    (variantImages = []),
    videoUrl,
  )
  const items: MediaItem[] = []

  if (coverImage) items.push({ type: 'image', url: coverImage })
  variantImages.forEach((url) => items.push({ type: 'image', url }))
  if (videoUrl) items.push({ type: 'video', url: videoUrl })

  const [selected, setSelected] = useState(0)

  if (items.length === 0) {
    return (
      <div className="bg-surface border border-frost rounded-2xl aspect-square flex flex-col items-center justify-center text-muted-text">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="mb-3 opacity-40"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span className="text-sm">Không có hình ảnh</span>
      </div>
    )
  }

  const current = items[selected]

  return (
    <div className="space-y-3">
      <div className="bg-surface border border-frost rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
        {current?.type === 'image' ? (
          <img
            src={current.url}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = ''
              ;(e.target as HTMLImageElement).alt = 'Image not available'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-2">
            <iframe
              src={getEmbedUrl(current.url)}
              className="w-full h-full"
              allowFullScreen
              title="Product video"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue',
              selected === i
                ? 'border-accent-orange'
                : 'border-frost hover:border-frost-hover',
            )}
          >
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <polygon
                    points="6,3 17,10 6,17"
                    style={{ fill: 'var(--t-accent-blue)' }}
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function getEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  return url
}
