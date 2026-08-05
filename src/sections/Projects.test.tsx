import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import Projects from './Projects';

const baseProject = {
  id: 1,
  title: 'Portfolio Site',
  description: 'A personal site.',
  tags: ['react', 'typescript'],
  github_url: 'https://github.com/example/repo',
  demo_url: null,
  screenshot_url: '/screens/portfolio.png',
  clickable: true,
  clickable_override: false,
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

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Projects', () => {
  it('renders a card for each project in the fixture data', async () => {
    mockFetchOnce([
      baseProject,
      { ...baseProject, id: 2, title: 'Second Project', sort_order: 1 },
    ]);

    render(<Projects />);

    await waitFor(() => expect(screen.getByText('Portfolio Site')).toBeInTheDocument());
    expect(screen.getByText('Second Project')).toBeInTheDocument();
  });

  it('renders without crashing when there are no projects', async () => {
    mockFetchOnce([]);

    render(<Projects />);

    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
    expect(document.getElementById('projects')).toBeInTheDocument();
  });

  it('falls back gracefully when a project entry is missing its screenshot', async () => {
    const { screenshot_url: _screenshot_url, ...projectWithoutScreenshot } = baseProject;
    void _screenshot_url;
    mockFetchOnce([projectWithoutScreenshot]);

    render(<Projects />);

    await waitFor(() => expect(screen.getByText('Portfolio Site')).toBeInTheDocument());
    expect(screen.getByText('A personal site.')).toBeInTheDocument();
  });
});
