import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  // Använd middleware istället för $extends för bättre typkompatibilitet
  prisma.$use(async (params, next) => {
    const start = performance.now()
    const result = await next(params)
    const end = performance.now()
    const duration = end - start

    if (duration > 1000) {
      console.warn(`Slow query detected (${duration.toFixed(2)}ms):`, {
        model: params.model,
        operation: params.action,
        timestamp: new Date().toISOString(),
      })
    }

    return result
  })

  return prisma
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
