import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.error('Missing credentials');
            return null;
          }

          const adminUsername = process.env.ADMIN_USERNAME;
          const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

          if (!adminUsername || !adminPasswordHash) {
            console.error('Admin credentials not configured in environment variables');
            console.error('ADMIN_USERNAME exists:', !!adminUsername);
            console.error('ADMIN_PASSWORD_HASH exists:', !!adminPasswordHash);
            return null;
          }

          if (credentials.username !== adminUsername) {
            console.error('Username mismatch');
            return null;
          }

          const isValidPassword = await compare(credentials.password, adminPasswordHash);

          if (!isValidPassword) {
            console.error('Password validation failed');
            return null;
          }

          return {
            id: '1',
            name: 'Admin',
            email: 'admin@crownmajestic.com',
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
