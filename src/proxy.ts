import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

//ssr route protection function
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(); //get auth user

  /*if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    
    return NextResponse.redirect(url);
  } */

  const isAuthRoute = 
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");

    //to ensure logged-out users cant just redirect to dashboard without proper auth
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        
        return NextResponse.redirect(url);
    }

    //to properly restrict redirecting to login and signup page if already logged-in
    if (isAuthRoute && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";

        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

//matcher updated include login and signup for checks
export const config = {
  //matcher: ["/dashboard/:path*"],
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};