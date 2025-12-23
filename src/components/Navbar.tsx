export default function Navbar() {
  const items = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "jobs", label: "Jobs" },
    { id: "projects", label: "Projects" },
  ];

  const handleClick = (id: string) => (e: any) => {
    e.preventDefault();
    document.querySelector<HTMLElement>(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] rounded-full px-3 py-2 md:top-4 md:bottom-auto">
      <div className="h-12 flex items-center justify-center">
        <ul className="flex gap-4 text-sm justify-center">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                aria-label={item.label}
                className="p-2 rounded-full hover:bg-[var(--surface-muted)] transition flex items-center justify-center"
              >
                <span className="inline-flex md:hidden">
                  {item.id === "hero" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-current">
                      <path d="M3 9.5L12 3l9 6.5" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  )}
                  {item.id === "about" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  )}
                  {item.id === "jobs" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 11V7a4 4 0 0 0-8 0v4" />
                      <path d="M3 11h18v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9z" />
                      <path d="M8 21v-4h8v4" />
                    </svg>
                  )}
                  {item.id === "projects" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
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
