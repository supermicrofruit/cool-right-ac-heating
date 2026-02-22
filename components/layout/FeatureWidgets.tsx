'use client'

import { useDesignFeatures } from '@/lib/useDesignFeatures'
import StickyMobileCTA from '@/components/ui/StickyMobileCTA'
import LiveChatWidget from '@/components/ui/LiveChatWidget'

export default function FeatureWidgets() {
  const features = useDesignFeatures()

  return (
    <>
      {features.stickyPhone && <StickyMobileCTA />}
      {features.callbackWidget && <LiveChatWidget />}
    </>
  )
}
