'use client'

import { ReactNode, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/auth/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <CircularProgress />
            </div>
        )
    }

    if (!session) {
        return null // Will be redirected in the useEffect
    }

    return <>{children}</>
} 