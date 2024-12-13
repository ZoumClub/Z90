import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Bypass authentication in development
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};