'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import Image from 'next/image'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import kaiLogo from '../../assets/kai-pc.png'
import loginBackground from '../../assets/login-1.jpg'
import './styles.css'

const loginSchema = z.object({
    email: z.string().email('Formato de e-mail inválido'),
    password: z.string().min(8, 'A senha deve conter pelo menos 8 caracteres')
})

export default function LoginPage() {
    const router = useRouter()
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

            {/* Right side - Login form */}
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

                    <h1 className="text-2xl text-center text-gray-700 mb-10">LOGIN TO YOUR ACCOUNT</h1>

                    {loginError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="kai-gradient-input"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="kai-gradient-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-visibility-button"
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 kai-gradient-button mb-6"
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Entrar'
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Forgot your password?
                                <button
                                    type="button"
                                    onClick={navigateToForgotPassword}
                                    className="text-kai-primary font-medium hover:underline ml-1"
                                >
                                    Reset password
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 