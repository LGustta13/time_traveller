/* eslint-disable prettier/prettier */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  // Rota GET memories, retorna o id da memória, a URL da imagem e o conteúdo minimizado
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      // Ordenar na ordem crescente
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
      }
    })
  })

  // Rota GET memories pelo id da memória, id retornado pelo request
  app.get('/memories/:id', async (request) => {
    // Utilizando o zod para verificar se id é uma String na query
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    // Procura a memória pelo id caso id do request == id da memória, se não encontrar lança erro
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  // Rota POST memories pelo content, coverUrl e isPublic, envia a(s) memória(s) ao banco de dados
  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), // coerce transforma um valor 1 para true e 0 para false, exemplo
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '1a056bf3-126b-486b-b94e-21850634b042',
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false), // coerce transforma um valor 1 para true e 0 para false, exemplo
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })

    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    // Procura a memória pelo id caso id do request == id da memória, se não encontrar lança erro
    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
