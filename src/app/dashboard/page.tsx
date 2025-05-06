'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Tabs from '../components/Tabs'
import GradientSelect from '../components/GradientSelect'
import BodySystemView from '../components/BodySystemView'
import api from '@/lib/api'
import { LoadingSpinner } from '../components/LoadingSpinner'
import Header from '../components/Header'
import Footer from '../components/Footer'
interface Exam {
    id: string;
    modality: string;
    description: string;
    status: string;
    accession: string | null;
    reportId: string;
    report: {
        id: string;
        status: string;
        findingsCount: number;
    };
}

interface Study {
    id: string;
    code: number;
    clientName: string;
    clientBirthdate: string;
    clientGender: string;
    clientCpf: string;
    patientId: string;
    examType: string;
    status: string;
    dateTime: string;
    createdAt: string;
    exams: Exam[];
}

interface StudiesResponse {
    data: Study[];
    meta: {
        total: number;
    };
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState('meus-estudos')
    const [selectedMonth, setSelectedMonth] = useState('')
    const [studies, setStudies] = useState<Study[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                setLoading(true)
                const response = await api.get('/studies') as StudiesResponse
                setStudies(response.data)

                if (response.data.length > 0) {
                    const dates = response.data.map(study => study.dateTime.split(',')[0].trim())
                    setSelectedMonth(dates[0])
                }

                setError(null)
            } catch (err) {
                setError('Falha ao carregar estudos')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchStudies()
    }, [])

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

    // Generate month options from studies
    const monthOptions = studies.length > 0
        ? [...new Set(studies.map(study => study.dateTime.split(',')[0].trim()))]
            .map(date => ({ value: date, label: date }))
        : [{ value: 'Nenhuma data disponível', label: 'Nenhuma data disponível' }]

    return (
        <>
            <Header />
            <div className="min-h-screen flex flex-col">
                {/* Main content */}
                <main className="flex-1 p-6 mx-auto w-full" style={{ maxWidth: '1580px' }}>
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
                        <p className="text-gray-700 mb-6">Sua próxima varredura recomendá é em {studies.length > 0 ? studies[0].dateTime.split(',')[0].trim() : 'breve'}</p>

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
                            loading ? (
                                <LoadingSpinner />
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : studies.length > 0 ? (
                                <div className="mb-8 rounded-xl p-[1px] bg-gradient-to-r from-green-200 via-amber-200 to-green-200">
                                    <div className="bg-white rounded-xl p-6">
                                        <div className="mb-6">
                                            <h2 className="text-xl text-gray-700">
                                                {studies[0].clientName} - Varredura completa de corpo inteiro <span className="text-green-500 font-normal">/ {studies[0].status === 'COMPLETED' ? 'Concluída' : 'Pendente'}</span>
                                            </h2>
                                        </div>
                                        <BodySystemView reportId={studies[0].exams[0].reportId} studyId={studies[0].id} />
                                    </div>
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
            <Footer />
        </>
    )
} 