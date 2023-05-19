import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

const app = fastify()

app.register(cors, {
  origin: true, // todos as urls de frontend poderão acessar o nosso backend
  // origin: ["https://minhaurl.com.br"] exemplo de url que, somente ela, pode acessar o backend
})

app.register(jwt, {
  secret: 'spacetime', // Assinatura do jwt, de preferência tem que ser muuuito aleatório
})

app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: 'localhost',
  })
  .then(() => {
    console.log('✔ HTTP server running on http://localhost:3333')
  })
