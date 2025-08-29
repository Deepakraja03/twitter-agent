import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0", // Changed to OAuth 2.0 for your credentials
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[next-auth][debug][OAUTH_CALLBACK_RESPONSE]', {
          profile,
          account,
          OAuthProfile: profile,
        })
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) return `${baseUrl}/dashboard`
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      if (token.accessToken) {
        (session as any).accessToken = token.accessToken as string
      }
      if ((token as any).username) {
        (session as any).username = (token as any).username as string
        ;(session.user as any).username = (token as any).username as string
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (process.env.NODE_ENV !== 'production' && (account || profile)) {
        // eslint-disable-next-line no-console
        console.log('[next-auth][debug][JWT_CALLBACK_INPUT]', { account, profile })
      }
      if (account) {
        token.accessToken = (account as any).access_token
        ;(token as any).refreshToken = (account as any).refresh_token
      }
      if (profile) {
        const p: any = profile
        ;(token as any).username = p?.data?.username || p?.username || (p as any)?.screen_name
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }