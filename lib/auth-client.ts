import { createAuthClient } from "better-auth/client";

export const { signIn, signOut, useSession, signUp } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
});
