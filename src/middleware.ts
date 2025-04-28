// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isLoginPage = url.pathname.startsWith('/login');

  if (isLoginPage) {
    console.log('its login page, redirecting to /home')
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  

  return NextResponse.next();
}

export const config = {
  matcher: ["/protected/:path*"],
};
