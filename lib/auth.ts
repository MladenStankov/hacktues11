import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import EmailVerificationTemplate from "@/components/email/EmailVerificationTemplate";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [admin()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: "CareLink <onboarding@resend.dev>",
        to: user.email,
        subject: "Email Verification",
        react: EmailVerificationTemplate({ url }),
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
