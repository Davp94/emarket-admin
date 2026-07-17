import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if(['/login'].some((route)=>pathname.startsWith(route))){
        return NextResponse.next();
    }
    const token  = request.cookies.get('token')?.value;
    if(!token){
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}