import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import db from "./db";
import { env } from "./utils";

export const authOptions: AuthOptions = {
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: env("GOOGLE_CLIENT_ID")!,
      clientSecret: env("GOOGLE_CLIENT_SECRET")!,
    }),
    // ...add more providers here
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.sub = user?.id;
      }
      return token;
    },
    session({ session, token, user }) {
      // I skipped the line below coz it gave me a TypeError
      // session.accessToken = token.accessToken;
      session.user.id = token?.sub || user.id;
      // console.log(session);

      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/error",
    newUser: "/init",
  },
};

export async function auth() {
  return getServerSession(authOptions);
}
