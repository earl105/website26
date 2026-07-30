// Placeholder shaped like a real project card (see Projects.tsx) so swapping in
// real data causes no layout shift. Dimensions mirror the h-96 glass card.
export default function ProjectCardSkeleton() {
  return (
    <div className="flex-none w-full md:w-64">
      <article className="relative overflow-hidden rounded-lg p-6 flex flex-col h-96 glass-surface">
        <div className="absolute top-0 left-0 right-0 h-2 skeleton" style={{ borderRadius: 0 }} />
        <div className="mt-2 mb-4 h-40 w-full rounded-md skeleton" />
        <div className="h-5 w-3/4 mb-3 skeleton" />
        <div className="space-y-2 flex-grow">
          <div className="h-3 w-full skeleton" />
          <div className="h-3 w-11/12 skeleton" />
          <div className="h-3 w-2/3 skeleton" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-6 w-14 rounded-full skeleton" />
          <div className="h-6 w-16 rounded-full skeleton" />
          <div className="h-6 w-12 rounded-full skeleton" />
        </div>
      </article>
    </div>
  );
}
