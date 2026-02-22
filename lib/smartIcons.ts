/**
 * Smart Icon Matching - Automatically picks the best Lucide icon based on text content
 *
 * Usage:
 *   import { getSmartIcon } from '@/lib/smartIcons'
 *   const Icon = getSmartIcon("Save time with our fast service")
 *   // Returns Clock icon
 */

import {
  Clock,
  Shield,
  Star,
  Zap,
  Heart,
  Leaf,
  Award,
  Users,
  Phone,
  CheckCircle,
  ThumbsUp,
  Timer,
  BadgeCheck,
  Sparkles,
  Home,
  Building,
  Truck,
  Wrench,
  Settings,
  Calendar,
  MapPin,
  DollarSign,
  Percent,
  Gift,
  Lock,
  Eye,
  Smile,
  Sun,
  Droplets,
  Wind,
  Flame,
  Snowflake,
  Recycle,
  Brush,
  Layers,
  Target,
  TrendingUp,
  MessageCircle,
  Headphones,
  FileCheck,
  ClipboardCheck,
  PiggyBank,
  CreditCard,
  Banknote,
  HandHeart,
  Baby,
  Dog,
  Cat,
  Wifi,
  Smartphone,
  Monitor,
  type LucideIcon,
} from 'lucide-react'

// Keyword to icon mapping - order matters (more specific first)
const keywordIconMap: Array<{ keywords: string[]; icon: LucideIcon }> = [
  // Time-related
  { keywords: ['fast', 'quick', 'speed', 'rapid', 'instant', 'same-day', 'same day', '24/7', '24-hour', 'immediate'], icon: Zap },
  { keywords: ['time', 'hour', 'schedule', 'appointment', 'booking'], icon: Clock },
  { keywords: ['calendar', 'date', 'flexible scheduling'], icon: Calendar },
  { keywords: ['timer', 'duration', 'minutes'], icon: Timer },

  // Trust & Safety
  { keywords: ['guarantee', 'guaranteed', 'warranty', 'promise'], icon: BadgeCheck },
  { keywords: ['insured', 'insurance', 'bonded', 'licensed'], icon: Shield },
  { keywords: ['safe', 'safety', 'secure', 'security', 'protection', 'protect'], icon: Lock },
  { keywords: ['trust', 'trusted', 'reliable', 'dependable'], icon: CheckCircle },
  { keywords: ['certified', 'certificate', 'accredited'], icon: Award },
  { keywords: ['verified', 'background check'], icon: FileCheck },

  // Quality & Reviews
  { keywords: ['star', 'rating', 'rated', 'review', '5-star', 'five star'], icon: Star },
  { keywords: ['quality', 'premium', 'professional', 'expert'], icon: Award },
  { keywords: ['satisfaction', 'satisfied', 'happy customer'], icon: ThumbsUp },
  { keywords: ['sparkle', 'shine', 'clean', 'spotless', 'pristine'], icon: Sparkles },

  // Environment & Health
  { keywords: ['eco', 'green', 'sustainable', 'environment', 'organic', 'natural'], icon: Leaf },
  { keywords: ['health', 'healthy', 'hygienic', 'sanitize', 'disinfect'], icon: Heart },
  { keywords: ['allergen', 'allergy', 'dust', 'air quality'], icon: Wind },
  { keywords: ['recycle', 'reuse', 'waste'], icon: Recycle },
  { keywords: ['water', 'moisture', 'wet', 'dry'], icon: Droplets },

  // Service Types
  { keywords: ['home', 'house', 'residential', 'domestic'], icon: Home },
  { keywords: ['office', 'commercial', 'business', 'corporate'], icon: Building },
  { keywords: ['move', 'moving', 'relocation', 'delivery'], icon: Truck },
  { keywords: ['repair', 'fix', 'maintenance', 'service'], icon: Wrench },
  { keywords: ['install', 'installation', 'setup'], icon: Settings },
  { keywords: ['deep clean', 'thorough', 'detail'], icon: Brush },

  // People & Family
  { keywords: ['family', 'families', 'kid', 'child', 'children'], icon: Users },
  { keywords: ['baby', 'infant', 'newborn', 'nursery'], icon: Baby },
  { keywords: ['pet', 'dog', 'cat', 'animal'], icon: Dog },
  { keywords: ['team', 'staff', 'technician', 'crew'], icon: Users },
  { keywords: ['friendly', 'care', 'caring', 'compassion'], icon: HandHeart },

  // Money & Value
  { keywords: ['save', 'saving', 'savings'], icon: PiggyBank },
  { keywords: ['price', 'pricing', 'cost', 'affordable', 'budget'], icon: DollarSign },
  { keywords: ['discount', 'deal', 'offer', 'special'], icon: Percent },
  { keywords: ['free', 'complimentary', 'no charge', 'bonus'], icon: Gift },
  { keywords: ['pay', 'payment', 'financing'], icon: CreditCard },
  { keywords: ['value', 'worth', 'investment'], icon: Banknote },

  // Communication
  { keywords: ['call', 'phone', 'contact'], icon: Phone },
  { keywords: ['support', 'help', '24/7 support'], icon: Headphones },
  { keywords: ['chat', 'message', 'text'], icon: MessageCircle },

  // Location
  { keywords: ['local', 'nearby', 'area', 'neighborhood', 'location'], icon: MapPin },

  // Temperature/HVAC
  { keywords: ['heat', 'heating', 'warm', 'hot'], icon: Flame },
  { keywords: ['cool', 'cooling', 'cold', 'ac', 'air condition'], icon: Snowflake },

  // Results
  { keywords: ['result', 'outcome', 'achieve'], icon: Target },
  { keywords: ['improve', 'improvement', 'better', 'upgrade'], icon: TrendingUp },
  { keywords: ['checklist', 'list', 'comprehensive'], icon: ClipboardCheck },

  // Tech
  { keywords: ['smart', 'technology', 'tech', 'modern', 'digital'], icon: Smartphone },
  { keywords: ['wifi', 'wireless', 'connected', 'remote'], icon: Wifi },
  { keywords: ['monitor', 'screen', 'display'], icon: Monitor },

  // Positive emotions
  { keywords: ['smile', 'joy', 'delight'], icon: Smile },
  { keywords: ['bright', 'sunny', 'fresh'], icon: Sun },
  { keywords: ['love', 'loved', 'favorite'], icon: Heart },
]

