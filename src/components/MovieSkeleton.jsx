// Placeholder animasi saat data sedang dimuat dari API (hero + 2 baris)
export default function MovieSkeleton() {
  return (
    <div aria-busy="true" aria-label="Memuat data film">
      <div className="h-[460px] w-full animate-pulse bg-chill-surface sm:h-[540px] lg:h-[min(70vh,720px)]" />
      <div className="px-4 md:px-10 lg:px-24">
        {[0, 1].map((row) => (
          <div key={row} className="mt-8">
            <div className="mb-3 h-6 w-56 animate-pulse rounded bg-chill-surface" />
            <div className="flex gap-3 overflow-hidden md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] w-[140px] shrink-0 animate-pulse rounded-lg bg-chill-surface sm:w-[160px] md:w-[190px] lg:w-[220px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
