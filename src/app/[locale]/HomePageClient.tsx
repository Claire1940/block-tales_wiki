'use client'

import { useEffect, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Gamepad2,
  Gem,
  Map,
  Newspaper,
  Package,
  ScrollText,
  Shield,
  ShoppingBag,
  Sparkles,
  Star,
  Swords,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'
import enMessages from '@/locales/en.json'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, locale }: HomePageClientProps) {
  const localeMessages = useMessages() as any
  const homepageMessages = enMessages as any
  const t = {
    ...localeMessages,
    hero: homepageMessages.hero,
    gameFeature: homepageMessages.gameFeature,
    tools: homepageMessages.tools,
    modules: homepageMessages.modules,
    faq: homepageMessages.faq,
    cta: homepageMessages.cta,
    footer: homepageMessages.footer,
  }

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const locationIcons = [Map, Gamepad2, Shield, Sparkles, Clock, BookOpen, Swords, Star]
  const pitIcons = [Trophy, Shield, Swords, Package, Gem, BarChart3, Star]
  const updateIcons = [Newspaper, Clock, TrendingUp, Sparkles, Package, ClipboardCheck]
  const loreIcons = [ScrollText, BookOpen, Shield, Swords, Clock, Map, Star, Trophy]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('beginner-guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-background rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/16483433878/Block-Tales"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="kXBP1QeLw3w"
              title="Block Tales - Demo 5 Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* Tools Grid - Module Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="#codes"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('codes')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[0].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <ClipboardCheck className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>

            <a
              href="#beginner-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('beginner-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[1].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <BookOpen className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>

            <a
              href="#demo-5-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('demo-5-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[2].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Clock className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>

            <a
              href="#walkthrough"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('walkthrough')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[3].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <ArrowRight className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>

            <a
              href="#cards-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('cards-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[4].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Package className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>

            <a
              href="#card-tier-list"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('card-tier-list')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[5].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <TrendingUp className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>

            <a
              href="#boss-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('boss-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[6].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Shield className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>

            <a
              href="#badges-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('badges-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[7].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Star className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>

            <a
              href="#items-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('items-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[8].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <ShoppingBag className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[8].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[8].description}</p>
            </a>

            <a
              href="#weapons-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('weapons-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[9].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Swords className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[9].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[9].description}</p>
            </a>

            <a
              href="#stats-and-leveling-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('stats-and-leveling-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[10].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <BarChart3 className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[10].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[10].description}</p>
            </a>

            <a
              href="#enemy-drops-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('enemy-drops-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[11].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Gem className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[11].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[11].description}</p>
            </a>

            <a
              href="#locations-and-map-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('locations-and-map-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[12].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Map className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[12].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[12].description}</p>
            </a>

            <a
              href="#pit-of-100-trials-guide"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('pit-of-100-trials-guide')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[13].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Trophy className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[13].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[13].description}</p>
            </a>

            <a
              href="#updates-and-patch-notes"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('updates-and-patch-notes')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[14].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <Newspaper className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[14].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[14].description}</p>
            </a>

            <a
              href="#story-and-lore-recap"
              onClick={(event) => {
                event.preventDefault()
                scrollToSection('story-and-lore-recap')
              }}
              className="scroll-reveal group p-6 rounded-lg border border-border
                         bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                         transition-all duration-300 text-left
                         hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--nav-theme))]"
              aria-label={`Jump to ${t.tools.cards[15].title}`}
            >
              <div className="w-12 h-12 rounded-lg mb-4
                              bg-[hsl(var(--nav-theme)/0.1)]
                              flex items-center justify-center
                              group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                              transition-colors">
                <ScrollText className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="font-semibold mb-2">{t.tools.cards[15].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[15].description}</p>
            </a>
          </div>
        </div>
      </section>

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Block Tales Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.codes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.codes.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.codes.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.codes.intro}
            </p>
          </div>

          <div className="scroll-reveal p-6 md:p-8 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.35)] rounded-lg mb-6">
            <div className="flex flex-col md:flex-row md:items-start gap-5">
              <div className="w-12 h-12 rounded-lg bg-[hsl(var(--nav-theme)/0.16)] flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="w-6 h-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold">{t.modules.codes.statusCard.code}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-background border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]">
                    {t.modules.codes.statusCard.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">{t.modules.codes.statusCard.reward}</p>
                <p className="text-sm text-muted-foreground">{t.modules.codes.statusCard.howToUse}</p>
              </div>
            </div>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.codes.items.map((item: any, index: number) => (
              <div key={item.code} className="p-5 bg-white/5 border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="font-bold mb-2">{item.code}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.reward}</p>
                <p className="text-sm text-muted-foreground border-t border-border pt-4">{item.howToUse}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Block Tales Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.beginnerGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.beginnerGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.beginnerGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.beginnerGuide.steps.map((step: any, index: number) => (
              <div key={step.title} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">Step {index + 1}</p>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                </div>
                <p className="text-sm font-medium mb-3">{step.goal}</p>
                <p className="text-sm text-muted-foreground mb-4">{step.details}</p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground border-t border-border pt-4">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span>{step.beginnerTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Block Tales Demo 5 Guide */}
      <section id="demo-5-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.demo5Guide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.demo5Guide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.demo5Guide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.demo5Guide.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.demo5Guide.items.map((entry: any) => (
              <div key={entry.title} className="relative">
                <div className="absolute -left-[1.45rem] top-2 w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-6 bg-white/5 border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs text-[hsl(var(--nav-theme-light))] mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {entry.date}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{entry.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {entry.highlights.map((highlight: string) => (
                      <div key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 4: Block Tales Walkthrough */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Gamepad2 className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.walkthrough.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.walkthrough.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.walkthrough.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.walkthrough.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-5">
            {t.modules.walkthrough.chapters.map((chapter: any, index: number) => (
              <div key={chapter.chapter} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-1">{chapter.chapter}</p>
                    <h3 className="text-2xl font-bold mb-2">{chapter.title}</h3>
                    <p className="text-sm text-muted-foreground">{chapter.mainObjective}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                  <div className="p-4 rounded-lg bg-white/5 border border-border">
                    <h4 className="font-semibold mb-3">Key Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {chapter.keyAreas.map((area: string) => (
                        <span key={area} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-border">
                    <h4 className="font-semibold mb-3">Key Unlocks</h4>
                    <div className="space-y-2">
                      {chapter.keyUnlocks.map((unlock: string) => (
                        <div key={unlock} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{unlock}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white/5 border border-border">
                    <h4 className="font-semibold mb-3">Major Fights</h4>
                    <div className="space-y-2">
                      {chapter.majorFights.map((fight: string) => (
                        <div key={fight} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{fight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span>{chapter.routeTip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Block Tales Cards Guide */}
      <section id="cards-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Package className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.cardsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.cardsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.cardsGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.cardsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.modules.cardsGuide.items.map((card: any) => (
              <div key={card.name} className="p-5 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {card.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{card.bp_cost}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{card.name}</h3>
                <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-4">{card.type}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">SP Cost</p>
                    <p className="text-sm font-medium">{card.activation_cost}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">Stacking</p>
                    <p className="text-sm font-medium">{card.stacking}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{card.combat_role}</p>
                <div className="flex items-start gap-2 text-sm text-muted-foreground border-t border-border pt-4 mb-4">
                  <BookOpen className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span>{card.how_to_get}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Block Tales Card Tier List */}
      <section id="card-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.cardTierList.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.cardTierList.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.cardTierList.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.cardTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {t.modules.cardTierList.items.map((tier: any) => (
              <div key={tier.tier} className="p-5 md:p-6 bg-card border border-border rounded-lg">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs text-[hsl(var(--nav-theme-light))] mb-3">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {tier.tier}
                    </div>
                    <p className="text-sm text-muted-foreground max-w-3xl">{tier.summary}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                  {tier.cards.map((card: any) => (
                    <div key={card.name} className="p-4 rounded-lg bg-white/5 border border-border hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h3 className="font-bold">{card.name}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                          {card.bp_cost}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-3">{card.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">{card.why_it_ranks_here}</p>
                      <div className="flex flex-wrap gap-2">
                        {card.best_for.map((useCase: string) => (
                          <span key={useCase} className="text-xs px-2 py-1 rounded-full bg-background border border-border text-muted-foreground">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Block Tales Boss Guide */}
      <section id="boss-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.bossGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.bossGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.bossGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.bossGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-5">
            {t.modules.bossGuide.items.map((boss: any) => (
              <div key={boss.name} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-1">{boss.chapter}</p>
                    <h3 className="text-2xl font-bold mb-2">{boss.name}</h3>
                    <p className="text-sm text-muted-foreground">{boss.location}</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] w-fit">
                    {boss.type}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {boss.stats.map((stat: any) => (
                    <span key={`${boss.name}-${stat.label}`} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                      <span className="text-foreground">{stat.label}:</span> {stat.value}
                    </span>
                  ))}
                </div>

                <div className="mb-5">
                  <h4 className="font-semibold mb-3">Core Mechanics</h4>
                  <div className="space-y-2">
                    {boss.core_mechanics.map((mechanic: string) => (
                      <div key={mechanic} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{mechanic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="font-semibold mb-3">Recommended Cards</h4>
                  <div className="flex flex-wrap gap-2">
                    {boss.recommended_cards.map((card: string) => (
                      <span key={`${boss.name}-${card}`} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-muted-foreground">
                        {card}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span>{boss.strategy_focus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Block Tales Badges Guide */}
      <section id="badges-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.badgesGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.badgesGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.badgesGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.badgesGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.badgesGuide.items.map((group: any) => (
              <details key={group.section} className="group bg-card border border-border rounded-lg overflow-hidden">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 hover:bg-white/5 transition-colors">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{group.section}</h3>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                  <ArrowRight className="summary-icon w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-border p-5">
                  <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5">
                        <tr className="text-left">
                          <th className="p-3 font-semibold">Badge</th>
                          <th className="p-3 font-semibold">Unlock</th>
                          <th className="p-3 font-semibold">Obtainable</th>
                          <th className="p-3 font-semibold">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.badges.map((badge: any) => (
                          <tr key={badge.name} className="border-t border-border">
                            <td className="p-3 font-medium">{badge.name}</td>
                            <td className="p-3 text-muted-foreground">{badge.unlock}</td>
                            <td className="p-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                                {badge.obtainable}
                              </span>
                            </td>
                            <td className="p-3 text-muted-foreground">{badge.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {group.badges.map((badge: any) => (
                      <div key={badge.name} className="p-4 rounded-lg bg-white/5 border border-border">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="font-semibold">{badge.name}</h4>
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] flex-shrink-0">
                            {badge.obtainable}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{badge.unlock}</p>
                        <p className="text-xs text-muted-foreground border-t border-border pt-3">{badge.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Block Tales Items Guide */}
      <section id="items-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ShoppingBag className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.itemsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.itemsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.itemsGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.itemsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal hidden lg:block overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Effect</th>
                  <th className="p-4 font-semibold">Obtainment</th>
                  <th className="p-4 font-semibold">Best Use</th>
                  <th className="p-4 font-semibold">Keep or Spend</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.itemsGuide.items.map((item: any) => (
                  <tr key={item.item} className="border-t border-border align-top">
                    <td className="p-4 font-semibold text-[hsl(var(--nav-theme-light))]">{item.item}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.effect}</td>
                    <td className="p-4 text-muted-foreground">{item.obtainment}</td>
                    <td className="p-4 text-muted-foreground">{item.best_use}</td>
                    <td className="p-4 text-muted-foreground">{item.keep_or_spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal lg:hidden grid grid-cols-1 gap-4">
            {t.modules.itemsGuide.items.map((item: any) => (
              <div key={item.item} className="p-5 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <h3 className="text-xl font-bold">{item.item}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.effect}</p>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Obtainment</p>
                    <p className="text-muted-foreground">{item.obtainment}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Best Use</p>
                    <p className="text-muted-foreground">{item.best_use}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Keep or Spend</p>
                    <p className="text-muted-foreground">{item.keep_or_spend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Block Tales Weapons Guide */}
      <section id="weapons-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.weaponsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.weaponsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.weaponsGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.weaponsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.weaponsGuide.items.map((weapon: any) => (
              <div key={weapon.name} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-1">{weapon.slot}</p>
                    <h3 className="text-2xl font-bold mb-2">{weapon.name}</h3>
                    <p className="text-sm text-muted-foreground">{weapon.type}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center flex-shrink-0">
                    <Swords className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-5">{weapon.effect}</p>

                <div className="grid grid-cols-1 gap-3 mb-5">
                  <div className="p-4 rounded-lg bg-white/5 border border-border">
                    <h4 className="text-sm font-semibold mb-2">Obtainment</h4>
                    <p className="text-sm text-muted-foreground">{weapon.obtainment}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-border">
                    <h4 className="text-sm font-semibold mb-2">Best Use</h4>
                    <p className="text-sm text-muted-foreground">{weapon.best_use}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                  <span>{weapon.caution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Block Tales Stats and Leveling Guide */}
      <section id="stats-and-leveling-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <BarChart3 className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.statsAndLevelingGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.statsAndLevelingGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.statsAndLevelingGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.statsAndLevelingGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal hidden lg:block overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-4 font-semibold">Stat or System</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Level-Up Change</th>
                  <th className="p-4 font-semibold">Cap or Start</th>
                  <th className="p-4 font-semibold">Recovery or Respec</th>
                  <th className="p-4 font-semibold">Build Advice</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.statsAndLevelingGuide.items.map((stat: any) => (
                  <tr key={stat.stat_or_system} className="border-t border-border align-top">
                    <td className="p-4 font-semibold text-[hsl(var(--nav-theme-light))]">{stat.stat_or_system}</td>
                    <td className="p-4 text-muted-foreground">{stat.role}</td>
                    <td className="p-4 text-muted-foreground">{stat.level_up_change}</td>
                    <td className="p-4 text-muted-foreground">{stat.cap_or_start}</td>
                    <td className="p-4 text-muted-foreground">{stat.recovery_or_respec}</td>
                    <td className="p-4 text-muted-foreground">{stat.build_advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="scroll-reveal lg:hidden grid grid-cols-1 gap-4">
            {t.modules.statsAndLevelingGuide.items.map((stat: any) => (
              <div key={stat.stat_or_system} className="p-5 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{stat.stat_or_system}</h3>
                    <p className="text-sm text-muted-foreground">{stat.role}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Level-Up Change</p>
                    <p className="text-muted-foreground">{stat.level_up_change}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Cap or Start</p>
                    <p className="text-muted-foreground">{stat.cap_or_start}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-border">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Recovery or Respec</p>
                    <p className="text-muted-foreground">{stat.recovery_or_respec}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)]">
                    <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Build Advice</p>
                    <p className="text-muted-foreground">{stat.build_advice}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Block Tales Enemy Drops Guide */}
      <section id="enemy-drops-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Gem className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.enemyDropsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.enemyDropsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.enemyDropsGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.enemyDropsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.enemyDropsGuide.items.map((drop: any) => (
              <details key={drop.farming_target} className="group bg-card border border-border rounded-lg overflow-hidden">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 hover:bg-white/5 transition-colors">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {drop.chapter_or_area}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{drop.farming_target}</h3>
                    <p className="text-sm text-muted-foreground">{drop.best_for}</p>
                  </div>
                  <ArrowRight className="summary-icon w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="border-t border-border p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-border">
                      <h4 className="font-semibold mb-3">Notable Drops</h4>
                      <p className="text-sm text-muted-foreground">{drop.notable_drops}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <h4 className="font-semibold mb-3">Farm Note</h4>
                      <p className="text-sm text-muted-foreground">{drop.farm_note}</p>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Block Tales Locations and Map Guide */}
      <section id="locations-and-map-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Map className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.locationsAndMapGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.locationsAndMapGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.locationsAndMapGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.locationsAndMapGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-5">
            {t.modules.locationsAndMapGuide.items.map((region: any, index: number) => {
              const LocationIcon = locationIcons[index % locationIcons.length]

              return (
                <div key={region.name} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <p className="text-sm text-[hsl(var(--nav-theme-light))] mb-1">{region.chapter}</p>
                      <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                      <p className="text-sm text-muted-foreground">{region.region_type}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center flex-shrink-0">
                      <LocationIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] mb-5">
                    <h4 className="text-sm font-semibold mb-2">How to Access</h4>
                    <p className="text-sm text-muted-foreground">{region.how_to_access}</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">Main Uses</h4>
                      <div className="space-y-2">
                        {region.main_uses.map((use: string) => (
                          <div key={`${region.name}-${use}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span>{use}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Connected Routes</h4>
                      <div className="flex flex-wrap gap-2">
                        {region.connected_routes.map((route: string) => (
                          <span key={`${region.name}-${route}`} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 14: Block Tales Pit of 100 Trials Guide */}
      <section id="pit-of-100-trials-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Trophy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.pitOf100TrialsGuide.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.pitOf100TrialsGuide.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.pitOf100TrialsGuide.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.pitOf100TrialsGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.pitOf100TrialsGuide.items.map((floor: any, index: number) => {
              const PitIcon = pitIcons[index % pitIcons.length]

              return (
                <div key={floor.range} className="relative">
                  <div className="absolute -left-[1.55rem] top-6 w-5 h-5 rounded-full bg-background border-2 border-[hsl(var(--nav-theme))] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--nav-theme))]" />
                  </div>
                  <div className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                      <div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs text-[hsl(var(--nav-theme-light))] mb-3">
                          <PitIcon className="w-3.5 h-3.5" />
                          {floor.range}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{floor.theme}</h3>
                        <p className="text-sm text-muted-foreground">{floor.safe_floor_reward}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)] min-w-32">
                        <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">Base TIX</p>
                        <p className="text-lg font-bold">{floor.base_tix}</p>
                      </div>
                    </div>

                    {floor.enemy_focus.length > 0 && (
                      <div className="mb-5">
                        <h4 className="font-semibold mb-3">Enemy Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {floor.enemy_focus.map((enemy: string) => (
                            <span key={`${floor.range}-${enemy}`} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                              {enemy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3">Recommended Prep</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {floor.recommended_prep.map((prep: string) => (
                          <div key={`${floor.range}-${prep}`} className="flex items-start gap-2 p-3 rounded-lg bg-white/5 border border-border text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                            <span>{prep}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 15: Block Tales Updates and Patch Notes */}
      <section id="updates-and-patch-notes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Newspaper className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.updatesAndPatchNotes.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.updatesAndPatchNotes.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.updatesAndPatchNotes.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.updatesAndPatchNotes.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-5">
            {t.modules.updatesAndPatchNotes.items.map((update: any, index: number) => {
              const UpdateIcon = updateIcons[index % updateIcons.length]

              return (
                <div key={`${update.date}-${update.release}`} className="p-6 bg-card border border-border rounded-lg hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs text-[hsl(var(--nav-theme-light))] mb-3">
                        <UpdateIcon className="w-3.5 h-3.5" />
                        {update.date}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{update.release}</h3>
                      <p className="text-sm text-muted-foreground">{update.type}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <h4 className="font-semibold mb-3">Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {update.highlights.map((highlight: string) => (
                        <div key={`${update.release}-${highlight}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(update.story_changes.length > 0 || update.balance_changes.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {update.story_changes.length > 0 && (
                        <div className="p-4 rounded-lg bg-white/5 border border-border">
                          <h4 className="font-semibold mb-3">Story Changes</h4>
                          <div className="space-y-2">
                            {update.story_changes.map((change: string) => (
                              <div key={`${update.release}-${change}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <ScrollText className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                <span>{change}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {update.balance_changes.length > 0 && (
                        <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)]">
                          <h4 className="font-semibold mb-3">Balance Changes</h4>
                          <div className="space-y-2">
                            {update.balance_changes.map((change: string) => (
                              <div key={`${update.release}-${change}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <BarChart3 className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                <span>{change}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 16: Block Tales Story and Lore Recap */}
      <section id="story-and-lore-recap" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ScrollText className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.modules.storyAndLoreRecap.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.modules.storyAndLoreRecap.title}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.storyAndLoreRecap.subtitle}
            </p>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.modules.storyAndLoreRecap.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.storyAndLoreRecap.items.map((chapter: any, index: number) => {
              const LoreIcon = loreIcons[index % loreIcons.length]

              return (
                <details key={chapter.heading} className="group bg-card border border-border rounded-lg overflow-hidden">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center flex-shrink-0">
                        <LoreIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{chapter.heading}</h3>
                        <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                      </div>
                    </div>
                    <ArrowRight className="summary-icon w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-3 flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>

                  <div className="border-t border-border p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-border">
                        <h4 className="font-semibold mb-3">Key Characters</h4>
                        <div className="flex flex-wrap gap-2">
                          {chapter.key_characters.map((character: string) => (
                            <span key={`${chapter.heading}-${character}`} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                              {character}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-white/5 border border-border">
                        <h4 className="font-semibold mb-3">Key Locations</h4>
                        <div className="flex flex-wrap gap-2">
                          {chapter.key_locations.map((location: string) => (
                            <span key={`${chapter.heading}-${location}`} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <h4 className="font-semibold mb-3">Sword Reward</h4>
                        <p className="text-sm text-muted-foreground">{chapter.sword_reward}</p>
                      </div>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 7 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/blocktales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/BlocktalesDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/blocktales/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/33912612/Spaceman-Moonbase"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/16483433878/Block-Tales"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal route text only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t.footer.about}</li>
                <li>{t.footer.privacy}</li>
                <li>{t.footer.terms}</li>
                <li>{t.footer.copyrightNotice}</li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
