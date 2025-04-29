'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { z } from 'zod'
import Image from 'next/image'
import kaiLogo from '../../assets/kai-pc.png'
import loginBackground from '../../assets/login-1.jpg'
import '../login/styles.css'

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format')
})

export default function ForgotPasswordPage() {
    const router = useRouter()
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
                throw new Error(errorData.message || 'Falha ao enviar e-mail de redefinição de senha')
            }

            setIsSubmitted(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setEmailError(error.errors[0].message)
            } else {
                setRequestError((error as Error).message || 'Ocorreu um erro')
            }
        } finally {
            setIsLoading(false)
        }
    }

    function navigateToLogin() {
        router.push('/auth/login')
    }

    return (
        <div className="flex h-screen login-page">
            {/* Left side - Background image */}
            <div className="hidden md:block md:w-1/2 relative">
                <Image
                    src={loginBackground}
                    alt="KAI Prevention Center"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    priority
                />
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
                <div className="w-full max-w-md px-8 py-12">
                    <div className="flex justify-center mb-8">
                        <Image
                            src={kaiLogo}
                            alt="KAI Prevention Center"
                            width={120}
                            height={80}
                            priority
                        />
                    </div>

                    <h1 className="text-2xl text-center text-gray-700 mb-6">ESQUECEU SUA SENHA?</h1>

                    {!isSubmitted ? (
                        <>
                            <p className="text-center text-gray-600 mb-8">
                                Digite seu e-mail e receba instruções para redefinir sua senha.
                            </p>

                            {requestError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    {requestError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        placeholder="E-mail"
                                        className="kai-gradient-input"
                                    />
                                    {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="kai-gradient-button w-full py-3"
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} color="inherit" />
                                        ) : (
                                            <>Continue</>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={navigateToLogin}
                                        className="text-center text-kai-primary hover:underline mt-2"
                                    >
                                        Voltar para o login
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4 text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-green-600 text-xl font-medium mb-2">Link de redefinição de senha enviado!</p>
                                <p className="text-gray-600">
                                    Verifique seu e-mail para instruções para redefinir sua senha.
                                </p>
                            </div>

                            <button
                                onClick={navigateToLogin}
                                className="kai-gradient-button w-full py-3"
                            >
                                Voltar para o login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
} 