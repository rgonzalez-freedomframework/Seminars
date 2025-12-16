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
  const { userId } = await auth();

  // For the root URL, send authenticated users to their dashboard
  // and unauthenticated visitors to the registration landing page.
  if (req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = userId ? '/home' : '/webinar-registration';
    return NextResponse.redirect(url);
  }

  // Protect non-public routes
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
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