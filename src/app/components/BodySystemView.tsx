'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { severityColors } from '../constants'
import sistemaNervosoIcon from '../assets/icons/sistema-nervoso-icon.svg'
import sistemaRespiratorioIcon from '../assets/icons/sistema-respiratorio-icon.svg'
import sistemaCirculatorioIcon from '../assets/icons/sistema-circulatorio-icon.svg'
import sistemaEndocrinoIcon from '../assets/icons/sistema-endocrino-icon.svg'
import sistemaUrinarioIcon from '../assets/icons/sistema-urinario-icon.svg'
import sistemaReprodutivoIcon from '../assets/icons/sistema-reprodutivo-icon.svg'
import sistemaDigestivoIcon from '../assets/icons/sistema-digestivo-icon.svg'
import sistemaMusculoesqueleticoIcon from '../assets/icons/sistema-musculoesqueletico-icon.svg'

import sistemaNervosoImg from '../assets/illustrations/sistema-nervoso-img.png'
import sistemaRespiratorioImg from '../assets/illustrations/sistema-respiratorio-img.png'
import sistemaCirculatorioImg from '../assets/illustrations/sistema-circulatorio-img.png'
import sistemaEndocrinoImg from '../assets/illustrations/sistema-endocrino-img.png'
import sistemaUrinarioImg from '../assets/illustrations/sistema-urinario-img.png'
import sistemaReprodutivoImg from '../assets/illustrations/sistema-reprodutivo-masculino-img.png'
import sistemaDigestivoImg from '../assets/illustrations/sistema-digestivo-img.png'
import sistemaMusculoesqueleticoImg from '../assets/illustrations/sistema-musculoesqueletico-img.png'
import scanImage from '../assets/scan-1.jpg'

type SystemType = 'nervoso' | 'respiratorio' | 'circulatorio' | 'endocrino' | 'urinario' | 'reprodutivo' | 'digestivo' | 'musculoesqueletico'

interface FindingSummary {
    system: string;
    findingsCount: number;
    severity: string;
}

interface SystemInfo {
    name: string
    icon: any
    imagePath: any
    key: SystemType
    findingsCount: number
    severity: string
}

const systemsMapping: Record<SystemType, Omit<SystemInfo, 'findingsCount' | 'severity'>> = {
    nervoso: {
        name: 'Sistema Nervoso',
        icon: sistemaNervosoIcon,
        imagePath: sistemaNervosoImg,
        key: 'nervoso'
    },
    respiratorio: {
        name: 'Sistema Respiratório',
        icon: sistemaRespiratorioIcon,
        imagePath: sistemaRespiratorioImg,
        key: 'respiratorio'
    },
    circulatorio: {
        name: 'Sistema Circulatório',
        icon: sistemaCirculatorioIcon,
        imagePath: sistemaCirculatorioImg,
        key: 'circulatorio'
    },
    endocrino: {
        name: 'Sistema Endócrino',
        icon: sistemaEndocrinoIcon,
        imagePath: sistemaEndocrinoImg,
        key: 'endocrino'
    },
    urinario: {
        name: 'Sistema Urinário',
        icon: sistemaUrinarioIcon,
        imagePath: sistemaUrinarioImg,
        key: 'urinario'
    },
    reprodutivo: {
        name: 'Sistema Reprodutivo',
        icon: sistemaReprodutivoIcon,
        imagePath: sistemaReprodutivoImg,
        key: 'reprodutivo'
    },
    digestivo: {
        name: 'Sistema Digestivo',
        icon: sistemaDigestivoIcon,
        imagePath: sistemaDigestivoImg,
        key: 'digestivo'
    },
    musculoesqueletico: {
        name: 'Sistema Musculoesquelético',
        icon: sistemaMusculoesqueleticoIcon,
        imagePath: sistemaMusculoesqueleticoImg,
        key: 'musculoesqueletico'
    }
}

