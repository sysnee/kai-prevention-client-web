'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CircularProgress } from '@mui/material'
import { z } from 'zod'
import Image from 'next/image'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import kaiLogo from '../../assets/kai-pc.png'
import loginBackground from '../../assets/login-1.jpg'
import '../login/styles.css'

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

                        <div className="mb-8 text-center">
                            <div className="flex justify-center mb-4 text-red-500">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium mb-2">Invalid Link</h2>
                            <p className="text-gray-600">The password reset link is invalid or has expired.</p>
                        </div>

                        <button
                            onClick={navigateToLogin}
                            className="kai-gradient-button w-full py-3"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        )
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

                    {isSuccess ? (
                        <div className="text-center">
                            <div className="flex justify-center mb-4 text-green-500">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-medium mb-2">Password Reset Successful</h2>
                            <p className="text-gray-600 mb-6">Your password has been successfully updated.</p>

                            <button
                                onClick={navigateToLogin}
                                className="kai-gradient-button w-full py-3"
                            >
                                Login with new password
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl text-center text-gray-700 mb-6">CREATE NEW PASSWORD</h1>
                            <p className="text-center text-gray-600 mb-8">
                                Your new password must be different from previous passwords
                            </p>

                            {requestError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                                    {requestError}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="New password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
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

                                <div className="mb-8">
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            className="kai-gradient-input"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="password-visibility-button"
                                        >
                                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="kai-gradient-button w-full py-3"
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <CircularProgress />
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