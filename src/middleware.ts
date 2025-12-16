import { clerkMiddleware } from '@clerk/nextjs/server';
import { createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
  '/live-webinar(.*)',
  '/webinar-registration(.*)',
  '/diagnostic(.*)',
  '/',
  '/admin/sign-in',
])

export default clerkMiddleware(async (auth, req) => {
  // Temporarily route all visits to the root URL to the webinar registration page
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/webinar-registration';
    return NextResponse.redirect(url);
  }

  // Protect non-public routes
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};