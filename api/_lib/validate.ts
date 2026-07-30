// Server-side schema validation + normalization. This is the ONLY gate before
// data is committed to the repo, so it must be strict:
//   - reject anything malformed (no corrupt JSON ever reaches the repo)
//   - output ONLY known fields (strips injected/extra keys)
//   - sanitize URL fields, which are rendered into href/src on the PUBLIC site
//     (blocks javascript:/data: and protocol-relative URLs → stored-XSS defense)

const MAX_ITEMS = 100;

export interface ValidationResult<T> {
  ok: boolean;
  errors: string[];
  value: T[];
}

// ---- primitives -------------------------------------------------------------

function str(v: unknown, field: string, errors: string[], max: number, opts: { allowEmpty?: boolean } = {}): string {
  if (typeof v !== 'string') {
    errors.push(`${field}: expected string`);
    return '';
  }
  // Normalize to the trimmed value so what is stored matches what is validated.
  const trimmed = v.trim();
  if (!opts.allowEmpty && trimmed === '') errors.push(`${field}: must not be empty`);
  if (trimmed.length > max) errors.push(`${field}: exceeds ${max} characters`);
  return trimmed;
}

function bool(v: unknown, field: string, errors: string[]): boolean {
  if (typeof v !== 'boolean') {
    errors.push(`${field}: expected boolean`);
    return false;
  }
  return v;
}

function int(v: unknown, field: string, errors: string[]): number {
  if (typeof v !== 'number' || !Number.isInteger(v)) {
    errors.push(`${field}: expected integer`);
    return 0;
  }
  return v;
}

/**
 * Returns a safe URL string or null. Allows:
 *   - null / "" → null
 *   - root-relative paths ("/logos/x.png") — but not "//host" or backslashes
 *   - absolute http(s) URLs
 * Rejects javascript:, data:, file:, etc.
 */
function safeUrl(v: unknown, field: string, errors: string[]): string | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v !== 'string') {
    errors.push(`${field}: expected string URL or null`);
    return null;
  }
  const s = v.trim();
  if (s.length > 2048) {
    errors.push(`${field}: URL too long`);
    return null;
  }
  if (s.includes('\\') || s.includes('\0')) {
    errors.push(`${field}: URL contains illegal characters`);
    return null;
  }
  // root-relative path
  if (s.startsWith('/')) {
    if (s.startsWith('//')) {
      errors.push(`${field}: protocol-relative URLs are not allowed`);
      return null;
    }
    return s;
  }
  try {
    const u = new URL(s);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      errors.push(`${field}: only http(s) URLs are allowed`);
      return null;
    }
    return u.toString();
  } catch {
    errors.push(`${field}: invalid URL`);
    return null;
  }
}

function strArray(v: unknown, field: string, errors: string[], maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) {
    errors.push(`${field}: expected array`);
    return [];
  }
  if (v.length > maxItems) errors.push(`${field}: too many items (max ${maxItems})`);
  return v.slice(0, maxItems).map((item, i) => str(item, `${field}[${i}]`, errors, maxLen));
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// ---- Project ----------------------------------------------------------------

export interface Project {
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
}

export function validateProjects(input: unknown): ValidationResult<Project> {
  const errors: string[] = [];
  if (!Array.isArray(input)) {
    return { ok: false, errors: ['payload must be an array'], value: [] };
  }
  if (input.length > MAX_ITEMS) errors.push(`too many projects (max ${MAX_ITEMS})`);

  const value: Project[] = input.slice(0, MAX_ITEMS).map((raw, i) => {
    if (!isObject(raw)) {
      errors.push(`project[${i}]: expected object`);
      return null as unknown as Project;
    }
    const f = `project[${i}]`;
    return {
      id: int(raw.id, `${f}.id`, errors),
      title: str(raw.title, `${f}.title`, errors, 200),
      description: str(raw.description, `${f}.description`, errors, 2000, { allowEmpty: true }),
      tags: strArray(raw.tags, `${f}.tags`, errors, 40, 60),
      github_url: safeUrl(raw.github_url, `${f}.github_url`, errors),
      demo_url: safeUrl(raw.demo_url, `${f}.demo_url`, errors),
      screenshot_url: safeUrl(raw.screenshot_url, `${f}.screenshot_url`, errors),
      clickable: bool(raw.clickable, `${f}.clickable`, errors),
      clickable_override: bool(raw.clickable_override, `${f}.clickable_override`, errors),
      sort_order: int(raw.sort_order, `${f}.sort_order`, errors),
    };
  });

  return { ok: errors.length === 0, errors, value };
}

// ---- Job --------------------------------------------------------------------

const JOB_ICONS = ['code', 'cart', 'box', 'tag'] as const;
type JobIcon = (typeof JOB_ICONS)[number];

export interface JobRecord {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  summary: string;
  icon: JobIcon;
  file: string;
  color: string;
  bullets: string[];
  logo_url: string | null;
  sort_order: number;
}

function icon(v: unknown, field: string, errors: string[]): JobIcon {
  if (typeof v === 'string' && (JOB_ICONS as readonly string[]).includes(v)) return v as JobIcon;
  errors.push(`${field}: must be one of ${JOB_ICONS.join(', ')}`);
  return 'code';
}

function hexColor(v: unknown, field: string, errors: string[]): string {
  if (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v.trim())) return v.trim();
  errors.push(`${field}: must be a #rrggbb hex color`);
  return '#4b5563';
}

function fileName(v: unknown, field: string, errors: string[]): string {
  if (typeof v === 'string' && /^[a-zA-Z0-9._-]{1,64}$/.test(v)) return v;
  errors.push(`${field}: must match [a-zA-Z0-9._-] (max 64)`);
  return '';
}

export function validateJobs(input: unknown): ValidationResult<JobRecord> {
  const errors: string[] = [];
  if (!Array.isArray(input)) {
    return { ok: false, errors: ['payload must be an array'], value: [] };
  }
  if (input.length > MAX_ITEMS) errors.push(`too many jobs (max ${MAX_ITEMS})`);

  const value: JobRecord[] = input.slice(0, MAX_ITEMS).map((raw, i) => {
    if (!isObject(raw)) {
      errors.push(`job[${i}]: expected object`);
      return null as unknown as JobRecord;
    }
    const f = `job[${i}]`;
    return {
      id: int(raw.id, `${f}.id`, errors),
      company: str(raw.company, `${f}.company`, errors, 200),
      role: str(raw.role, `${f}.role`, errors, 200),
      start_date: str(raw.start_date, `${f}.start_date`, errors, 60),
      end_date: str(raw.end_date, `${f}.end_date`, errors, 60),
      summary: str(raw.summary, `${f}.summary`, errors, 300, { allowEmpty: true }),
      icon: icon(raw.icon, `${f}.icon`, errors),
      file: fileName(raw.file, `${f}.file`, errors),
      color: hexColor(raw.color, `${f}.color`, errors),
      bullets: strArray(raw.bullets, `${f}.bullets`, errors, 12, 500),
      logo_url: safeUrl(raw.logo_url, `${f}.logo_url`, errors),
      sort_order: int(raw.sort_order, `${f}.sort_order`, errors),
    };
  });

  return { ok: errors.length === 0, errors, value };
}
