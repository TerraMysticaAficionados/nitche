
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  //  only allow these endpoints if key-cookie is set.
  console.log(request.cookies.get("key-cookie"))
  if(request.cookies.get("key-cookie")?.value != "cookie-key") {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  return res
}

export const config = {
  matcher: ['/mirror/:path*', '/sandbox/:path*'],
}
