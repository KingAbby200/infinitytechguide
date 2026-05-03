import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from './mongoose'
import User from '@/models/User'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        await connectDB()
        const user = await User.findOne({ email: credentials.email.toLowerCase() })

        if (!user) throw new Error('No account found with that email')

        const isValid = await user.comparePassword(credentials.password)
        if (!isValid) throw new Error('Incorrect password')

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
          role:  user.role,
          image: user.avatar || null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id   = token.id
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error:  '/auth/signin',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}