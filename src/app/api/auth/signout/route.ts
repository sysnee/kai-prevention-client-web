import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    // Use NEXTAUTH_URL from env or fallback to request origin, with absolute public URL as last fallback
    const baseUrl = process.env.NEXTAUTH_URL || req.headers.get('origin') || 'https://ris.kaiprevention.com.br'
    return NextResponse.redirect(new URL('/auth/login', baseUrl))
}

export async function POST(req: NextRequest) {
    // Use NEXTAUTH_URL from env or fallback to request origin, with absolute public URL as last fallback
    const baseUrl = process.env.NEXTAUTH_URL || req.headers.get('origin') || 'https://ris.kaiprevention.com.br'
    return NextResponse.redirect(new URL('/auth/login', baseUrl))
}
