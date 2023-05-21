import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // Quero que a cada requisição feita, seja printado a query SQL
  log: ['query'],
})
