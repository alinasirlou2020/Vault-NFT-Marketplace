export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden glass border border-white/5 aspect-[3/4] flex flex-col">
      <div className="flex-1 w-full shimmer" />
      <div className="p-4 flex flex-col gap-3 border-t border-white/5 bg-black/20 h-[120px]">
        <div className="w-2/3 h-5 rounded shimmer" />
        <div className="w-1/2 h-4 rounded shimmer opacity-70" />
        <div className="mt-auto flex justify-between items-end">
          <div className="w-1/3 h-6 rounded shimmer" />
          <div className="w-1/4 h-4 rounded shimmer opacity-70" />
        </div>
      </div>
    </div>
  )
}
