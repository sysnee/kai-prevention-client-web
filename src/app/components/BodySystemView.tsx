'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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

interface SystemInfo {
    name: string
    icon: any
    imagePath: any
    findings: number
}

const systems: Record<SystemType, SystemInfo> = {
    nervoso: {
        name: 'Sistema Nervoso',
        icon: sistemaNervosoIcon,
        imagePath: sistemaNervosoImg,
        findings: 4
    },
    respiratorio: {
        name: 'Sistema Respiratório',
        icon: sistemaRespiratorioIcon,
        imagePath: sistemaRespiratorioImg,
        findings: 1
    },
    circulatorio: {
        name: 'Sistema Circulatório',
        icon: sistemaCirculatorioIcon,
        imagePath: sistemaCirculatorioImg,
        findings: 1
    },
    endocrino: {
        name: 'Sistema Endócrino',
        icon: sistemaEndocrinoIcon,
        imagePath: sistemaEndocrinoImg,
        findings: 0
    },
    urinario: {
        name: 'Sistema Urinário',
        icon: sistemaUrinarioIcon,
        imagePath: sistemaUrinarioImg,
        findings: 1
    },
    reprodutivo: {
        name: 'Sistema Reprodutivo',
        icon: sistemaReprodutivoIcon,
        imagePath: sistemaReprodutivoImg,
        findings: 1
    },
    digestivo: {
        name: 'Sistema Digestivo',
        icon: sistemaDigestivoIcon,
        imagePath: sistemaDigestivoImg,
        findings: 0
    },
    musculoesqueletico: {
        name: 'Sistema Musculoesquelético',
        icon: sistemaMusculoesqueleticoIcon,
        imagePath: sistemaMusculoesqueleticoImg,
        findings: 0
    }
}

export default function BodySystemView({ reportId }: { reportId: string }) {
    const [activeSystem, setActiveSystem] = useState<SystemType>('nervoso')
    const router = useRouter()

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

    const renderSystemButton = (systemKey: SystemType) => {
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
                    <p className={`text-xs ${system.findings > 0 ? 'text-amber-500' : 'text-green-500'}`}>
                        {getFindingsText(system.findings)}
                    </p>
                </div>
            </div>
        );
    };

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
                        <Image
                            src={systems[activeSystem].imagePath}
                            alt={`Ilustração ${systems[activeSystem].name}`}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="transition-opacity duration-300"
                        />
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

                <button className="border border-gray-300 rounded-full py-2 px-4 text-sm text-gray-600 mx-auto">
                    Ver todas as imagens
                </button>
            </div>
        </div>
    )
} 