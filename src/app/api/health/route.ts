import { NextResponse } from 'next/server'

export function GET() {
    return NextResponse.json({ status: 'healthy', env: process.env.NODE_ENV, conected_to: process.env.NEXT_PUBLIC_API_URL }, { status: 200 })
} 