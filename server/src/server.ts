import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'

const app = fastify()

// Para upload de arquivos (.png, .txt)
app.register(multipart)

app.register(cors, {
  origin: true, // todos as urls de frontend poderão acessar o nosso backend
  // origin: ["https://minhaurl.com.br"] exemplo de url que, somente ela, pode acessar o backend
})

app.register(jwt, {
  secret: 'spacetime', // Assinatura do jwt, de preferência tem que ser muuuito aleatório
})

app.register(authRoutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)

// Transforma a pasta em pública
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app
  .listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
    // host: 'localhost', //dessa forma funcionou para o axios.post na aplicação web
    host: '0.0.0.0', // dessa forma funcionou para o axios.post na aplicação mobile
  })
  .then(() => {
    console.log('✔ HTTP server running on http://localhost:3333')
  })
