import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import TechCarousel from "../components/TechCarousel";
import ProjectCardSkeleton from "../components/ProjectCardSkeleton";
import { devLoadDelay } from "../utils/devLoadDelay";

// Slide the whole visible set horizontally on navigate; direction: 1 = next, -1 = prev.
const slideVariants = {
	enter: (dir: number) => ({ x: dir > 0 ? "25%" : "-25%", opacity: 0 }),
	center: { x: "0%", opacity: 1 },
	exit: (dir: number) => ({ x: dir > 0 ? "-25%" : "25%", opacity: 0 }),
};

// Reduced-motion fallback: cross-fade only, no horizontal travel.
const fadeVariants = {
	enter: { opacity: 0 },
	center: { opacity: 1 },
	exit: { opacity: 0 },
};

type Project = {
	id: number;
	title: string;
	description: string;
	tags: string[];
	github_url: string | null;
	demo_url: string | null;
	screenshot_url: string | null;
	clickable: boolean;
	clickable_override: boolean;
	sort_order: number;
};

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
			const [perPage, setPerPage] = useState(3);
			const [colors, setColors] = useState<string[]>([]);
			const [direction, setDirection] = useState(1);
			const [animating, setAnimating] = useState(false);
			const prefersReducedMotion = useReducedMotion();

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
				const update = () => setPerPage(window.innerWidth >= 768 ? 3 : 1);
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

			const handlePrev = () => {
				if (n === 0 || animating) return;
				setDirection(-1);
				setAnimating(true);
				setIndex((value) => (value - perPage + n) % n);
			};

			const handleNext = () => {
				if (n === 0 || animating) return;
				setDirection(1);
				setAnimating(true);
				setIndex((value) => (value + perPage) % n);
			};

			const visible = n > 0 ? Array.from({ length: perPage }, (_, i) => projects[(index + i) % n]) : [];

			if (loading) {
				return (
					<section id="projects" className="flex flex-col items-center justify-center py-8 md:py-12" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
						<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0 w-full">
							<div className="relative">
								<div className="overflow-hidden px-10 py-2.5">
									<div className="flex items-stretch justify-center gap-6">
										{Array.from({ length: perPage }).map((_, i) => (
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
				<section id="projects" className="flex flex-col items-center justify-center py-8 md:py-12" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
					<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0">
						<div className="block md:hidden mb-6">
							<TechCarousel speed={"slow"} pauseOnHover={false} />
						</div>

						<div className="relative">
							<button
								aria-label="Previous projects"
								onClick={handlePrev}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass-surface-soft transform hover:scale-103 transition-transform duration-150 left-[-6px] md:left-[-2.5rem]"
							>
								<ArrowLeft className="w-6 h-6 text-[var(--muted)]" />
							</button>

							<div className="overflow-hidden px-10 py-2.5">
								<AnimatePresence mode="wait" custom={direction} initial={false}>
								<motion.div
									key={index}
									custom={direction}
									variants={prefersReducedMotion ? fadeVariants : slideVariants}
									initial="enter"
									animate="center"
									exit="exit"
									transition={{ duration: prefersReducedMotion ? 0.1 : 0.195, ease: "easeInOut" }}
									onAnimationComplete={(definition) => { if (definition === "center") setAnimating(false); }}
									className="flex items-stretch gap-6"
								>
									{visible.map((project, i) => {
										const actualIndex = n > 0 ? (index + i) % n : 0;
										let bg = '#e24646';
										if (colors.length) {
											const order = shuffledIndices.length ? shuffledIndices : Array.from({ length: colors.length }, (_, k) => k);
											const colorIndex = order[actualIndex % order.length] % colors.length;
											bg = colors[colorIndex];
										}

										const cardContent = (
											<article className="relative overflow-hidden rounded-lg p-6 flex flex-col transform hover:scale-103 transition-transform duration-200 h-96 glass-surface">
												<div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: bg }} />
												{project.screenshot_url ? (
													<div className="mt-2 mb-4 h-40 w-full overflow-hidden rounded-md">
														<img src={project.screenshot_url} alt={project.title} className="w-full h-full object-cover" />
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

										if (project.clickable && !project.clickable_override && (project.github_url || project.demo_url)) {
											return (
												<a
													key={`${project.title}-${i}`}
													href={project.github_url || project.demo_url || '#'}
													target="_blank"
													rel="noreferrer"
													className="flex-none w-full md:w-64 group"
												>
													{cardContent}
												</a>
											);
										}

										return (
											<div key={`${project.title}-${i}`} className="flex-none w-full md:w-64 group cursor-default">
												{cardContent}
											</div>
										);
									})}
								</motion.div>
								</AnimatePresence>
							</div>

							<button
								aria-label="Next projects"
								onClick={handleNext}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full glass-surface-soft transform hover:scale-103 transition-transform duration-150 right-[-6px] md:right-[-2.5rem]"
							>
								<ArrowRight className="w-6 h-6 text-[var(--muted)]" />
							</button>
						</div>
					</div>
				</section>
			);
		}

