import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import { devLoadDelay } from "../utils/devLoadDelay";
import { trackEvent } from "../utils/analytics";
import { holdsViewport, isTypingTarget } from "../utils/sectionFocus";

// Per-position visual presets, indexed by absolute distance from the centered
// card. The middle three (offsets 0, ±1) stay crisp; ±2/±3 recede and blur so
// focus reads clearly on the center. Desktop shows a 7-card arc, mobile a 3-card.
const COVERFLOW = {
	desktop: {
		maxOffset: 2,
		spacing: [0, 288, 512],
		scale: [1, 0.82, 0.62],
		rotate: [0, 36, 46],
		z: [0, -150, -320],
		opacity: [1, 0.85, 0.32],
		blur: [0, 0, 2.4],
	},
	mobile: {
		maxOffset: 1,
		spacing: [0, 236],
		scale: [1, 0.68],
		rotate: [0, 34],
		z: [0, -150],
		opacity: [1, 0.3],
		blur: [0, 4],
	},
} as const;

type Project = {
	id: number;
	title: string;
	description: string;
	tags: string[];
	github_url: string | null;
	demo_url: string | null;
	screenshot_url: string | null;
	clickable: boolean;
	// "Disable link": when true, forces the card non-clickable even if a valid
	// URL exists. (Overrides `clickable` OFF.)
	clickable_override: boolean;
	sort_order: number;
};

// A URL only counts as linkable if it's a real destination — not null, blank,
// or a bare "#" (which would just reload the site). Placeholder "#" values are
// treated the same as no URL, so such cards never render as dead links.
const isValidUrl = (url: string | null): url is string =>
	!!url && url.trim() !== '' && url.trim() !== '#';

// The destination a card points at: prefer github, fall back to demo, and only
// count real URLs. Null means the card isn't a link.
const projectLink = (project: Project): string | null =>
	isValidUrl(project.github_url)
		? project.github_url
		: isValidUrl(project.demo_url)
			? project.demo_url
			: null;

// A card only opens if it has a destination and neither flag disables it.
const isLinkable = (project: Project): boolean =>
	project.clickable && !project.clickable_override && projectLink(project) !== null;

// Parse "#rrggbb" (or shorthand "#rgb") into an [r, g, b] tuple.
const hexToRgb = (hex: string): [number, number, number] => {
	const h = hex.replace('#', '').trim();
	const full = h.length >= 6 ? h : h.split('').map((c) => c + c).join('');
	return [
		parseInt(full.slice(0, 2), 16) || 0,
		parseInt(full.slice(2, 4), 16) || 0,
		parseInt(full.slice(4, 6), 16) || 0,
	];
};

// Straight-line distance in RGB space. Two colors closer than COLOR_MIN_DIST
// are treated as "too similar" to sit next to each other (e.g. the two reds
// in the palette). Tuned so distinct hues pass but near-duplicates don't.
const rgbDist = (a: [number, number, number], b: [number, number, number]) =>
	Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const COLOR_MIN_DIST = 65;

const ArrowLeft = ({ className = "" }: { className?: string }) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="15 18 9 12 15 6" />
	</svg>
);

const ArrowRight = ({ className = "" }: { className?: string }) => (
	<svg
		className={className}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<polyline points="9 18 15 12 9 6" />
	</svg>
);

