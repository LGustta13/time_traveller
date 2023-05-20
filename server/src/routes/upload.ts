import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

// Permite eu esperar o processo de upload finalizar, verifica a finalização
// promisify transforma algumas funções do nodejs em Promises, ou seja
// permite esperar algo até finalizar, ou a imagem/vídeo carregar por completo
const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mB
      },
    })

    if (!upload) {
      return reply.status(400).send()
    }

    // Tipo de arqivo, se é vídeo ou imagem
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    const fileName = fileId.concat(extension)

    // Estratégia de carregar o vídeo no HD aos poucos, enquanto vai sendo reproduzido (igual YOUTUBE)
    const writeStream = createWriteStream(
      // Arruma os caminhos, como a barra, que é diferente para cada SO
      // Caminho onde os arquivos de upload são salvos
      resolve(__dirname, '../../uploads', fileName),
    )

    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return fileUrl
  })
}
