'use client'

import { useState } from 'react'
import SectionDivider, {
  type DividerColor,
  type DividerStyle,
  getBgClass,
  getColorValue,
} from '@/components/ui/SectionDivider'

const colors: DividerColor[] = ['white', 'gray', 'primary', 'dark', 'footer']
const styles: DividerStyle[] = ['wave', 'curve', 'diagonal']

const colorLabels: Record<DividerColor, string> = {
  white: 'White',
  gray: 'Gray',
  primary: 'Primary',
  dark: 'Dark',
  footer: 'Footer',
}

const styleLabels: Record<DividerStyle, string> = {
  none: 'None',
  wave: 'Wave',
  curve: 'Curve',
  diagonal: 'Diagonal',
}

function ModeTag({ same }: { same: boolean }) {
  return (
    <span
      className={`absolute top-0 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-wider py-0.5 text-white ${
        same ? 'bg-blue-500' : 'bg-emerald-500'
      }`}
    >
      {same ? 'LINE' : 'FILL'}
    </span>
  )
}

function ConnectorCell({
  topColor,
  bottomColor,
  dividerStyle,
}: {
  topColor: DividerColor
  bottomColor: DividerColor
  dividerStyle: DividerStyle
}) {
  const same = topColor === bottomColor

  return (
    <div className="relative border border-border rounded-lg overflow-hidden">
      <ModeTag same={same} />
      {/* Top color label */}
      <div
        className={`pt-6 pb-2 text-center text-xs font-medium ${getBgClass(topColor)}`}
        style={{ color: topColor === 'dark' || topColor === 'primary' || topColor === 'footer' ? 'white' : undefined }}
      >
        {colorLabels[topColor]}
      </div>
      {/* The actual divider */}
      <SectionDivider
        topColor={topColor}
        bottomColor={bottomColor}
        style={dividerStyle}
      />
      {/* Bottom color label */}
      <div
        className={`pt-2 pb-4 text-center text-xs font-medium ${getBgClass(bottomColor)}`}
        style={{ color: bottomColor === 'dark' || bottomColor === 'primary' || bottomColor === 'footer' ? 'white' : undefined }}
      >
        {colorLabels[bottomColor]}
      </div>
    </div>
  )
}

export default function ConnectorTestPage() {
  const [activeStyle, setActiveStyle] = useState<DividerStyle>('wave')

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-2">Connector Debug Tool</h1>
        <p className="text-muted-foreground mb-8">
          Test all connector types with all background combinations. LINE = same colors, FILL = different colors.
        </p>

        {/* Style selector */}
        <div className="flex items-center gap-2 mb-8 p-4 bg-muted rounded-xl">
          <span className="text-sm font-medium mr-2">Connector:</span>
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStyle(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStyle === s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-muted-foreground/10'
              }`}
            >
              {styleLabels[s]}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded bg-blue-500" />
            <span>LINE mode (same colors)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded bg-emerald-500" />
            <span>FILL mode (different colors)</span>
          </div>
        </div>

        <h2 className="text-xl font-heading font-semibold mb-4">
          All Combinations Matrix
          <span className="text-muted-foreground text-sm font-normal ml-2">
            ({colors.length} × {colors.length} = {colors.length * colors.length} combinations)
          </span>
        </h2>

        {/* Matrix header */}
        <div className="grid grid-cols-6 gap-3 mb-2">
          <div className="text-xs text-muted-foreground pt-2">
            Top ↓ /<br />Bottom →
          </div>
          {colors.map((c) => (
            <div key={c} className="text-center text-sm font-semibold">
              {colorLabels[c]}
            </div>
          ))}
        </div>

        {/* Matrix rows */}
        {colors.map((topColor) => (
          <div key={topColor} className="grid grid-cols-6 gap-3 mb-3">
            <div className="flex items-center text-sm font-semibold">
              {colorLabels[topColor]}
            </div>
            {colors.map((bottomColor) => (
              <ConnectorCell
                key={`${topColor}-${bottomColor}`}
                topColor={topColor}
                bottomColor={bottomColor}
                dividerStyle={activeStyle}
              />
            ))}
          </div>
        ))}

        {/* All styles comparison */}
        <h2 className="text-xl font-heading font-semibold mt-12 mb-4">
          Style Comparison (White → Gray)
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {styles.map((s) => (
            <div key={s}>
              <h3 className="text-sm font-medium mb-2 text-center">{styleLabels[s]}</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className={`py-6 text-center text-xs ${getBgClass('white')}`}>White</div>
                <SectionDivider topColor="white" bottomColor="gray" style={s} />
                <div className={`py-6 text-center text-xs ${getBgClass('gray')}`}>Gray</div>
              </div>
            </div>
          ))}
        </div>

        {/* Same-color LINE mode comparison */}
        <h2 className="text-xl font-heading font-semibold mt-12 mb-4">
          LINE Mode Comparison (White → White)
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {styles.map((s) => (
            <div key={s}>
              <h3 className="text-sm font-medium mb-2 text-center">{styleLabels[s]}</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className={`py-6 text-center text-xs ${getBgClass('white')}`}>White</div>
                <SectionDivider topColor="white" bottomColor="white" style={s} />
                <div className={`py-6 text-center text-xs ${getBgClass('white')}`}>White</div>
              </div>
            </div>
          ))}
        </div>

        {/* Primary transitions */}
        <h2 className="text-xl font-heading font-semibold mt-12 mb-4">
          Primary Color Transitions
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {styles.map((s) => (
            <div key={s}>
              <h3 className="text-sm font-medium mb-2 text-center">{styleLabels[s]}: White → Primary</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className={`py-6 text-center text-xs ${getBgClass('white')}`}>White</div>
                <SectionDivider topColor="white" bottomColor="primary" style={s} />
                <div className={`py-6 text-center text-xs text-white ${getBgClass('primary')}`}>Primary</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
