import React from "react";

export interface TechIcon {
  id: string;
  name: string;
  // URL to the image asset (png/svg) resolved by Vite
  src: string;
}

// Use Vite's import.meta.glob to eagerly load all images in the techIcons folder
// and return them as URL strings. This keeps imports DRY and allows bundler
// optimizations. The path keys are relative to this file.
const iconModules = import.meta.glob('../assets/techIcons/*.{png,svg}', { eager: true, as: 'url' }) as Record<string, string>;

// Map tech id to a base filename (no extension). getSrc will prefer `.svg`.
const fileMap: Record<string, string> = {
  arduino: 'arduino',
  asm: 'asm',
  c: 'c',
  css3: 'css3',
  excel: 'excel',
  fusion: 'fusion',
  html5: 'html5',
  inventor: 'inventor',
  ruby: 'ruby',
  ror: 'rails',
  java: 'java',
  matlab: 'matlab',
  onshape: 'onshape',
  xml: 'xml',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  react: 'react',
  tailwind: 'tailwind',
  vercel: 'vercel',
  eclipse: 'eclipse',
  npm: 'npm',
  github: 'github',
  sqlite: 'sqlite',
};

const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
  <rect width='48' height='48' rx='8' fill='%23E5E7EB' />
  <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='%234B5563'>Icon</text>
</svg>`;
const placeholderDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(placeholderSvg)}`;

const getSrc = (id: string) => {
  const base = fileMap[id];
  if (!base) return placeholderDataUrl;
  // Prefer SVG when both svg and png exist
  const svgKey = `../assets/techIcons/${base}.svg`;
  const pngKey = `../assets/techIcons/${base}.png`;
  if (iconModules[svgKey]) return iconModules[svgKey];
  if (iconModules[pngKey]) return iconModules[pngKey];
  return placeholderDataUrl;
};

export const techIcons: TechIcon[] = [
  { id: 'arduino', name: 'Arduino IDE', src: getSrc('arduino') },
  { id: 'asm', name: 'x86-64 Assembly', src: getSrc('asm') },
  { id: 'c', name: 'C', src: getSrc('c') },
  { id: 'css3', name: 'CSS3', src: getSrc('css3') },
  { id: 'excel', name: 'Excel', src: getSrc('excel') },
  { id: 'fusion', name: 'Fusion 360', src: getSrc('fusion') },
  { id: 'html5', name: 'HTML5', src: getSrc('html5') },
  { id: 'inventor', name: 'Inventor', src: getSrc('inventor') },
  { id: 'ruby', name: 'Ruby', src: getSrc('ruby') },
  { id: 'ror', name: 'Ruby on Rails', src: getSrc('ror') },
  { id: 'sqlite', name: 'SQLite', src: getSrc('sqlite') },
  { id: 'java', name: 'Java', src: getSrc('java') },
  { id: 'matlab', name: 'MATLAB', src: getSrc('matlab') },
  { id: 'onshape', name: 'Onshape', src: getSrc('onshape') },
  { id: 'xml', name: 'XML', src: getSrc('xml') },
  { id: 'python', name: 'Python', src: getSrc('python') },
  { id: 'javascript', name: 'JavaScript', src: getSrc('javascript') },
  { id: 'typescript', name: 'TypeScript', src: getSrc('typescript') },
  { id: 'react', name: 'React', src: getSrc('react') },
  { id: 'tailwind', name: 'Tailwind CSS', src: getSrc('tailwind') },
  { id: 'vercel', name: 'Vercel', src: getSrc('vercel') },
  { id: 'eclipse', name: 'Eclipse IDE', src: getSrc('eclipse') },
  { id: 'npm', name: 'npm', src: getSrc('npm') },
  { id: 'github', name: 'GitHub', src: getSrc('github') },
];

export default techIcons;