export default function BodySystemView({ reportId, studyId }: { reportId: string, studyId: string }) {
    const [activeSystem, setActiveSystem] = useState<SystemType>('nervoso')
    const [systems, setSystems] = useState<Record<SystemType, SystemInfo>>({} as Record<SystemType, SystemInfo>)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchFindingsSummary = async () => {
            try {
                setLoading(true)
                const response = await api.get(`/findings/summary?reportId=${reportId}`) as FindingSummary[]

                // Initialize systems with data from mapping and 0 findings
                const initialSystems: Record<SystemType, SystemInfo> = {} as Record<SystemType, SystemInfo>;

                Object.entries(systemsMapping).forEach(([key, info]) => {
                    initialSystems[key as SystemType] = {
                        ...info,
                        findingsCount: 0,
                        severity: 'none'
                    };
                });

                // Update findings count from API response
                response.forEach(finding => {
                    // Find the system key that matches the system name
                    const systemKey = Object.keys(initialSystems).find(
                        key => initialSystems[key as SystemType].name === finding.system
                    ) as SystemType | undefined;

                    if (systemKey) {
                        initialSystems[systemKey].findingsCount = finding.findingsCount;
                        initialSystems[systemKey].severity = finding.severity;
                    }
                });

                setSystems(initialSystems);
                setError(null);
            } catch (err) {
                setError('Falha ao carregar o resumo dos achados')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (reportId) {
            fetchFindingsSummary()
        }
    }, [reportId])

    const getFindingsText = (count: number) => {
        if (count === 0) return 'Nenhum resultado adverso'
        return count === 1
            ? '1 pequena descoberta'
            : `${count} pequenas descobertas`
    }

    // Split systems into left and right columns
    const leftSystems: SystemType[] = ['nervoso', 'respiratorio', 'circulatorio', 'endocrino'];
    const rightSystems: SystemType[] = ['urinario', 'reprodutivo', 'digestivo', 'musculoesqueletico'];

    const handleSystemClick = (systemKey: SystemType) => {
        router.push(`/findings?reportId=${reportId}&system=${systems[systemKey].name}`)
    }

    // Helper function to get the proper color based on severity
    const getSeverityTextColor = (severity: string = 'none'): string => {
        if (severity === 'none') return 'text-blue-500';
        if (severity === 'low') return 'text-yellow-500';
        if (severity === 'medium') return 'text-amber-500';
        if (severity === 'high') return 'text-red-500';
        if (severity === 'severe') return 'text-black';
        return 'text-green-500';
    }

    const renderSystemButton = (systemKey: SystemType) => {
        if (loading || !systems[systemKey]) {
            return (
                <div key={systemKey} className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse"></div>
                    <div>
                        <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            );
        }

        const system = systems[systemKey];
        const isActive = activeSystem === systemKey;

        return (
            <div
                key={systemKey}
                className={`flex items-center gap-3 cursor-pointer mb-4 transition-colors duration-200 ${isActive ? 'opacity-80' : 'opacity-100'}`}
                onMouseEnter={() => setActiveSystem(systemKey)}
                onClick={() => handleSystemClick(systemKey)}
            >
                <Image
                    src={system.icon}
                    alt={system.name}
                    width={44}
                    height={44}
                />
                <div>
                    <p className="text-gray-700 text-sm">{system.name}</p>
                    <p className={`text-xs ${system.findingsCount > 0 ? getSeverityTextColor(system.severity) : 'text-green-500'}`}>
                        {getFindingsText(system.findingsCount)}
                    </p>
                </div>
            </div>
        );
    };

    const getActiveSystemImage = () => {
        if (loading || !systems[activeSystem]) {
            return null;
        }
        return systems[activeSystem].imagePath;
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-xl shadow-sm p-8">
            <div className="md:w-3/2 flex flex-col md:relative md:after:absolute md:after:right-0 md:after:top-0 md:after:bottom-0 md:after:w-[1px] md:after:bg-gradient-to-b md:after:from-green-200 md:after:via-amber-200 md:after:to-green-200 md:pr-8">
                <div className="mb-8">
                    <h2 className="text-gray-700 text-xl mb-2">Resultados</h2>
                    <p className="text-gray-600 text-sm">
                        Este relatório foi criado pela Kai Prevention Center para você, apenas para fins informativos, e
                        é baseado nas informações contidas no relatório médico oficial.
                    </p>
                </div>

                <div className="flex flex-row justify-between mb-6">
                    <div className="flex flex-col justify-between">
                        {leftSystems.map(renderSystemButton)}
                    </div>

                    <div className="relative h-[450px] w-48 mx-2">
                        {getActiveSystemImage() && (
                            <Image
                                src={getActiveSystemImage()}
                                alt={`Ilustração ${loading || !systems[activeSystem] ? '' : systems[activeSystem].name}`}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="transition-opacity duration-300"
                            />
                        )}
                    </div>

                    <div className="flex flex-col justify-between">
                        {rightSystems.map(renderSystemButton)}
                    </div>
                </div>

                <div className="text-xs text-center text-gray-500 mt-4">
                    Esta ilustração é apenas para fins educacionais
                </div>
            </div>

            <div className="md:w-1/2 flex flex-col md:pl-8">
                <h2 className="text-xl text-gray-700 mb-4 text-center">IMAGENS MÉDICAS E RELATÓRIO</h2>

                <div className="relative h-80 mb-8">
                    <Image
                        src={scanImage}
                        alt="Imagem médica"
                        fill
                        style={{ objectFit: 'contain' }}
                    />

                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                        aria-label="Imagem anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2"
                        aria-label="Próxima imagem"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <a href={`/medical-report/${studyId}`} className="border-[1px] bg-gradient-to-r p-[1px] from-green-200 via-amber-200 to-green-200 rounded-full mb-8">
                    <span className="block bg-white rounded-full py-2 px-4 text-center text-sm text-gray-600">
                        Ver todas as imagens
                    </span>
                </a>

                <div className="mt-4">
                    <h3 className="text-gray-700 mb-2">Relatório</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Este relatório médico/radiológico original preparado por e para médicos.
                    </p>

                    <div className="flex flex-col space-y-3">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'}/findings/service-request/${studyId}/report`, '_blank');
                            }}
                            className="text-blue-500 hover:underline text-sm"
                        >
                            Ver Relatório Médico Oficial
                        </a>
                        <a href="#" className="text-blue-500 hover:underline text-sm">Baixar imagens como DICOM</a>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-gray-700 mb-2">Outros arquivos</h3>
                    <div className="flex flex-col space-y-3">
                        <a href="#" className="text-blue-500 hover:underline text-sm">Ver recibo de digitalização</a>
                        <a href="#" className="text-blue-500 hover:underline text-sm">Ver Formulário de Histórico Médico</a>
                    </div>
                </div>
            </div>
        </div>
    )
} 