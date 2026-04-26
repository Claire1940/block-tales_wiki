import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  codes: { field: 'items', nameKey: 'code' },
  beginnerGuide: { field: 'steps', nameKey: 'title' },
  demo5Guide: { field: 'items', nameKey: 'title' },
  walkthrough: { field: 'chapters', nameKey: 'title' },
  cardsGuide: { field: 'items', nameKey: 'name' },
  cardTierList: { field: 'items', nameKey: 'tier' },
  bossGuide: { field: 'items', nameKey: 'name' },
  badgesGuide: { field: 'items', nameKey: 'section' },
  itemsGuide: { field: 'items', nameKey: 'item' },
  weaponsGuide: { field: 'items', nameKey: 'name' },
  statsAndLevelingGuide: { field: 'items', nameKey: 'stat_or_system' },
  enemyDropsGuide: { field: 'items', nameKey: 'farming_target' },
  locationsAndMapGuide: { field: 'items', nameKey: 'name' },
  pitOf100TrialsGuide: { field: 'items', nameKey: 'range' },
  updatesAndPatchNotes: { field: 'items', nameKey: 'release' },
  storyAndLoreRecap: { field: 'items', nameKey: 'heading' },
}

// Extra semantic keywords per module to boost matching for h2 titles
// These supplement the module title text when matching against articles
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  codes: ['active codes', 'reward', 'redeem', 'working codes', 'game page'],
  beginnerGuide: ['beginner', 'how to be good', 'first aid', 'keybinds', 'starter route'],
  demo5Guide: ['demo 5', 'chapter 5', 'release date', 'trinity', 'windforce'],
  walkthrough: ['walkthrough', 'last puzzle', 'ingredients', 'chef', 'chapter 5'],
  cardsGuide: ['cards', 'safe guard', 'hp finder', 'griefer', 'drawback', 'aggressor'],
  cardTierList: ['tier list', 'aggressor', 'safe guard', 'hp finder', 'drawback', 'baller'],
  bossGuide: ['boss', 'super boss', 'aggressor', 'converging timelines', 'griefer'],
  badgesGuide: ['badges', 'converging timelines', 'completion', 'challenge clears'],
  itemsGuide: ['items', 'shawarma', 'compost', 'first aid', 'ingredients', 'chef'],
  weaponsGuide: ['weapons', 'windforce', 'paintball gun', 'ice dagger', 'chapter 5'],
  statsAndLevelingGuide: ['stats', 'leveling', 'bp', 'sp', 'hp', 'baller build'],
  enemyDropsGuide: ['enemy drops', 'farming', 'compost', 'griefer', 'drops'],
  locationsAndMapGuide: ['locations', 'map', 'trinity', 'vermalon', 'chef', 'chapter 5'],
  pitOf100TrialsGuide: ['pit of 100 trials', 'floors', 'sewers', 'challenge', 'rewards'],
  updatesAndPatchNotes: ['updates', 'patch notes', 'demo 5', 'release date', 'upcoming content'],
  storyAndLoreRecap: ['story', 'lore', 'builderman', 'shedletsky', 'telamon', 'chapter 5'],
}

const FILLER_WORDS = ['block', 'tales', '2026', '2025', 'complete', 'the', 'and', 'for', 'how', 'with', 'our', 'this', 'your', 'all', 'from', 'learn', 'master']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (stripped of "Block Tales")
  const strippedQuery = normalizedQuery.replace(/block tales?\s*/g, '').trim()
  const strippedTitle = normalizedTitle.replace(/block tales?\s*/g, '').trim()
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 15)
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[]
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`
          linkMap[key] = findBestMatch(itemName, allArticles)
        }
      }
    }
  }

  return linkMap
}