export default function Projects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [index, setIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [colors, setColors] = useState<string[]>([]);
	const prefersReducedMotion = useReducedMotion();
	// Set while a drag exceeds the tap threshold, so the release doesn't also
	// fire a card click (navigation / focus).
	const draggedRef = useRef(false);
	const sectionRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		let cancelled = false;

		const loadProjects = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch('/data/projects.json');
				if (!response.ok) {
					throw new Error(`Failed to load projects (${response.status})`);
				}

				await devLoadDelay();

				const data = (await response.json()) as Project[];
				if (!cancelled) {
					setProjects([...data].sort((a, b) => a.sort_order - b.sort_order));
				}
			} catch (loadError) {
				if (!cancelled) {
					setError(loadError instanceof Error ? loadError.message : 'Failed to load projects');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void loadProjects();
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const root = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
		if (!root) return;

		const cols: string[] = [];
		for (let i = 0; i < 20; i++) {
			const value = root.getPropertyValue(`--project-color-${i}`);
			if (!value) break;
			const trimmed = value.trim();
			if (trimmed) cols.push(trimmed);
		}

		if (cols.length === 0) {
			const list = root.getPropertyValue('--project-colors');
			if (list) {
				cols.push(...list.split(',').map((s) => s.trim()).filter(Boolean));
			}
		}

		if (cols.length) {
			setColors(cols);
		}
	}, []);

	useEffect(() => {
		const update = () => setIsMobile(window.innerWidth < 768);
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const n = projects.length;

	const shuffledIndices = useMemo(() => {
		if (colors.length === 0) return [];

		const seedBase = 1337;
		const mulberry32 = (a: number) => {
			return function () {
				let t = (a += 0x6d2b79f5);
				t = Math.imul(t ^ (t >>> 15), t | 1);
				t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
				return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
			};
		};

		const base = Array.from({ length: colors.length }, (_, k) => k);
		const result: number[] = [];
		let iter = 0;
		const targetLen = Math.max(n, colors.length);

		while (result.length < targetLen) {
			const arr = base.slice();
			const rnd = mulberry32(seedBase + iter);
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(rnd() * (i + 1));
				[arr[i], arr[j]] = [arr[j], arr[i]];
			}
			result.push(...arr);
			iter++;
			if (iter > 100) break;
		}

		return result;
	}, [colors.length, n]);

	// Final per-card color assignment. Walks the ring and, for each card, picks a
	// color that isn't too close to the previous card's color — and, for the last
	// card, also not too close to the first (the carousel wraps, so they touch).
	// The shuffled order sets each card's *preferred* color; we only deviate when
	// that would cause an adjacent clash.
	const cardColors = useMemo(() => {
		if (!colors.length || n === 0) return [];
		const rgb = colors.map(hexToRgb);
		const order = shuffledIndices.length
			? shuffledIndices
			: Array.from({ length: colors.length }, (_, k) => k);

		const assigned: number[] = [];
		for (let i = 0; i < n; i++) {
			const prev = i > 0 ? assigned[i - 1] : -1;
			const isLast = n > 1 && i === n - 1;
			const first = assigned[0];

			// Preference: the card's shuffled color first, then every other color.
			const preferred = order[i % order.length] % colors.length;
			const candidates = [preferred];
			for (let c = 0; c < colors.length; c++) if (c !== preferred) candidates.push(c);

			let best = preferred;
			let bestScore = -1;
			for (const c of candidates) {
				const dPrev = prev < 0 ? Infinity : rgbDist(rgb[c], rgb[prev]);
				const dFirst = isLast ? rgbDist(rgb[c], rgb[first]) : Infinity;
				if (dPrev >= COLOR_MIN_DIST && dFirst >= COLOR_MIN_DIST) {
					best = c;
					break;
				}
				// No conflict-free option yet — keep the most-different fallback.
				const score = Math.min(dPrev, dFirst);
				if (score > bestScore) {
					bestScore = score;
					best = c;
				}
			}
			assigned.push(best);
		}
		return assigned.map((c) => colors[c]);
	}, [colors, shuffledIndices, n]);

	const goTo = (next: number) => {
		if (n === 0) return;
		setIndex(((next % n) + n) % n);
	};

	const handlePrev = () => goTo(index - 1);
	const handleNext = () => goTo(index + 1);

	// Keyboard navigation, scoped to this section so it doesn't also fire while
	// the user is arrowing through another section's controls.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (n === 0) return;
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
			if (isTypingTarget()) return;
			if (!holdsViewport(sectionRef.current)) return;

			e.preventDefault();
			const step = e.key === 'ArrowLeft' ? -1 : 1;
			setIndex((v) => ((v + step) % n + n) % n);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [n]);

	// Enter opens the centered card's link, so arrow-key browsing doesn't require
	// tabbing onto the card first. Only fires while this section holds the
	// viewport, and never when a focusable element already handles Enter itself.
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== 'Enter' || e.repeat) return;
			if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
			if (n === 0) return;

			// Something focused (the card link itself, a dot, an arrow button) gets
			// the native Enter behavior instead.
			const active = document.activeElement;
			if (active && active !== document.body && active.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;

			// Require the projects section to be the one on screen.
			if (!holdsViewport(sectionRef.current)) return;

			const project = projects[((index % n) + n) % n];
			if (!project || !isLinkable(project)) return;
			const url = projectLink(project);
			if (!url) return;

			e.preventDefault();
			trackEvent('project_open', { project: project.title, destination: isValidUrl(project.github_url) ? 'github' : 'demo' });
			window.open(url, '_blank', 'noopener,noreferrer');
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [projects, index, n]);

	// Shortest signed circular distance from the centered card to project i.
	const circularOffset = (i: number) => {
		let off = ((i - index) % n + n) % n;
		if (off > n / 2) off -= n;
		return off;
	};

	const handleDragEnd = (_e: unknown, info: PanInfo) => {
		const cfg = isMobile ? COVERFLOW.mobile : COVERFLOW.desktop;
		const unit = cfg.spacing[1] || 190;
		// Combine travelled distance with a touch of throw velocity.
		const throw_ = info.offset.x + info.velocity.x * 0.15;
		const steps = Math.round(-throw_ / unit);
		draggedRef.current = Math.abs(info.offset.x) > 6;
		if (steps !== 0) goTo(index + steps);
	};

	const cfg = isMobile ? COVERFLOW.mobile : COVERFLOW.desktop;

	const cardColor = (actualIndex: number) => {
		if (!cardColors.length) return '#e24646';
		return cardColors[((actualIndex % n) + n) % n];
	};

	if (loading) {
		return (
			<section id="projects" className="flex flex-col items-center justify-center py-8 md:py-12" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
				<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0 w-full">
					<div className="relative">
						<div className="overflow-hidden px-10 py-2.5">
							<div className="flex items-stretch justify-center gap-6">
								{Array.from({ length: isMobile ? 1 : 3 }).map((_, i) => (
									<ProjectCardSkeleton key={i} />
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section id="projects" className="flex flex-col items-center justify-center py-8 md:py-12" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
				<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0 w-full">
					<div className="glass-surface-soft rounded-lg p-8 text-center text-red-100" style={{ borderColor: 'rgba(248, 113, 113, 0.30)' }}>
						{error}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section ref={sectionRef} id="projects" className="flex flex-col items-center justify-center py-8 md:py-12" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
			<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0 w-full">
				<div className="relative">
					<button
						aria-label="Previous project"
						onClick={handlePrev}
						className="hidden md:block absolute top-1/2 -translate-y-1/2 z-40 p-2 rounded-full glass-surface-soft transform hover:scale-103 transition-transform duration-150 left-[-6px] md:left-[-2.5rem]"
					>
						<ArrowLeft className="w-6 h-6 text-[var(--muted)]" />
					</button>

					{/* Stage: fixed-height 3D scene. Cards are absolutely positioned and
					    transformed by their offset from center. Drag anywhere to spin. */}
					<motion.div
						className="relative overflow-hidden select-none"
						style={{
							height: isMobile ? '26rem' : '27rem',
							perspective: 1600,
							cursor: 'grab',
						}}
						drag="x"
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={0.16}
						onDragStart={() => { draggedRef.current = false; }}
						onDragEnd={handleDragEnd}
						whileTap={{ cursor: 'grabbing' }}
					>
						{projects.map((project, i) => {
							const off = circularOffset(i);
							const abs = Math.abs(off);
							const sign = Math.sign(off);
							const visible = abs <= cfg.maxOffset;

							const clamped = Math.min(abs, cfg.spacing.length - 1);
							const x = sign * cfg.spacing[clamped];
							const scale = cfg.scale[clamped];
							const rotateY = prefersReducedMotion ? 0 : -sign * cfg.rotate[clamped];
							const z = prefersReducedMotion ? 0 : cfg.z[clamped];
							const opacity = visible ? cfg.opacity[clamped] : 0;
							const blur = prefersReducedMotion ? 0 : cfg.blur[clamped];
							const isCenter = off === 0;
							const bg = cardColor(i);

							const linkUrl = projectLink(project);
							const canLink = isCenter && isLinkable(project);

							const cardContent = (
								<article className={`relative overflow-hidden rounded-lg p-6 flex flex-col h-96 w-64 glass-surface${canLink ? ' transition-transform duration-150 group-hover:scale-[1.03]' : ''}`}>
									<div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: bg }} />
									{project.screenshot_url ? (
										<div className="mt-2 mb-4 h-40 w-full overflow-hidden rounded-md">
											<img src={project.screenshot_url} alt={project.title} className="w-full h-full object-cover" draggable={false} />
										</div>
									) : null}
									<h3 className="text-lg font-bold mb-2">{project.title}</h3>
									<p className="text-sm mb-4 flex-grow" style={{ color: 'var(--muted)' }}>{project.description}</p>
									<div className="mb-4">
										<div className="mt-2 flex flex-wrap gap-2">
											{project.tags.map((tag) => (
												<span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--chip)', color: 'var(--fg)' }}>
													{tag}
												</span>
											))}
										</div>
									</div>
								</article>
							);

							return (
								<motion.div
									key={project.id}
									className="absolute top-1/2 left-1/2"
									style={{ width: '16rem', marginLeft: '-8rem', marginTop: '-12rem', transformStyle: 'preserve-3d', pointerEvents: visible ? 'auto' : 'none' }}
									animate={{ x, scale, rotateY, z, opacity, filter: `blur(${blur}px)`, zIndex: 100 - abs * 10 }}
									transition={prefersReducedMotion
										? { duration: 0.18 }
										: { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
								>
									{/* Accent glow behind the focused card. */}
									<div
										aria-hidden
										className="absolute -inset-6 rounded-2xl pointer-events-none transition-opacity duration-300"
										style={{ background: `radial-gradient(60% 60% at 50% 40%, ${bg}, transparent 70%)`, opacity: isCenter ? 0.28 : 0, filter: 'blur(24px)', zIndex: -1 }}
									/>
									{canLink ? (
										<a
											href={linkUrl ?? '#'}
											target="_blank"
											rel="noreferrer"
											className="block group cursor-pointer"
											onClick={(e) => {
												if (draggedRef.current) { e.preventDefault(); return; }
												trackEvent('project_open', { project: project.title, destination: isValidUrl(project.github_url) ? 'github' : 'demo' });
											}}
										>
											{cardContent}
										</a>
									) : (
										<div
											className={isCenter ? 'cursor-default' : 'cursor-pointer'}
											onClick={() => { if (!draggedRef.current && !isCenter) goTo(i); }}
										>
											{cardContent}
										</div>
									)}
								</motion.div>
							);
						})}
					</motion.div>

					<button
						aria-label="Next project"
						onClick={handleNext}
						className="hidden md:block absolute top-1/2 -translate-y-1/2 z-40 p-2 rounded-full glass-surface-soft transform hover:scale-103 transition-transform duration-150 right-[-6px] md:right-[-2.5rem]"
					>
						<ArrowRight className="w-6 h-6 text-[var(--muted)]" />
					</button>
				</div>

				{/* Position indicator: dots on desktop, larger arrow controls on mobile. */}
				{n > 1 ? (
					<>
						<div className="hidden md:flex mt-6 items-center justify-center gap-2">
							{projects.map((project, i) => {
								const active = i === index;
								return (
									<button
										key={project.id}
										aria-label={`Go to ${project.title}`}
										aria-current={active}
										onClick={() => goTo(i)}
										className="rounded-full transition-all duration-200"
										style={{
											width: active ? 20 : 8,
											height: 8,
											backgroundColor: active ? cardColor(i) : 'var(--chip)',
											opacity: active ? 1 : 0.6,
										}}
									/>
								);
							})}
						</div>

						<div className="flex md:hidden mt-6 items-center justify-center gap-4">
							<button
								aria-label="Previous project"
								onClick={handlePrev}
								className="p-3 rounded-full glass-surface-soft text-[var(--muted)] active:scale-95 transition-transform"
							>
								<ArrowLeft className="w-5 h-5" />
							</button>
							<span className="text-sm tabular-nums" style={{ color: 'var(--muted)' }}>
								{index + 1} / {n}
							</span>
							<button
								aria-label="Next project"
								onClick={handleNext}
								className="p-3 rounded-full glass-surface-soft text-[var(--muted)] active:scale-95 transition-transform"
							>
								<ArrowRight className="w-5 h-5" />
							</button>
						</div>
					</>
				) : null}
			</div>
		</section>
	);
}
