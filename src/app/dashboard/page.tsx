'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Header from '../components/Header'
import Tabs from '../components/Tabs'
import GradientSelect from '../components/GradientSelect'
import BodySystemView from '../components/BodySystemView'

export default function DashboardPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState('meus-estudos')
    const [selectedMonth, setSelectedMonth] = useState('maio de 2026')
    const [hasStudies, setHasStudies] = useState(true)

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
    }

    const handleMonthChange = (value: string) => {
        setSelectedMonth(value)
    }

    const tabs = [
        { id: 'meus-estudos', label: 'Meus estudos' },
        { id: 'estudos-compartilhados', label: 'Estudos compartilhados comigo' }
    ]

    const monthOptions = [
        { value: 'março de 2026', label: 'março de 2026' },
        { value: 'abril de 2026', label: 'abril de 2026' },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main content */}
            <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Page title */}
                <h1 className="text-2xl text-gray-700 font-normal mb-6">VARREDURAS</h1>

                {/* Tabs */}
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    className="mb-8"
                />

                {/* Next scan info */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <p className="text-gray-700 mb-6">Sua próxima varredura recomendá é em maio de 2026</p>

                    <GradientSelect
                        label="Data da digitalização"
                        options={monthOptions}
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="max-w-xs"
                    />
                </div>

                {/* Content based on active tab */}
                <div>
                    {activeTab === 'meus-estudos' ? (
                        hasStudies ? (
                            <div className="mb-8">
                                <div className="mb-6">
                                    <h2 className="text-xl text-gray-700">
                                        Augusto Romão - Varredura completa de corpo inteiro <span className="text-green-500 font-normal">/ Concluída</span>
                                    </h2>
                                </div>
                                <BodySystemView />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Nenhum estudo encontrado</p>
                        )
                    ) : (
                        <div>
                            {/* Estudos compartilhados content */}
                            <p className="text-gray-500 italic">Nenhum estudo compartilhado encontrado</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
} 