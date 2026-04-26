import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://block-tales.wiki').replace(/\/$/, '')
  const heroImageUrl = new URL('/images/hero.webp', siteUrl).toString()
  const logoUrl = new URL('/android-chrome-512x512.png', siteUrl).toString()

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Block Tales Wiki",
        "description": "Block Tales Wiki helps Roblox players with chapter walkthroughs, cards, bosses, BUX locations, badges, items, and update guides.",
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 1920,
          "height": 1080,
          "caption": "Block Tales Wiki - Retro Roblox RPG Guide"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Block Tales Wiki",
        "alternateName": "Block Tales",
        "url": siteUrl,
        "description": "Unofficial Block Tales Wiki resource hub for Roblox RPG chapters, cards, bosses, items, badges, BUX routes, and updates.",
        "logo": {
          "@type": "ImageObject",
          "url": logoUrl,
          "width": 512,
          "height": 512
        },
        "image": {
          "@type": "ImageObject",
          "url": heroImageUrl,
          "width": 1920,
          "height": 1080,
          "caption": "Block Tales Wiki - Retro Roblox RPG Guide"
        },
        "sameAs": [
          'https://www.roblox.com/games/16483433878/Block-Tales',
          'https://www.roblox.com/communities/33912612/Spaceman-Moonbase',
          'https://discord.gg/blocktales',
          'https://x.com/BlocktalesDev',
          'https://www.reddit.com/r/blocktales/',
          'https://www.youtube.com/watch?v=kXBP1QeLw3w'
        ]
      },
      {
        "@type": "VideoGame",
        "name": "Block Tales",
        "gamePlatform": ['Roblox'],
        "applicationCategory": "Game",
        "genre": ['RPG', 'Turn-Based', 'Adventure', 'Roblox'],
        "numberOfPlayers": {
          "minValue": 1,
          "maxValue": 50
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": "https://www.roblox.com/games/16483433878/Block-Tales"
        }
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient latestArticles={latestArticles} moduleLinkMap={moduleLinkMap} locale={locale} />
    </>
  )
}
