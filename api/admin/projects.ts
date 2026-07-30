import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleResource } from '../_lib/resource.js';
import { validateProjects } from '../_lib/validate.js';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return handleResource(req, res, {
    path: 'public/data/projects.json',
    commitMessage: 'chore(admin): update projects.json via admin GUI',
    validate: validateProjects,
  });
}
