import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    // Use NEXTAUTH_URL from env or fallback to request origin, with absolute public URL as last fallback
    const baseUrl = process.env.NEXTAUTH_URL || req.headers.get('origin') || 'https://ris.kaiprevention.com.br'

    // Create response that redirects to login
    const response = NextResponse.redirect(new URL('/auth/login', baseUrl))

    // Clear all next-auth related cookies in the response
    const cookieNames = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.session-token',
        '__Secure-next-auth.csrf-token',
        '__Secure-next-auth.callback-url',
        '__Host-next-auth.csrf-token'
    ]

    cookieNames.forEach(name => {
        response.cookies.delete(name)
    })

    return response
}

export async function POST(req: NextRequest) {
    // Use NEXTAUTH_URL from env or fallback to request origin, with absolute public URL as last fallback
    const baseUrl = process.env.NEXTAUTH_URL || req.headers.get('origin') || 'https://ris.kaiprevention.com.br'

    // Create response that redirects to login
    const response = NextResponse.redirect(new URL('/auth/login', baseUrl))

    // Clear all next-auth related cookies in the response
    const cookieNames = [
        'next-auth.session-token',
        'next-auth.csrf-token',
        'next-auth.callback-url',
        '__Secure-next-auth.session-token',
        '__Secure-next-auth.csrf-token',
        '__Secure-next-auth.callback-url',
        '__Host-next-auth.csrf-token'
    ]

    cookieNames.forEach(name => {
        response.cookies.delete(name)
    })

    return response
} 