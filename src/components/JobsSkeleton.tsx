// Placeholder shaped like the Jobs "editor window" (see Jobs.tsx): title bar,
// file-explorer sidebar, and detail pane. Matches the window footprint so real
// data swaps in without layout shift.
export default function JobsSkeleton() {
  return (
    <div
      className="glass-surface rounded-lg overflow-hidden flex flex-col h-[calc(var(--vh,1vh)*86)] md:h-[calc(var(--vh,1vh)*76)]"
      style={{ maxHeight: '620px' }}
      aria-hidden="true"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white/10" />
          <span className="w-3 h-3 rounded-full bg-white/10" />
          <span className="w-3 h-3 rounded-full bg-white/10" />
        </div>
        <div className="h-3 w-40 skeleton" />
      </div>

      {/* Body: sidebar + detail pane */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Explorer sidebar: two collapsible folders (professional + experience) */}
        <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-white/10 py-2 max-h-48 md:max-h-none overflow-hidden">
          <div className="px-4 pt-1 pb-2">
            <div className="h-2.5 w-20 skeleton" />
          </div>
          {[1, 3].map((fileCount, g) => (
            <div key={g} className="mb-1">
              {/* folder header */}
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                <div className="w-3.5 h-3.5 rounded skeleton shrink-0" />
                <div className="w-4 h-4 rounded skeleton shrink-0" />
                <div className="h-3 w-28 skeleton" />
              </div>
              {/* files */}
              {Array.from({ length: fileCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 pl-9 pr-3 py-1.5">
                  <div className="w-4 h-4 rounded skeleton shrink-0" />
                  <div className="h-3 w-24 skeleton" />
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Detail pane */}
        <div className="flex-1 min-h-0 p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-md skeleton shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-40 skeleton" />
              <div className="h-3 w-52 skeleton" />
              <div className="h-2.5 w-32 skeleton" />
            </div>
          </div>

          <div className="mt-5 h-3 w-3/4 skeleton" />

          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 skeleton" style={{ width: `${92 - i * 6}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
