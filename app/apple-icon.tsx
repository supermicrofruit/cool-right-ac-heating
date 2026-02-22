import { ImageResponse } from 'next/og'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import themeData from '@/data/theme.json'
import businessData from '@/data/business.json'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const themePrimaryColors: Record<string, string> = {
  'fresh-teal': '174 72% 40%',
  'ocean-blue': '210 100% 45%',
  'forest-green': '152 60% 36%',
  'sage-green': '150 30% 42%',
  'sunset-orange': '24 95% 53%',
  'royal-purple': '270 60% 50%',
  'slate-professional': '220 25% 42%',
  'warm-terracotta': '16 65% 50%',
  'midnight-navy': '222 47% 38%',
  'blue-classic': '225 88% 28%',
  'orange-classic': '15 100% 48%',
  'teal-classic': '176 100% 23%',
  'green-classic': '88 100% 25%',
  'red-classic': '0 85% 40%',
  'yellow-classic': '46 100% 50%',
  'amber-minimal': '42 100% 50%',
  'green-fall': '25 80% 35%',
}

function getPrimaryColor(): string {
  const hsl = themePrimaryColors[themeData.colors] || '174 72% 40%'
  return `hsl(${hsl})`
}

export default function AppleIcon() {
  // 1. If pipeline already generated an apple-touch-icon, serve it directly
  const applePath = (businessData as any).theme?.appleTouchIcon
  if (applePath) {
    const filePath = join(process.cwd(), 'public', applePath)
    if (existsSync(filePath)) {
      const buffer = readFileSync(filePath)
      return new Response(buffer, {
        headers: { 'Content-Type': 'image/png' },
      })
    }
  }
  // Also check default pipeline path
  const defaultApplePath = join(process.cwd(), 'public/images/apple-touch-icon.png')
  if (existsSync(defaultApplePath)) {
    const buffer = readFileSync(defaultApplePath)
    return new Response(buffer, {
      headers: { 'Content-Type': 'image/png' },
    })
  }

  // 2. No pipeline icon — generate one with first letter on accent bg
  const primaryColor = getPrimaryColor()
  const initial = businessData.name.charAt(0).toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: primaryColor,
          borderRadius: 36,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 110,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {initial}
        </span>
      </div>
    ),
    { ...size }
  )
}
