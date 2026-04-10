"use client";

export default function ProductsSkeleton() {
  return (
    <div className="bg-[#faf9f6] min-h-screen pt-35 md:pt-40 pb-24 animate-pulse">
      <div className="max-w-400 mx-auto px-6 mb-8 flex justify-between items-center">
        {/* Title Shimmer */}
        <div className="h-8 w-48 bg-stone-200 rounded-lg" />
        {/* Desktop Sort Shimmer */}
        <div className="hidden md:flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 bg-stone-100 rounded-full" />
          ))}
        </div>
      </div>

      <div className="max-w-400 mx-auto px-4 md:px-6 flex gap-10">
        {/* Sidebar Skeleton */}
        <aside className="w-72 hidden md:block space-y-8">
          <div className="h-12 w-full bg-stone-200 rounded-xl" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-24 bg-stone-200 rounded" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-8 w-16 bg-stone-100 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Grid Skeleton */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-[3/4] bg-stone-200" />
              <div className="p-5 space-y-3">
                <div className="h-2 w-12 bg-stone-100 rounded" />
                <div className="h-4 w-full bg-stone-200 rounded" />
                <div className="h-4 w-20 bg-stone-200 rounded" />
                <div className="h-10 w-full bg-stone-100 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}