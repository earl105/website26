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
  mysql: 'mysql',
  vscode: 'vscode',
  vim: 'vim',
git: 'git',
  claude: 'claude',
  playwright: 'playwright',
  pnpm: 'pnpm',
  jest: 'jest',
  openai: 'openai',
  jira: 'jira',
  confluence: 'confluence',
  miro: 'miro',
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

// Programming Languages
  { id: 'java', name: 'Java', src: getSrc('java') },
  { id: 'c', name: 'C', src: getSrc('c') },
  { id: 'asm', name: 'x86-64 Assembly', src: getSrc('asm') },
  { id: 'python', name: 'Python', src: getSrc('python') },
  { id: 'ruby', name: 'Ruby', src: getSrc('ruby') },
  { id: 'javascript', name: 'JavaScript', src: getSrc('javascript') },
  { id: 'typescript', name: 'TypeScript', src: getSrc('typescript') },
  { id: 'matlab', name: 'MATLAB', src: getSrc('matlab') },

// Markup & Styling
  { id: 'html5', name: 'HTML5', src: getSrc('html5') },
  { id: 'css3', name: 'CSS3', src: getSrc('css3') },
  { id: 'xml', name: 'XML', src: getSrc('xml') },

// Frameworks & Web Platforms
  { id: 'react', name: 'React', src: getSrc('react') },
  { id: 'ror', name: 'Ruby on Rails', src: getSrc('ror') },
  { id: 'tailwind', name: 'Tailwind CSS', src: getSrc('tailwind') },
  { id: 'vercel', name: 'Vercel', src: getSrc('vercel') },

// Databases
  { id: 'sqlite', name: 'SQLite', src: getSrc('sqlite') },
  { id: 'mysql', name: 'MySQL', src: getSrc('mysql') },

// CAD Tools
  { id: 'onshape', name: 'Onshape', src: getSrc('onshape') },
  { id: 'inventor', name: 'Inventor', src: getSrc('inventor') },
  { id: 'fusion', name: 'Fusion 360', src: getSrc('fusion') },

// Testing
  { id: 'jest', name: 'Jest', src: getSrc('jest') },
  { id: 'playwright', name: 'Playwright', src: getSrc('playwright') },

// AI Coding Assistants
  { id: 'claude', name: 'Claude Code', src: getSrc('claude') },
  { id: 'openai', name: 'OpenAI Codex', src: getSrc('openai') },

// IDEs & Editors
  { id: 'vscode', name: 'Visual Studio Code', src: getSrc('vscode') },
  { id: 'vim', name: 'Vim', src: getSrc('vim') },
  { id: 'eclipse', name: 'Eclipse IDE', src: getSrc('eclipse') },
  { id: 'arduino', name: 'Arduino IDE', src: getSrc('arduino') },

// Version Control
  { id: 'git', name: 'Git', src: getSrc('git') },
  { id: 'github', name: 'GitHub', src: getSrc('github') },

// Package Managers
  { id: 'npm', name: 'npm', src: getSrc('npm') },
  { id: 'pnpm', name: 'pnpm', src: getSrc('pnpm') },

// Collaboration & Project Management
  { id: 'jira', name: 'Jira', src: getSrc('jira') },
  { id: 'confluence', name: 'Confluence', src: getSrc('confluence') },
  { id: 'miro', name: 'Miro', src: getSrc('miro') },

// Productivity
  { id: 'excel', name: 'Excel', src: getSrc('excel') },

];

export default techIcons;
