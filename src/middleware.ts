import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_PATH   = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin'
const ADMIN_SEGMENT = `/${ADMIN_PATH}`

async function isMaintenanceMode(): Promise<boolean> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_config?key=eq.maintenance_mode&select=value`
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: 30 },
    })
    const data: { value: string }[] = await res.json()
    return data?.[0]?.value === 'true'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // If a custom admin path is set, block direct /admin/* access
  if (ADMIN_PATH !== 'admin' && (path === '/admin' || path.startsWith('/admin/'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isAdminRoute = path === ADMIN_SEGMENT || path.startsWith(ADMIN_SEGMENT + '/')

  // Maintenance mode check — skip for admin, login and maintenance page itself
  const isPublicRoute = !isAdminRoute && path !== '/login' && path !== '/mantenimiento'
  if (isPublicRoute && await isMaintenanceMode()) {
    const url = request.nextUrl.clone()
    url.pathname = '/mantenimiento'
    return NextResponse.redirect(url)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = `${ADMIN_SEGMENT}/dashboard`
    return NextResponse.redirect(url)
  }

  // Rewrite custom admin path to the actual /admin filesystem route
  if (ADMIN_PATH !== 'admin' && isAdminRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin' + path.slice(ADMIN_SEGMENT.length)
    const rewriteResponse = NextResponse.rewrite(url)
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) => {
      rewriteResponse.cookies.set(name, value, opts)
    })
    return rewriteResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
