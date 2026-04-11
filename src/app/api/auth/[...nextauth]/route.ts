import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              role: "user",
            });
            user.id = newUser._id.toString();
          } else {
            user.id = existingUser._id.toString();
          }
          return true;
        } catch (error) {
          console.error("ERROR: Google user sync", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // Very Important: Token ki default sub/id ko MongoDB ID se overwrite kar rahe hain
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        // Frontend ko hamesha token.id milegi (Jo hamari MongoDB _id hai)
        session.user.id = token.id;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };