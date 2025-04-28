'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CircularProgress, useTheme } from '@mui/material'
import { z } from 'zod'
import Image from 'next/image'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import logoImage from '@/app/assets/kai-pc.png'
const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one number or special character'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
})

function ResetPasswordForm() {
    const router = useRouter()
    const theme = useTheme()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [requestError, setRequestError] = useState('')
    const [tokenError, setTokenError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useEffect(() => {
        if (!token) {
            setTokenError('Invalid or missing reset token')
        }
    }, [token])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!token) {
            setTokenError('Invalid or missing reset token')
            return
        }

        setRequestError('')

        try {
            resetPasswordSchema.parse(formData)
            setIsLoading(true)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.password
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to reset password')
            }

            setIsSuccess(true)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    const field = curr.path[0] as string
                    return { ...acc, [field]: curr.message }
                }, { password: '', confirmPassword: '' })
                setErrors(formattedErrors)
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

    if (tokenError) {
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

                    <div className="mb-6 text-red-600">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        <h2 className="text-xl font-medium mb-2">Link inválido</h2>
                        <p className="text-gray-600">O link de redefinição de senha é inválido ou expirou.</p>
                    </div>

                    <button
                        onClick={navigateToLogin}
                        className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                    >
                        Voltar para o login
                    </button>
                </div>
            </div>
        )
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

                {isSuccess ? (
                    <div className="text-center">
                        <div className="text-green-600 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <h2 className="text-xl font-medium mb-2">Senha redefinida com sucesso</h2>
                            <p className="text-gray-600 mb-6">Sua senha foi atualizada com sucesso.</p>
                        </div>

                        <button
                            onClick={navigateToLogin}
                            className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                        >
                            Entrar com a nova senha
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-normal text-center mb-1">Criar nova senha</h1>
                        <p className="text-center text-gray-600 mb-6">
                            Sua nova senha deve ser diferente das senhas anteriores
                        </p>

                        {requestError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                {requestError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm mb-1">
                                    Nova senha*
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                                        style={{
                                            border: errors.password
                                                ? "1px solid #dc2626"
                                                : theme.palette.mode === 'light'
                                                    ? "1px solid rgba(229,231,235,255)"
                                                    : "1px solid hsla(220, 20%, 25%, 0.6)",
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                                    >
                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm mb-1">
                                    Confirmar nova senha*
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                                        style={{
                                            border: errors.confirmPassword
                                                ? "1px solid #dc2626"
                                                : theme.palette.mode === 'light'
                                                    ? "1px solid rgba(229,231,235,255)"
                                                    : "1px solid hsla(220, 20%, 25%, 0.6)",
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                                    >
                                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Redefinir senha'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md py-12 px-8 bg-white rounded-md flex justify-center">
                <CircularProgress size={48} />
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordForm />
        </Suspense>
    )
} 