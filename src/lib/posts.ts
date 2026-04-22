import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type Frontmatter = {
  title: string;
  date: string; // ISO
  summary: string;
  tags: string[];
  draft: boolean;
  private: boolean;
};

export type Post = {
  slug: string;
  frontmatter: Frontmatter;
  content: string; // raw MDX source
};

export type Viewer = { allowlisted: boolean } | null;

export type PostFilter = 'published' | 'drafts' | 'private';

export type PostResult =
  | { status: 'ok'; post: Post }
  | { status: 'not-found' }
  | { status: 'needs-auth' }
  | { status: 'forbidden' };

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string') {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
    return value;
  }
  return new Date().toISOString();
}

function normalizeFrontmatter(data: Record<string, unknown>): Frontmatter {
  const tagsRaw = data.tags;
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map((t) => String(t)) : [];

  return {
    title: typeof data.title === 'string' ? data.title : 'Untitled',
    date: toIsoDate(data.date),
    summary: typeof data.summary === 'string' ? data.summary : '',
    tags,
    draft: Boolean(data.draft),
    private: Boolean(data.private),
  };
}

async function readPostFile(filename: string): Promise<Post | null> {
  if (!filename.endsWith('.mdx')) return null;
  const slug = filename.replace(/\.mdx$/, '');
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = normalizeFrontmatter(data as Record<string, unknown>);
  return { slug, frontmatter, content };
}

async function readAllPosts(): Promise<Post[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(entries.map((f) => readPostFile(f)));
  return posts.filter((p): p is Post => p !== null);
}

function isRestricted(post: Post): boolean {
  return post.frontmatter.draft || post.frontmatter.private;
}

function categoryOf(post: Post): PostFilter {
  if (post.frontmatter.draft) return 'drafts';
  if (post.frontmatter.private) return 'private';
  return 'published';
}

function sortByDateDesc(posts: Post[]): Post[] {
  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

export async function getAllPosts(opts?: {
  viewer?: Viewer;
  filter?: PostFilter;
}): Promise<Post[]> {
  const all = await readAllPosts();
  const allowed = opts?.viewer?.allowlisted === true;
  const filtered = all.filter((post) => {
    if (isRestricted(post) && !allowed) return false;
    if (opts?.filter && categoryOf(post) !== opts.filter) return false;
    return true;
  });
  return sortByDateDesc(filtered);
}

export async function getPostBySlug(
  slug: string,
  opts?: { viewer?: Viewer },
): Promise<PostResult> {
  const all = await readAllPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) return { status: 'not-found' };

  if (isRestricted(post)) {
    const viewer = opts?.viewer;
    if (!viewer) return { status: 'needs-auth' };
    if (!viewer.allowlisted) return { status: 'forbidden' };
  }

  return { status: 'ok', post };
}

export async function getPostCounts(
  viewer?: Viewer,
): Promise<Record<PostFilter, number>> {
  const all = await readAllPosts();
  const allowed = viewer?.allowlisted === true;
  const counts: Record<PostFilter, number> = {
    published: 0,
    drafts: 0,
    private: 0,
  };
  for (const post of all) {
    if (isRestricted(post) && !allowed) continue;
    counts[categoryOf(post)] += 1;
  }
  return counts;
}

export async function getPublicPosts(): Promise<Post[]> {
  const all = await readAllPosts();
  const filtered = all.filter(
    (post) => !post.frontmatter.draft && !post.frontmatter.private,
  );
  return sortByDateDesc(filtered);
}
