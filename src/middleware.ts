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
    // Protect non-public routes
    if(!isPublicRoute(req)){
        const session = await auth();
        session.protect();
        return;
    }
    
    // For root path, optionally redirect authenticated users to /home
    if(req.nextUrl.pathname === '/'){
        const viewLanding = req.nextUrl.searchParams.get('view') === 'landing';
        const fromAdmin = req.headers.get('referer')?.includes('/admin');
        
        // Only check auth if we might need to redirect
        if(!viewLanding && !fromAdmin){
            const {userId} = await auth();
            if(userId){
                return Response.redirect(new URL('/home', req.url));
            }
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