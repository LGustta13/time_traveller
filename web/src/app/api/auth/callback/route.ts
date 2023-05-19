/* eslint-disable prettier/prettier */
import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const registerResponse = await api.post('/register', {
        code,
    })

    // Salva o token do JWT
    const { token } = registerResponse.data

    const redirectURL = new URL('/', request.url)

    const cookieExpiresInSeconds = 60 * 60 * 24 * 30

    // Aqui eu retorno o usuário para a raiz do projeto, ou seja, page.tsx
    // Além disso, salvo a token retornada do backend nos cookies da aplicação, no qual pode ser
    // acessado por toda a aplicação Path=/
    return NextResponse.redirect(redirectURL, {
        headers: {
            'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
        },
    })
}
