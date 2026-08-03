import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if(['/login'].some((route)=>pathname.startsWith(route))){
        return NextResponse.next();
    }
    const token  = request.cookies.get('token')?.value;
    const expiration = request.cookies.get('expiration')?.value;
    if(!token){
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if(expiration){
        const expirationDate = new Date(expiration);
        if(expirationDate < new Date()) {
            const response = NextResponse.redirect(new URL('/login', request.url))
            response.cookies.delete('token')
            response.cookies.delete('refreshToken')
            response.cookies.delete('identifier')
            response.cookies.delete('expiration')
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}