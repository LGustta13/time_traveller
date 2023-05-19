/* eslint-disable prettier/prettier */
import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null, // corpo da requisição
      {
        // O que vem depois do ponto de interrogação
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        // Estou dizendo para retornar os dados em JSON
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      // Para autenticar precisa deste header
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    // Verificar se o usuário já existe no banco de dados
    // findUnique só funciona se o valor for unique, logo githubId é unique
    // let pois o user será modificado
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    // Se não existe cria o usuário no banco de dados
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          name: userInfo.name,
          login: userInfo.login,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    // Colocar informações não sensíveis, não pode senhas
    // O token não é criptografado, é assinado
    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        // A qual usuário pertence a token, utiliza-se o id que é único
        sub: user.id,
        // Tempo válido
        expiresIn: '30 days',
      },
    )

    return {
      // Retorna o usuário do meu banco de dados!
      token,
    }
  })
}
