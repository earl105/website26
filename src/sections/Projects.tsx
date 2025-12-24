import { useEffect, useState } from "react";

type Project = {
	name: string;
	description: string;
	technologies: string[];
	link: string;
	image?: string;
};

const sampleProjects: Project[] = [
	{
		name: "Personal Portfolio Website",
		description: "A personal website to showcase my projects and skills.",
		technologies: ["HTML", "CSS", "JavaScript"],
		link: "https://www.example.com",
		image: undefined,
	},
	{
		name: "Another Project",
		description: "Description of another project.",
		technologies: ["Python", "Django"],
		link: "https://www.anotherexample.com",
		image: undefined,
	},
	{
		name: "Personal Portfolio Website 2",
		description: "A personal website to showcase my projects and skills.",
		technologies: ["HTML", "CSS", "JavaScript"],
		link: "https://www.example.com",
		image: undefined,
	},
	{
		name: "Another Project 3",
		description: "Description of another project.",
		technologies: ["Python", "Django"],
		link: "https://www.anotherexample.com",
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
			const [animating, setAnimating] = useState<"left" | "right" | null>(null);

			// Palette for project cards — one color per project (wraps if fewer colors)
			const colors = [
				"#FEF3C7", // warm yellow
				"#DBEAFE", // light blue
				"#FEE2E2", // light red/pink
				"#D1FAE5", // light green
				"#EDE9FE", // light purple
			];
			useEffect(() => {
				const update = () => setPerPage(window.innerWidth >= 768 ? 3 : 1);
				update();
				window.addEventListener("resize", update);
				return () => window.removeEventListener("resize", update);
			}, []);

			const n = projects.length;

			const handlePrev = () => {
				setAnimating("left");
				setTimeout(() => {
					setIndex((i) => (i - perPage + n) % n);
					setAnimating(null);
				}, 300);
			};

			const handleNext = () => {
				setAnimating("right");
				setTimeout(() => {
					setIndex((i) => (i + perPage) % n);
					setAnimating(null);
				}, 300);
			};

			const visible = Array.from({ length: perPage }, (_, i) => projects[(index + i) % n]);

			return (
				<section id="projects" className="py-12 min-h-screen flex items-center justify-center">
					<div className="max-w-6xl mx-auto px-4 transform translate-y-12">
						<h2 className="text-2xl font-semibold mb-6">Projects</h2>

						<div className="relative">
							<button
								aria-label="Previous projects"
								onClick={handlePrev}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow transform hover:scale-103 transition-transform duration-150"
								style={{ left: '-2.5rem', backgroundColor: 'var(--card)' }}
							>
								<ArrowLeft className="w-6 h-6 text-[var(--muted)]" />
							</button>

							<div className="overflow-hidden px-10">
								<div className={`flex items-stretch gap-6`}>
									{visible.map((p, i) => {
										const cardAnim = animating === "left" ? "animate-slide-left" : animating === "right" ? "animate-slide-right" : "";
										const actualIndex = (index + i) % n;
										const bg = colors[actualIndex % colors.length];
										return (
											<a
												key={`${p.name}-${i}`}
												href={p.link}
												target="_blank"
												rel="noreferrer"
												className="flex-none w-full md:w-64 group"
											>
												<article className={`relative overflow-hidden rounded-lg shadow p-6 flex flex-col ${cardAnim} transform hover:scale-103 transition-transform duration-200 hover:shadow-xl h-96`} style={{ backgroundColor: 'var(--card)' }}>
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
														<div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Technologies</div>
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

													<div className="mt-4">
														<span className="text-sm text-accent">Visit project →</span>
													</div>
												</article>
											</a>
										);
									})}
								</div>
							</div>

							<button
								aria-label="Next projects"
								onClick={handleNext}
								className="absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow transform hover:scale-103 transition-transform duration-150"
								style={{ right: '-2.5rem', backgroundColor: 'var(--card)' }}
							>
								<ArrowRight className="w-6 h-6 text-[var(--muted)]" />
							</button>
						</div>
					</div>
				</section>
			);
		}

