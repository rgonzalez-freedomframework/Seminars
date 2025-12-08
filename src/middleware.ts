import { clerkMiddleware } from '@clerk/nextjs/server';
import { createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute=createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
    '/live-webinar(.*)',
    '/',
    '/admin/sign-in',
])

export default clerkMiddleware(async(auth,req)=>{
    const {userId} = await auth();
    
    // Check if user wants to view landing page (has query param or referer is admin)
    const viewLanding = req.nextUrl.searchParams.get('view') === 'landing';
    const fromAdmin = req.headers.get('referer')?.includes('/admin');
    
    // Redirect authenticated users from landing page to /home (unless explicitly viewing landing)
    if(userId && req.nextUrl.pathname === '/' && !viewLanding && !fromAdmin){
        return Response.redirect(new URL('/home', req.url));
    }
    
    if(!isPublicRoute(req)){
        await auth.protect()
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