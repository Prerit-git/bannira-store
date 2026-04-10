"use client";

export default function ProductSkeleton() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-21 md:pt-40 pb-32 animate-pulse">
      <div className="max-w-360 mx-auto px-4 md:px-8">
        {/* Back Button Skeleton */}
        <div className="h-4 w-32 bg-stone-200 rounded mb-6 hidden md:block" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-16">
          {/* Left: Images Skeleton */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 aspect-[3/4] bg-stone-200 rounded-sm" />
              ))}
            </div>
            <div className="w-full md:flex-1 aspect-[4/5] md:aspect-[3/4] bg-stone-200 rounded-sm" />
          </div>

          {/* Right: Info Skeleton */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-2xl space-y-6">
              <div className="h-3 w-20 bg-stone-200 rounded" />
              <div className="h-10 w-3/4 bg-stone-200 rounded" />
              <div className="h-8 w-1/4 bg-stone-200 rounded" />
              
              <div className="space-y-4 pt-6">
                <div className="h-3 w-24 bg-stone-200 rounded" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-14 h-14 bg-stone-100 rounded-xl" />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-10">
                <div className="h-16 w-full bg-stone-200 rounded-xl" />
                <div className="h-16 w-full bg-stone-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}