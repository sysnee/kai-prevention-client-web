'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgress, useTheme } from '@mui/material'
import { z } from 'zod'
import Image from 'next/image'
import logoImage from '@/app/assets/kai-pc.png'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format')
})

export default function ForgotPasswordPage() {
    const router = useRouter()
    const theme = useTheme()
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [requestError, setRequestError] = useState('')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
        setEmailError('')
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setRequestError('')

        try {
            forgotPasswordSchema.parse({ email })
            setIsLoading(true)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to send password reset email')
            }

            setIsSubmitted(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setEmailError(error.errors[0].message)
            } else {
                setRequestError((error as Error).message || 'An error occurred')
            }
        } finally {
            setIsLoading(false)
        }
    }

    function navigateToLogin() {
        router.push('/auth/login')
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md py-12 px-8 bg-white rounded-md">
                <div className="flex justify-center mb-6">
                    <Image
                        src={logoImage}
                        alt="KAI Prevention Center"
                        width={90}
                        height={60}
                    />
                </div>

                <h1 className="text-2xl font-normal text-center mb-1">Esqueceu sua senha?</h1>

                {!isSubmitted ? (
                    <>
                        <p className="text-center text-gray-600 mb-6">
                            Insira seu endereço de e-mail e lhe enviaremos instruções para redefinir sua senha.
                        </p>

                        {requestError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                {requestError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm mb-1">
                                    Endereço de e-mail*
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                                    style={{
                                        border: emailError
                                            ? "1px solid #dc2626"
                                            : theme.palette.mode === 'light'
                                                ? "1px solid rgba(229,231,235,255)"
                                                : "1px solid hsla(220, 20%, 25%, 0.6)",
                                        outline: 'none'
                                    }}
                                />
                                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Continuar'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={navigateToLogin}
                                    className="w-full py-2 px-4 text-center text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Tentar entrar novamente
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <p className="text-green-600 mb-2">Senha reset link sent!</p>
                            <p className="text-gray-600">
                                Please check your email for instructions to reset your password.
                            </p>
                        </div>

                        <button
                            onClick={navigateToLogin}
                            className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                        >
                            Return to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
} 