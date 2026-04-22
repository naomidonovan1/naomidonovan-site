import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import type { Viewer } from '@/lib/posts';

function getAllowedEmails(): string[] {
  const raw = process.env.ALLOWED_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user }) {
      const email = user?.email?.toLowerCase();
      if (!email) return false;
      const allowed = getAllowedEmails();
      if (!allowed.includes(email)) return false;
      return true;
    },
    async session({ session }) {
      if (session.user) {
        session.user.allowlisted = true;
      }
      return session;
    },
  },
});

export async function getViewer(): Promise<Viewer> {
  const session = await auth();
  if (!session?.user?.email) return null;
  return { allowlisted: true };
}
