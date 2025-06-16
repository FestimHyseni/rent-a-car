const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-10 bg-slate-700 rounded-md w-1/3 mx-auto mb-3"></div>
        <div className="h-4 bg-slate-700 rounded-md w-1/2 mx-auto"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-700 rounded-md w-2/3 mx-auto mb-4"></div>
              <div className="h-4 bg-slate-700 rounded-full w-1/3 mx-auto"></div>
              <div className="mt-4 h-4 bg-slate-700 rounded-md w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Profile Details Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-slate-700 rounded-md w-48"></div>
              <div className="h-10 bg-slate-700 rounded-lg w-24"></div>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-700 rounded-lg w-full"></div>
                </div>
                {/* Input Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-700 rounded-lg w-full"></div>
                </div>
                {/* Input Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-700 rounded-lg w-full"></div>
                </div>
                {/* Input Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-700 rounded-lg w-full"></div>
                </div>
                {/* Input Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-700 rounded-lg w-full"></div>
                </div>
              </div>
              {/* Text Area Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded-md w-1/5"></div>
                <div className="h-24 bg-slate-700 rounded-lg w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default ProfilePageSkeleton;
