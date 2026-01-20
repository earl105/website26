import { useEffect, useState, useMemo } from "react";
import TechCarousel from "../components/TechCarousel";

type Project = {
	name: string;
	description: string;
	technologies: string[];
	link: string;
	image?: string;
};

const sampleProjects: Project[] = [
	{
		name: "Java Tag Cloud Generator",
		description: "Developed a Java Tag Cloud Generator that dynamically produces HTML/CSS output from user-selected text files, allowing full customization of word count and input/output paths via a command line interface.",
		technologies: ["Java", "HTML", "CSS"],
		link: "#",
		image: undefined,
	},
	{
		name: "Trip Planner",
		description: "CRUD for users, trips, and expenses; computes minimum transactions to settle balances. Tailwind included.",
		technologies: ["Ruby on Rails", "Tailwind CSS", "SQLite", "JavaScript", "HTML", "CSS", "Git"],
		link: "#",
		image: undefined,
	},
	{
		name: "Schedule Preview",
		description: "Shows full prereq, postreq, and concurrent classes required for a given class on hover.",
		technologies: ["Ruby on Rails", "JavaScript", "Git", "HTML", "CSS"],
		link: "#",
		image: undefined,
	},
	{
		name: "Eagle Scout Project",
		description: "Built and donated a flag retirement box to the local American Legion in Barberton, Ohio.",
		technologies: ["Community Project", "Woodworking"],
		link: "#",
		image: undefined,
	},
	{
		name: "BillSplit App",
		description: "React + TypeScript + Tailwind app to simplify splitting bills between roommates; deployed on Vercel.",
		technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "HTML"],
		link: "#",
		image: undefined,
	},
	{
		name: "ESP32 Control Deck Macropad",
		description: "ESP32-based macropad controlling smart lights, per-app volume, audio output switching, and media controls.",
		technologies: ["ESP32", "C/C++", "Embedded"],
		link: "#",
		image: undefined,
	},
	{
		name: "Unit Converter",
		description: "Java Spring Boot unit converter with a GUI frontend.",
		technologies: ["Java", "Spring Boot"],
		link: "#",
		image: undefined,
	},
	{
		name: "NaturalNumber Calculator",
		description: "Implementation of a natural-number calculator in Java.",
		technologies: ["Java"],
		link: "#",
		image: undefined,
	},
	{
		name: "Glossary Generator",
		description: "Generates glossary entries from source text.",
		technologies: ["Java", "HTML"],
		link: "#",
		image: undefined,
	},
	{
		name: "Memory Allocation Study",
		description: "Used fork/exec/wait to analyze alloca vs malloc trends and recommend usage patterns.",
		technologies: ["C", "Memory Management", "Concurrency"],
		link: "#",
		image: undefined,
	},
	{
		name: "Campus Cloud Computing Task Scheduler",
		description: "Scheduler implementing FCFS, SJF, RR, and PRI using a thread-safe circular queue and per-job condition variables.",
		technologies: ["C", "Concurrency", "Threading", "Scheduling", "Unix"],
		link: "#",
		image: undefined,
	},
	{
		name: "Data Structures and Algorithms Implementations",
		description: "Collection of data-structure assignments and algorithms implemented in Java (heapsort, BST, queues, maps, etc.).",
		technologies: ["Java", "Data Structures", "Algorithms"],
		link: "#",
		image: undefined,
	},
	{
		name: "Portfolio Website",
		description: "Personal portfolio built with TypeScript, React, and Tailwind; deployed on Vercel.",
		technologies: ["TypeScript", "React", "Tailwind CSS", "Vercel", "HTML", "CSS", "Git", "Three.js"],
		link: "#",
		image: undefined,
	},
];

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
			const [projects] = useState<Project[]>(sampleProjects);
			const [index, setIndex] = useState(0);
			const [perPage, setPerPage] = useState(3);

			// Palette for project cards — one color per project (wraps if fewer colors)
			// Palette for project cards — moved to CSS as variables. We'll read them at runtime.
			const [colors, setColors] = useState<string[]>([]);

			// Predetermined shuffled order of indices (ensures a random-looking but fixed permutation).
			// Generate a deterministic, repeated shuffle of the color indices so the palette can
			// cover a larger number of projects without early repeats.

			useEffect(() => {
				// Read CSS custom properties from :root. Try numbered vars first, then fallback
				// to the comma-separated list `--project-colors`.
				const root = typeof window !== "undefined" ? getComputedStyle(document.documentElement) : null;
				if (!root) return;
				const cols: string[] = [];
				for (let i = 0; i < 20; i++) {
					const v = root.getPropertyValue(`--project-color-${i}`);
					if (!v) break;
					const t = v.trim();
					if (t) cols.push(t);
				}
				if (cols.length === 0) {
					const list = root.getPropertyValue("--project-colors");
					if (list) cols.push(...list.split(",").map((s) => s.trim()).filter(Boolean));
				}
				if (cols.length) setColors(cols);
			}, []);

			
			useEffect(() => {
				const update = () => setPerPage(window.innerWidth >= 768 ? 3 : 1);
				update();
				window.addEventListener("resize", update);
				return () => window.removeEventListener("resize", update);
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
				setIndex((i) => (i - perPage + n) % n);
			};

			const handleNext = () => {
				setIndex((i) => (i + perPage) % n);
			};

			const visible = Array.from({ length: perPage }, (_, i) => projects[(index + i) % n]);

			return (
				<section id="projects" className="min-h-screen flex flex-col items-center justify-center py-8 md:py-12">
					<div className="max-w-6xl mx-auto px-4 transform -translate-y-8 md:translate-y-0">
						{/* Render tech carousel on mobile above projects */}
						<div className="block md:hidden mb-6">
							<TechCarousel speed={"slow"} pauseOnHover={false} />
						</div>
					

						<div className="relative">
							<button
								aria-label="Previous projects"
								onClick={handlePrev}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow transform hover:scale-103 transition-transform duration-150 left-[-6px] md:left-[-2.5rem]"
								style={{ backgroundColor: 'var(--card)' }}
							>
								<ArrowLeft className="w-6 h-6 text-[var(--muted)]" />
							</button>

							<div className="overflow-hidden px-10 py-2.5">
								<div className={`flex items-stretch gap-6`}>
									{visible.map((p, i) => {
										const actualIndex = (index + i) % n;
										let bg = "#e24646"; // fallback
										if (colors.length) {
											const order = shuffledIndices.length ? shuffledIndices : Array.from({ length: colors.length }, (_, k) => k);
											const colorIndex = order[actualIndex % order.length] % colors.length;
											bg = colors[colorIndex];
										}
										return (
											<a
												key={`${p.name}-${i}`}
												href={p.link}
												target="_blank"
												rel="noreferrer"
												className="flex-none w-full md:w-64 group"
											>
												<article className={`relative overflow-hidden rounded-lg shadow p-6 flex flex-col transform hover:scale-103 transition-transform duration-200 hover:shadow-xl h-96`} style={{ backgroundColor: 'var(--card)' }}>
													{/* absolute top accent bar so color is flush with card top */}
													<div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: bg }} />

													{/* optional image area */}
													{p.image ? (
														<div className="mt-2 mb-4 h-40 w-full overflow-hidden rounded-md">
															<img src={p.image} alt={p.name} className="w-full h-full object-cover" />
														</div>
													) : null}

													<h3 className="text-lg font-bold mb-2">{p.name}</h3>
													<p className="text-sm mb-4 flex-grow" style={{ color: 'var(--muted)' }}>{p.description}</p>

													<div className="mb-4">
														<div className="mt-2 flex flex-wrap gap-2">
															{p.technologies.map((t) => (
																<span
																	key={t}
																	className="text-xs px-2 py-1 rounded-full"
																	style={{ backgroundColor: 'var(--chip)', color: 'var(--fg)' }}
																>
																	{t}
																</span>
															))}
														</div>
													</div>

													{/* <div className="mt-4">
														<span className="text-sm text-accent">Visit project →</span>
													</div> */}
												</article>
											</a>
										);
									})}
								</div>
							</div>

							<button
								aria-label="Next projects"
								onClick={handleNext}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow transform hover:scale-103 transition-transform duration-150 right-[-6px] md:right-[-2.5rem]"
								style={{ backgroundColor: 'var(--card)' }}
							>
								<ArrowRight className="w-6 h-6 text-[var(--muted)]" />
							</button>
						</div>
					</div>
				</section>
			);
		}

