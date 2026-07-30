// Dev-only helper for previewing skeleton loaders. No-op in production builds.
//
// Usage (append to the URL in `npm run dev`):
//   ?skeleton          -> freezes the loading state indefinitely so you can
//                         inspect the skeletons
//   ?slowload=2000     -> delays the fetch by 2000ms, then loads real data
//
// Call it inside a data-loading effect before setting the loaded state.
export async function devLoadDelay(): Promise<void> {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);

  // Freeze forever: never resolves, so `loading` stays true.
  if (params.has('skeleton')) {
    await new Promise<void>(() => {});
    return;
  }

  const ms = Number(params.get('slowload'));
  if (Number.isFinite(ms) && ms > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
