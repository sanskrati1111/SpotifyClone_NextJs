import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export async function middleware(req){
    const url = req.nextUrl.clone();
    // token will exist if user logged in.. 
const token = await getToken({req, secret: process.env.JWT_SECRET});
const {pathname}= req.nextUrl ;
// allow req if theses are true:
// 1- its a request for next-auth session & provider fetching
// 2- token exists

if(pathname.includes("/api/auth")|| token){
    return NextResponse.next();
}

//redirect to login if not have token and req to protecgted route
if(!token && pathname!=="/login"){
    url.pathname = "/login";
    return NextResponse.redirect(url);
}

}