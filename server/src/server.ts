import fastify from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

app.register(cors, {
  origin: true, // todos as urls de frontend poderão acessar o nosso backend
  // origin: ["https://minhaurl.com.br"] exemplo de url que, somente ela, pode acessar o backend
})

app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('✔ HTTP server running on http://localhost:3333')
  })
