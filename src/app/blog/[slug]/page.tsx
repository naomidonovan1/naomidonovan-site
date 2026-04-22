import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { getPublicPosts, getPostBySlug } from "@/lib/posts";
import { getViewer, signOut } from "@/lib/auth";

export const dynamicParams = true;

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const posts = await getPublicPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const viewer = await getViewer();
  const result = await getPostBySlug(slug, { viewer });
  if (result.status !== "ok") {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
    };
  }
  const { frontmatter } = result.post;
  const meta: Metadata = {
    title: `${frontmatter.title} — Naomi Donovan`,
    description: frontmatter.summary || undefined,
  };
  if (frontmatter.private || frontmatter.draft) {
    meta.robots = { index: false, follow: false };
  }
  return meta;
}

const mdxComponents = {
  a: (props: React.ComponentProps<"a">) => (
    <a
      {...props}
      className="text-violet-400 underline-offset-4 hover:underline"
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      {...props}
      className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-[0.9em] text-violet-200"
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      {...props}
      className="overflow-x-auto rounded-lg border border-zinc-800 bg-[#0f1115] p-4 text-sm"
    />
  ),
};

function ForbiddenView() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-violet-400/30">
      <div className="mx-auto max-w-3xl px-6 md:px-8 lg:px-12 py-16">
        <Link
          href="/blog"
          className="text-sm text-zinc-400 hover:text-violet-400"
        >
          ← Writing
        </Link>
        <header className="mt-6 mb-6">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
            Not authorized
          </h1>
          <p className="mt-3 text-zinc-400">
            This post is restricted — your account isn&apos;t on the allowlist.
          </p>
        </header>
        <div className="mt-8 flex items-center gap-4">
          <Link
            href="/blog"
            className="rounded border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-sm text-violet-300 hover:bg-violet-400/20"
          >
            Back to Writing
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/blog" });
            }}
          >
            <button
              type="submit"
              className="rounded border border-zinc-700/60 px-3 py-1.5 text-sm text-zinc-300 hover:border-violet-400/50 hover:text-violet-300"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const viewer = await getViewer();
  const result = await getPostBySlug(slug, { viewer });

  if (result.status === "not-found") {
    notFound();
  }

  if (result.status === "needs-auth") {
    redirect(`/signin?callbackUrl=${encodeURIComponent("/blog/" + slug)}`);
  }

  if (result.status === "forbidden") {
    return <ForbiddenView />;
  }

  const { post } = result;

  const { content } = await compileMDX<Record<string, unknown>>({
    source: post.content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [
            rehypePrettyCode,
            { theme: "github-dark-dimmed", keepBackground: false },
          ],
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-violet-400/30">
      <div className="mx-auto max-w-3xl px-6 md:px-8 lg:px-12 py-16">
        <Link
          href="/blog"
          className="text-sm text-zinc-400 hover:text-violet-400"
        >
          ← Writing
        </Link>

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-50">
            {post.frontmatter.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {formatDate(post.frontmatter.date)}
          </p>
          {post.frontmatter.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
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
        </header>

        <article className="prose prose-invert prose-violet max-w-none prose-headings:text-zinc-100 prose-a:text-violet-400 prose-strong:text-zinc-100 prose-code:text-violet-200 prose-pre:bg-[#0f1115] prose-pre:border prose-pre:border-zinc-800">
          {content}
        </article>
      </div>
    </main>
  );
}
