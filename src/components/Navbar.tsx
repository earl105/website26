import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const items = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "jobs", label: "Jobs" },
    { id: "contact", label: "Contact" },
  ];

  const [activeId, setActiveId] = useState<string>(items[0].id);
  const navRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, top: 0, height: 0 });
  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimer = useRef<number | null>(null);
  const programmaticScrollListener = useRef<((this: Window, ev: Event) => any) | null>(null);
  const lastActiveRef = useRef(activeId);

  const setActive = (id: string) => {
    setActiveId(id);
    lastActiveRef.current = id;
  };

  const handleClick = (id: string) => (e: any) => {
    e.preventDefault();
    if (isProgrammaticScroll.current) {
      if (programmaticScrollTimer.current) {
        window.clearTimeout(programmaticScrollTimer.current);
        programmaticScrollTimer.current = null;
      }
    }

    isProgrammaticScroll.current = true;

    setActive(id);
    updateIndicatorForId(id);

    document.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: "smooth" });

    attachProgrammaticScrollEndListener(id);
  };

  const updateIndicator = () => {
    const el = itemRefs.current[activeId];
    const nav = navRef.current;
    if (!el || !nav) return;
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const isDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

    // Make the indicator vertically squished: slightly inset from nav top/bottom
    const verticalInset = isDesktop ? 6 : 6;
    const top = verticalInset;
    const height = Math.max(22, navRect.height - verticalInset * 2);

    setIndicator({
      left: elRect.left - navRect.left,
      width: elRect.width,
      top,
      height,
    });
  };

  const updateIndicatorForId = (id: string) => {
    const el = itemRefs.current[id];
    const nav = navRef.current;
    if (!el || !nav) return;
    const elRect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const verticalInset = typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches ? 6 : 6;
    const top = verticalInset;
    const height = Math.max(22, navRect.height - verticalInset * 2);

    setIndicator({
      left: elRect.left - navRect.left,
      width: elRect.width,
      top,
      height,
    });
  };

  const attachProgrammaticScrollEndListener = (targetId: string) => {
    if (programmaticScrollListener.current) {
      window.removeEventListener("scroll", programmaticScrollListener.current);
      programmaticScrollListener.current = null;
    }

    const onScrollDuringProgrammatic = () => {
      if (programmaticScrollTimer.current) {
        window.clearTimeout(programmaticScrollTimer.current);
      }
      programmaticScrollTimer.current = window.setTimeout(() => {
        finishProgrammaticScroll(targetId);
      }, 150) as unknown as number;
    };

    programmaticScrollListener.current = onScrollDuringProgrammatic;
    window.addEventListener("scroll", onScrollDuringProgrammatic, { passive: true });

    if (programmaticScrollTimer.current) {
      window.clearTimeout(programmaticScrollTimer.current);
    }
    programmaticScrollTimer.current = window.setTimeout(() => {
      finishProgrammaticScroll(targetId);
    }, 2000) as unknown as number;
  };

  const finishProgrammaticScroll = (targetId: string) => {
    if (programmaticScrollTimer.current) {
      window.clearTimeout(programmaticScrollTimer.current);
      programmaticScrollTimer.current = null;
    }
    if (programmaticScrollListener.current) {
      window.removeEventListener("scroll", programmaticScrollListener.current);
      programmaticScrollListener.current = null;
    }

    setActive(targetId);
    updateIndicatorForId(targetId);

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 50) as unknown as number;
  };

  useEffect(() => {
    updateIndicator();
  }, [activeId]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    // Use a scroll-center detector instead of IntersectionObserver.
    // It finds the section whose vertical center is closest to the viewport center
    // and throttles updates to avoid rapid toggling while scrolling on mobile.
    let rafId: number | null = null;
    let pendingTimeout: number | null = null;
    let lastSetTime = 0;
    const minChangeDelay = 120; // ms

    const checkNearest = () => {
      rafId = null;
      if (isProgrammaticScroll.current) return;
      const viewportCenter = window.innerHeight / 2;
      let nearestId: string | null = null;
      let nearestDistance = Infinity;

      items.forEach((it) => {
        const el = document.getElementById(it.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestId = it.id;
        }
      });

      if (!nearestId || nearestId === lastActiveRef.current) return;

      const now = Date.now();
      const elapsed = now - lastSetTime;

      const apply = () => {
        setActive(nearestId as string);
        lastSetTime = Date.now();
        lastActiveRef.current = nearestId as string;
      };

      if (elapsed > minChangeDelay) {
        apply();
      } else {
        if (pendingTimeout) window.clearTimeout(pendingTimeout);
        pendingTimeout = window.setTimeout(() => {
          apply();
          pendingTimeout = null;
        }, minChangeDelay - elapsed);
      }
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(checkNearest);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // run once to initialize
    onScroll();

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      if (pendingTimeout) clearTimeout(pendingTimeout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // intentionally omit deps to keep listener stable; items are static
  }, []);

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-2xl px-3 py-2 md:top-4 md:bottom-auto">
      <div ref={navRef} className="h-12 flex items-center justify-center">
        <ul className="relative flex gap-4 text-sm justify-center">
          <span
            aria-hidden
            className="absolute z-0 transition-all duration-300 pointer-events-none"
            style={{
              left: `${indicator.left}px`,
              width: `${indicator.width}px`,
              // push up by 5px compared to computed top
              top: `${indicator.top - 5}px`,
              height: `${indicator.height}px`,
              // force a light grey background so it is not blue
              backgroundColor: '#424242ff',
              borderRadius: '6px',
            }}
          />
          {items.map((item) => (
            <li key={item.id}>
              <a
                ref={(el) => { itemRefs.current[item.id] = el; }}
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                aria-label={item.label}
                aria-current={activeId === item.id ? "true" : undefined}
                className="relative z-10 p-2 rounded-full hover:bg-[var(--surface-muted)] transition flex items-center justify-center"
              >
                <span className="inline-flex md:hidden">
                  {item.id === "hero" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-current">
                      <path d="M3 9.5L12 3l9 6.5" />
                      <path d="M7 12v10" />
                      <path d="M17 12v10" />
                      <path d="M7 22h10" />
                    </svg>
                  )}
                  {item.id === "about" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  )}
                       {item.id === "projects" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  )}
                  {item.id === "jobs" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 11 L7 8 A3 3 0 0 1 10 5 H14 A3 3 0 0 1 17 8 L17 11 Z" />
                      <path d="M3 11h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9z" />
                      <path d="M8 21v-4h8v4" />
                    </svg>
                  )}
             
                  {item.id === "contact" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  )}
                </span>
                <span className="sr-only md:hidden">{item.label}</span>
                <span className="hidden md:inline">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
