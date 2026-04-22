import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPosts, getPostCounts, type PostFilter } from "@/lib/posts";
import { getViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Writing — Naomi Donovan",
  description: "Essays, notes, and updates from Naomi Donovan.",
};

export const dynamic = "force-dynamic";

const TAB_LABELS: Record<PostFilter, string> = {
  published: "Published",
  drafts: "Drafts",
  private: "Private",
};

function parseTab(value: string | string[] | undefined): PostFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "drafts" || raw === "private") return raw;
  return "published";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab = parseTab(tabParam);
  const viewer = await getViewer();
  const allowed = viewer?.allowlisted === true;

  if ((tab === "drafts" || tab === "private") && !allowed) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/blog?tab=${tab}`)}`);
  }

  const [posts, counts] = await Promise.all([
    getAllPosts({ viewer, filter: tab }),
    getPostCounts(viewer),
  ]);

  const visibleTabs: PostFilter[] = allowed
    ? ["published", "drafts", "private"]
    : ["published"];

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-violet-400/30">
      <div className="mx-auto max-w-3xl px-6 md:px-8 lg:px-12 py-16">
        <header className="mb-10">
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-violet-400"
          >
            ← Home
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-50">
            Writing
          </h1>
          <p className="mt-3 text-zinc-400">
            Notes on neuroscience, machine learning, and whatever else I&apos;m
            thinking about.
          </p>
        </header>

        {visibleTabs.length > 1 && (
          <nav className="mb-10 flex gap-2 border-b border-zinc-800">
            {visibleTabs.map((t) => {
              const active = t === tab;
              const href = t === "published" ? "/blog" : `/blog?tab=${t}`;
              return (
                <Link
                  key={t}
                  href={href}
                  className={
                    "relative -mb-px px-3 py-2 text-sm transition-colors " +
                    (active
                      ? "border-b-2 border-violet-400 text-zinc-50"
                      : "border-b-2 border-transparent text-zinc-400 hover:text-zinc-200")
                  }
                >
                  {TAB_LABELS[t]}
                  <span className="ml-2 text-xs text-zinc-500">
                    {counts[t]}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="text-zinc-400">No posts here yet.</p>
        ) : (
          <ul className="space-y-10">
            {posts.map((post) => (
              <li key={post.slug}>
                <article>
                  <h2 className="text-xl font-medium text-zinc-100">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-violet-400"
                    >
                      {post.frontmatter.title}
                    </Link>
                    {post.frontmatter.draft && (
                      <span className="ml-2 rounded bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-300">
                        draft
                      </span>
                    )}
                    {post.frontmatter.private && (
                      <span className="ml-2 rounded bg-violet-400/10 px-2 py-0.5 text-xs text-violet-300">
                        private
                      </span>
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    {formatDate(post.frontmatter.date)}
                  </p>
                  {post.frontmatter.summary && (
                    <p className="mt-3 text-zinc-300">
                      {post.frontmatter.summary}
                    </p>
                  )}
                  {post.frontmatter.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded border border-zinc-700/60 px-2 py-0.5 text-xs text-zinc-400"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
