import Link from 'next/link';
import { signIn } from '@/lib/auth';

type SearchParams = Promise<{ callbackUrl?: string | string[] }>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const raw = params.callbackUrl;
  const callbackUrl = Array.isArray(raw) ? raw[0] : raw ?? '/';

  return (
    <main className="min-h-screen bg-[#0b0d10] text-zinc-200 selection:bg-violet-400/30">
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Access is restricted to an allowlist. Sign in with Google to
            continue.
          </p>

          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-violet-400/70 hover:bg-violet-500/20"
            >
              Sign in with Google
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link
              href="/"
              className="text-zinc-400 hover:text-violet-400"
            >
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
