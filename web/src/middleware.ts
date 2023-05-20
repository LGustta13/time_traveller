import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

  const token = request.cookies.get('token')?.value

  // Se no caminho especificado em matcher, o usuário não estiver logado,
  // ele será redirecionado para fazer login, ou se manterá na página mais recente acessada
  // O HttpOnly significa que este cookie não aparecerá no Inspecionar elementos
  // O cookie é setado para que toda a aplicação consiga pegar o conteúdo
  if (!token) {
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url};Path=/; HttpOnly; max-age=20;`,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/memories/:path*',
}
