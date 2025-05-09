'use client'

import { useState, useCallback } from 'react'
import { getSeverityText, severityColors } from '../constants'
import { Severity } from '../constants'
import { formatDateTime } from '../utils/formatters'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface Finding {
    id: string
    system: string
    organ: string
    pathology: string
    image_url: string | null
    details: string
    recommendation_title: string
    recommendation_description: string
    created_at: string
    updated_at: string
    severity: Severity
    report: {
        id: string
        status: string
        content: string
        createdAt: string
        updatedAt: string
    }
}

interface FindingCardProps {
    finding: Finding
}

export default function FindingCard({ finding }: FindingCardProps) {
    const [expanded, setExpanded] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const toggleExpand = useCallback(() => {
        setExpanded(!expanded)
    }, [expanded])

    return (
        <div className="relative mb-6 rounded-2xl p-[1px] overflow-hidden bg-gradient-to-r from-green-200 via-amber-200 to-amber-400">
            <div className="bg-white p-5 rounded-2xl">
                <div className="text-sm text-gray-500">{formatDateTime(finding.created_at)} / Varredura completa de corpo inteiro</div>
                <div className="mt-2 font-medium flex items-center">
                    {/* <div
                        className="ml-2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: severityColors[finding.severity] }}
                    ></div> */}
                    <span style={{ color: severityColors[finding.severity] }}>
                        1 descoberta {getSeverityText(finding.severity)}
                    </span>
                </div>
                <div className="mt-2 text-gray-400">
                    Detectamos um {finding.pathology.toLowerCase()}.
                </div>
                <div className="mt-2 text-gray-400">
                    {finding.details}
                </div>

                <div className="mt-4 flex justify-center">
                    <button
                        className="text-[#5B5B5F] text-sm font-semibold hover:underline focus:outline-none font-[Poppins-SemiBold sans-serif]"
                        onClick={toggleExpand}
                    >
                        {expanded ? '-Clique para ocultar' : '+Clique para expandir'}
                    </button>
                </div>

                {expanded && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-2">Recomendações</h3>
                        {finding.recommendation_title && (
                            <p className="text-sm mb-2">{finding.recommendation_title}</p>
                        )}
                        {finding.recommendation_description && (
                            <p className="text-sm">{finding.recommendation_description}</p>
                        )}
                        {!finding.recommendation_title && !finding.recommendation_description && (
                            <>
                                <p className="text-sm mb-2">Se você for assintomático, não será necessário acompanhamento.</p>
                                <p className="text-sm">Se você for assintomático, nenhuma ação é necessária. Se você tiver sintomas de dor nas costas no local do hemangioma, então você deve discutir essa descoberta com seu médico.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
} 