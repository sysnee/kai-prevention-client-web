'use client'
import { CircularProgress, Stack } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode, }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center" style={{ height: '100vh' }}>
        <Stack className="text-center" spacing={3}>
          <div className="items-center">
            <CircularProgress color="primary" />
          </div>
          <Stack>
            <h1 className='text-2xl'>SYSNEE - Template</h1>
            <h2 className='text-sm opacity-75'>NEXT.JS + MUI + TAILWIND + NEXT AUTH</h2>
          </Stack>
        </Stack>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div>
      {/* <div style={{ maxWidth: '300px', overflowX: 'scroll' }}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}
      {children}
    </div>
  )
}