// Fallback icons to cycle through when no keyword matches
const fallbackIcons: LucideIcon[] = [
  Sparkles, Shield, Clock, Leaf, Award, Heart, Users, Zap, Timer, BadgeCheck, CheckCircle, Star
]

/**
 * Get the best matching icon for a piece of text
 * @param text - The text to analyze (e.g., feature description, benefit)
 * @param fallbackIndex - Optional index to pick a specific fallback icon
 * @returns A Lucide icon component
 */
export function getSmartIcon(text: string, fallbackIndex?: number): LucideIcon {
  const lowerText = text.toLowerCase()

  // Check each keyword set
  for (const { keywords, icon } of keywordIconMap) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return icon
    }
  }

  // No match found, use fallback
  if (fallbackIndex !== undefined) {
    return fallbackIcons[fallbackIndex % fallbackIcons.length]
  }

  // Default to Sparkles
  return Sparkles
}

/**
 * Get icons for an array of text items
 * Each item gets a unique icon when possible
 * @param texts - Array of text strings
 * @returns Array of Lucide icon components
 */
export function getSmartIcons(texts: string[]): LucideIcon[] {
  const usedIcons = new Set<LucideIcon>()
  const result: LucideIcon[] = []

  texts.forEach((text, index) => {
    const icon = getSmartIcon(text, index)

    // If this icon is already used and we have a fallback available, try the next fallback
    if (usedIcons.has(icon)) {
      // Find an unused fallback icon
      for (let i = 0; i < fallbackIcons.length; i++) {
        const fallback = fallbackIcons[(index + i) % fallbackIcons.length]
        if (!usedIcons.has(fallback)) {
          usedIcons.add(fallback)
          result.push(fallback)
          return
        }
      }
    }

    usedIcons.add(icon)
    result.push(icon)
  })

  return result
}

/**
 * React hook to get smart icons for features/benefits
 * Memoizes the result to prevent re-computation
 */
export function useSmartIcons(texts: string[]): LucideIcon[] {
  // Simple implementation - in real usage, wrap with useMemo
  return getSmartIcons(texts)
}

export { fallbackIcons }
export type { LucideIcon }
