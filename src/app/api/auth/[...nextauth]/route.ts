import NextAuth, { SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { JWT } from "next-auth/jwt"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'

const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required")
                }

                try {
                    const response = await fetch(`${apiUrl}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    })

                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.message || "Invalid credentials")
                    }

                    const data = await response.json()

                    if (!data.accessToken) {
                        throw new Error("Authentication failed")
                    }

                    return {
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name,
                        accessToken: data.accessToken
                    }
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "Authentication failed")
                }
            }
        }),
    ],
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/login',
        error: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'sdfsdfsdfsdf897489-32h9preh89pf',
    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, account }: { token: JWT, user: any, account: any }) {
            // Initial sign in
            if (account && user) {
                // If credentials provider was used
                if (account.provider === "credentials") {
                    return {
                        ...token,
                        accessToken: user.accessToken,
                        userId: user.id
                    }
                }
            }

            // Return previous token if the access token has not expired yet
            return token
        },
        async session({ session, token }: { session: any, token: JWT }) {
            session.accessToken = token.accessToken
            session.userId = token.userId

            return session
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
