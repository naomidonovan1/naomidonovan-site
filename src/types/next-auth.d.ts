import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      allowlisted?: boolean;
    } & DefaultSession['user'];
  }
}
