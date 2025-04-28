'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, CircularProgress, Box, useTheme } from '@mui/material'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import Image from 'next/image'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import logoImage from '@/app/assets/kai-pc.png'

const loginSchema = z.object({
    email: z.string().email('Formato de e-mail inválido'),
    password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres')
})

export default function LoginPage() {
    const router = useRouter()
    const theme = useTheme()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({ email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoginError('')

        try {
            const validatedData = loginSchema.parse(formData)
            setIsLoading(true)

            const result = await signIn('credentials', {
                email: validatedData.email,
                password: validatedData.password,
                redirect: false
            })

            if (result?.error) {
                setLoginError('E-mail ou senha inválidos')
                setIsLoading(false)
                return
            }

            router.push('/dashboard')
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors = error.errors.reduce((acc, curr) => {
                    const field = curr.path[0] as string
                    return { ...acc, [field]: curr.message }
                }, { email: '', password: '' })
                setErrors(formattedErrors)
            }
            setIsLoading(false)
        }
    }

    function navigateToForgotPassword() {
        router.push('/auth/forgot-password')
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

                <h1 className="text-2xl font-normal text-center mb-1">Bem-vindo</h1>
                <p className="text-center text-gray-600 mb-6">Faça login para continuar.</p>

                {loginError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                        {loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">
                            Endereço de e-mail*
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-kai-primary focus:border-transparent"
                            style={{
                                border: errors.email
                                    ? "1px solid #dc2626"
                                    : theme.palette.mode === 'light'
                                        ? "1px solid rgba(229,231,235,255)"
                                        : "1px solid hsla(220, 20%, 25%, 0.6)",
                                outline: 'none'
                            }}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1">
                            Senha*
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
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

                    <button
                        type="button"
                        onClick={navigateToForgotPassword}
                        className="text-sm text-kai-primary hover:underline mb-4 block"
                    >
                        Esqueceu a senha?
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors"
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
} 