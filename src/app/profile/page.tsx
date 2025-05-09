'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { getMe, updateMe } from '@/services/system'
import { toast } from 'react-hot-toast'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = async () => {
        setIsLoading(true)
        try {
            const response = await getMe()
            setUser(response)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = {
                fullName: user?.fullName,
                cpf: user?.cpf,
                birthDate: user?.birthDate,
                gender: user?.gender,
                email: user?.email,
                phone: user?.phone,
            }
            await updateMe(data)
            toast.success('Perfil atualizado com sucesso!')
            fetchUser()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Erro ao atualizar perfil')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row justify-between gap-14 pt-20 pb-20 px-4 container mx-auto">
                <div className="bg-white rounded-[50px] shadow-sm w-full" style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, rgba(169, 220, 147, 1) 30%, rgba(255, 128, 70, 1) 80%) border-box', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}>
                    <div className='p-8' style={{ borderBottom: '1px solid rgba(169, 220, 147, 1' }} >
                        <h2 className="text-[#5B5B5F] text-[28px] font-[400]">PERFIL</h2>
                    </div>
                    <div className='p-8'>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
                            </div>
                        ) : (
                            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        name="fullName"
                                        value={user?.fullName || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Nome"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="cpf"
                                        value={user?.cpf || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="CPF"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="birthDate"
                                        type="date"
                                        value={user?.birthDate || ''}
                                        onChange={handleChange}
                                        placeholder="Data Nasc."
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <select
                                        name="gender"
                                        value={user?.gender || ''}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none appearance-none bg-transparent"
                                        disabled={isLoading}
                                        required
                                    >
                                        <option value="male">Masculino</option>
                                        <option value="female">Feminino</option>
                                        <option value="other">Outro</option>
                                    </select>
                                    <div className="absolute right-2 bottom-3 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L6 6L11 1" stroke="#666" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        name="email"
                                        value={user?.email || ''}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="E-mail"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        name="phone"
                                        value={user?.phone || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Celular"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <input
                                        name="cep"
                                        value={user?.cep || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="CEP"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="address"
                                        value={user?.address || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Endereço"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                    <input
                                        name="number"
                                        value={user?.number || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Número"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <input
                                        name="complement"
                                        value={user?.complement || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Complemento"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        name="city"
                                        value={user?.city || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Cidade"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                    <input
                                        name="state"
                                        value={user?.state || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Estado"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div>
                                    <input
                                        name="country"
                                        value={user?.country || ''}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="País"
                                        className="w-full border-b border-gray-300 pb-2 focus:outline-none placeholder:text-gray-500"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="bg-white text-green-700 rounded-full px-8 py-2 hover:opacity-80 transition-opacity"
                                        style={{
                                            background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, rgba(169, 220, 147, 1) 30%, rgba(255, 128, 70, 1) 80%) border-box',
                                            borderWidth: '1px',
                                            borderStyle: 'solid',
                                            borderColor: 'transparent'
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Carregando...' : 'Atualizar'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[50px] shadow-sm w-full h-min" style={{ background: 'linear-gradient(white, white) padding-box, linear-gradient(90deg, rgba(169, 220, 147, 1) 30%, rgba(255, 128, 70, 1) 80%) border-box', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}>
                    <div className='p-8' style={{ borderBottom: '1px solid rgba(169, 220, 147, 1' }} >
                        <h2 className="text-[#5B5B5F] text-[28px] font-[400]">ALTERAR SENHA</h2>
                    </div>
                    <div className="flex justify-center items-center p-8">
                        <Link
                            href="/auth/forgot-password"
                            className="text-green-700 hover:text-green-900 hover:underline"
                        >
                            Clique aqui para alterar sua senha
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
