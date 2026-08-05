import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Jobs from './Jobs';

const baseJob = {
  id: 1,
  company: 'CoverMyMeds',
  role: 'Software Engineer',
  start_date: '2021',
  end_date: 'Present',
  summary: 'Built things.',
  icon: 'code' as const,
  color: '#e8106a',
  file: 'covermymeds.tsx',
  category: 'professional',
  bullets: ['Did a thing', 'Did another thing'],
  logo_url: '/logos/cmm.png',
  sort_order: 0,
};

function mockFetchOnce(data: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => data,
    })
  );
}

beforeEach(() => {
  vi.stubGlobal('sessionStorage', {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Jobs', () => {
  it('renders a card for each job in the fixture data', async () => {
    mockFetchOnce([
      baseJob,
      { ...baseJob, id: 2, company: "Lowe's Home Improvement", role: 'Engineer II', file: 'lowes.md' },
    ]);

    render(<Jobs />);

    await waitFor(() => expect(screen.getByText('CoverMyMeds')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: "Lowe's Home Improvement" })).toBeInTheDocument();
  });

  it('renders without crashing when there are no jobs', async () => {
    mockFetchOnce([]);

    render(<Jobs />);

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(document.getElementById('jobs')).toBeInTheDocument();
  });

  it('falls back gracefully when a job entry is missing its color', async () => {
    const { color: _color, ...jobWithoutColor } = baseJob;
    void _color;
    mockFetchOnce([jobWithoutColor]);

    render(<Jobs />);

    await waitFor(() => expect(screen.getByText('CoverMyMeds')).toBeInTheDocument());
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });
});
