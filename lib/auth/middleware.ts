import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware para proteger rotas autenticadas
 * Verifica se o usuário tem um token Supabase válido
 *
 * Rotas protegidas começam com /dashboard
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/ingredientes', '/receitas', '/estoque', '/compras', '/financeiro', '/relatorios']

  // Verificar se a rota é protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Verificar se é rota pública
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Obter token do cookie
  const authToken = request.cookies.get('sb-auth-token')

  // Se é rota protegida e não tem token, redirecionar para login
  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se é rota pública e tem token, redirecionar para dashboard
  if (isPublicRoute && authToken && pathname === '/auth/login') {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
