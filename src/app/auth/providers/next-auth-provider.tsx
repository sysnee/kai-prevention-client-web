'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

type NextAuthProviderProps = {
    children: ReactNode
}

export function NextAuthProvider({ children }: NextAuthProviderProps) {
    return (
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
            {children}
        </SessionProvider>
    )
} 