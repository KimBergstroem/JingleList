import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  // Lägg till performance monitoring med middleware
  prisma.$extends({
    query: {
      $allOperations: async ({ operation, model, args, query }) => {
        const start = performance.now()
        const result = await query(args)
        const end = performance.now()

        if (end - start > 1000) {
          console.warn(`Slow query detected (${end - start}ms):`, {
            model,
            operation,
          })
        }

        return result
      },
    },
  })

  return prisma
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export { prisma }
