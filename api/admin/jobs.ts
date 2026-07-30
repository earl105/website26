import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleResource } from '../_lib/resource.js';
import { validateJobs } from '../_lib/validate.js';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return handleResource(req, res, {
    path: 'public/data/jobs.json',
    commitMessage: 'chore(admin): update jobs.json via admin GUI',
    validate: validateJobs,
  });
}
