import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      role?: UserRole | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string
    role: UserRole
  }
} 