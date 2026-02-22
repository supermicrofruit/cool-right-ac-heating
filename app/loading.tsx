export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="h-8 w-32 bg-muted-foreground/10 rounded" />
          <div className="hidden lg:flex gap-6">
            <div className="h-4 w-16 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-20 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-16 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-14 bg-muted-foreground/10 rounded" />
          </div>
          <div className="h-10 w-36 bg-muted-foreground/10 rounded-lg" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="h-6 w-40 bg-primary/10 rounded-full" />
              <div className="h-10 w-full bg-muted-foreground/10 rounded" />
              <div className="h-10 w-3/4 bg-muted-foreground/10 rounded" />
              <div className="h-5 w-full bg-muted-foreground/10 rounded" />
              <div className="h-5 w-2/3 bg-muted-foreground/10 rounded" />
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-40 bg-primary/20 rounded-xl" />
                <div className="h-12 w-36 bg-muted-foreground/10 rounded-xl" />
              </div>
            </div>
            <div className="h-64 md:h-80 bg-muted-foreground/10 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-6 w-24 bg-primary/10 rounded-full mx-auto mb-4" />
            <div className="h-8 w-64 bg-muted-foreground/10 rounded mx-auto mb-3" />
            <div className="h-5 w-96 bg-muted-foreground/10 rounded mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-background rounded-2xl border border-border overflow-hidden">
                <div className="h-48 bg-muted-foreground/10" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-full bg-muted-foreground/10 rounded" />
                  <div className="h-4 w-2/3 bg-muted-foreground/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
