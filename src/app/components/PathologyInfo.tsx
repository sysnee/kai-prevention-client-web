'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { LoadingSpinner } from './LoadingSpinner'

interface FaqItem {
    question: string
    answer: string
}

interface PathologyData {
    description: string
    faq: FaqItem[]
}

interface PathologyInfoProps {
    organ?: string
    pathology?: string
}

export default function PathologyInfo({ organ, pathology }: PathologyInfoProps) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<PathologyData | null>(null)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

    useEffect(() => {
        const fetchPathologyData = async () => {
            if (!pathology) return // We need at least a pathology to fetch data

            try {
                setLoading(true)
                const result = await api.get(`/external/pathologies-data`, {
                    params: {
                        organ: organ || 'Unknown', // Provide fallback if organ is not defined
                        pathology
                    },
                    headers: {
                        'api-key': 'AcN55Gg1Hfe30LMtZ2'
                    }
                })
                setData(result)
            } catch (error) {
                console.error('Error fetching pathology data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPathologyData()
    }, [organ, pathology])

    const toggleFaq = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index)
    }

    if (!pathology) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                Selecione uma patologia para ver informações
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <LoadingSpinner />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                Informações não disponíveis
            </div>
        )
    }

    return (
        <div className="bg-white">
            <div className="mb-8">
                <p className="text-gray-600">{data.description}</p>
            </div>

            <h3 className="text-xl font-medium text-gray-800 mb-4">PERGUNTAS FREQUENTES</h3>

            <div className="border-t border-gray-200">
                {data.faq.map((item, index) => {
                    const isOpen = expandedIndex === index

                    return (
                        <div
                            key={index}
                            className={`border-b border-gray-200 ${isOpen ? 'bg-white' : 'hover:bg-gray-50'}`}
                        >
                            <div
                                onClick={() => toggleFaq(index)}
                                className="flex items-center justify-between cursor-pointer py-4"
                            >
                                <p className="text-gray-700 pr-4">{item.question}</p>
                                <div className="flex-shrink-0 pr-2">
                                    {isOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {isOpen && (
                                <div className="pb-4 pr-4 text-gray-600">
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
} 