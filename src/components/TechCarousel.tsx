import techIcons from "../data/techIcons";
import type { TechIcon } from "../data/techIcons";

type Speed = "slow" | "medium" | "fast" | number;

interface TechCarouselProps {
  // seconds for one full loop; or preset string
  speed?: Speed;
  pauseOnHover?: boolean;
  className?: string;
  // optionally supply your own data (keeps component reusable)
  items?: TechIcon[];
}

const presetDuration = (speed?: Speed) => {
  if (!speed || speed === "slow") return 40; // slow, professional
  if (speed === "medium") return 26;
  if (speed === "fast") return 14;
  return Number(speed) || 40;
};

export default function TechCarousel({
  speed = "slow",
  pauseOnHover = true,
  className = "",
  items = techIcons,
}: TechCarouselProps) {
  const duration = presetDuration(speed);

  // We duplicate the items so the CSS translate can cycle seamlessly.
  const doubled = [...items, ...items];

  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden={false}>
      <div
        className={`conveyor relative whitespace-nowrap flex items-center gap-6 py-2 md:py-4 h-14 md:h-20`}
        // set CSS variable for duration which our index.css reads
        style={{
          ["--conveyor-duration" as any]: `${duration}s`,
          // keep mask on the non-moving container so fades remain anchored to viewport
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 6%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 94%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 6%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 94%, rgba(0,0,0,0) 100%)",
        }}
        // when user prefers reduced motion the animation will be disabled via CSS
      >
        <div
          className={`conveyor-track flex items-center gap-6` + (pauseOnHover ? " hover:conveyor-paused" : "")}
          // duplicate set rendered
        >
          {doubled.map((icon, idx) => (
            <div
              key={`${icon.id}-${idx}`}
              className="flex-shrink-0 flex flex-col items-center justify-center"
              style={{ width: 56 }}
            >
              <div aria-hidden="false" className="icon-wrap p-1 rounded">
                {icon.svg}
              </div>
              <span className="sr-only">{icon.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
