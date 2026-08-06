import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Increase connection pool timeout to prevent P2024 errors
  // especially during concurrent API calls on the Canva page
  ...(process.env.NODE_ENV === 'production' ? {} : {
    log: ['warn', 'error'],
  }),
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma