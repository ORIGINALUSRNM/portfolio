export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  live_url: string | null;
  repo_url: string | null;
  tags: string[];
  screenshots: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
};
