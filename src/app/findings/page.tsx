'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

// Import system icons
import sistemaNervosoIcon from '../assets/icons/sistema-nervoso-icon.svg'
import sistemaRespiratorioIcon from '../assets/icons/sistema-respiratorio-icon.svg'
import sistemaCirculatorioIcon from '../assets/icons/sistema-circulatorio-icon.svg'
import sistemaEndocrinoIcon from '../assets/icons/sistema-endocrino-icon.svg'
import sistemaUrinarioIcon from '../assets/icons/sistema-urinario-icon.svg'
import sistemaReprodutivoIcon from '../assets/icons/sistema-reprodutivo-icon.svg'
import sistemaDigestivoIcon from '../assets/icons/sistema-digestivo-icon.svg'
import sistemaMusculoesqueleticoIcon from '../assets/icons/sistema-musculoesqueletico-icon.svg'

// Types
type SystemType = 'nervoso' | 'respiratorio' | 'circulatorio' | 'endocrino' | 'urinario' | 'reprodutivo' | 'digestivo' | 'musculoesqueletico'

interface SystemInfo {
    name: string
    icon: any
    findings: number
}

interface Organ {
    id: number
    system: string
    key: string
    label: string
    active: boolean
    isSystemDefault: boolean
}

interface Pathology {
    id: number
    system: string
    organ: string
    key: string
    label: string
    active: boolean
    isSystemDefault: boolean
}

interface Finding {
    id: number
    title: string
    description: string
    type: 'informativa' | 'menor' | 'maior'
}

// Custom CollapsibleItem component
interface CollapsibleItemProps {
    title: string
    subtitle?: {
        text: string
        color: string
    } | null
    isOpen: boolean
    onToggle: () => void
    children?: React.ReactNode
    level?: number
    icon?: any
    customStyle?: string
}

const CollapsibleItem = ({
    title,
    subtitle = null,
    isOpen,
    onToggle,
    children,
    level = 0,
    icon = null,
    customStyle = ""
}: CollapsibleItemProps) => {
    return (
        <div className="mb-1">
            <div
                onClick={onToggle}
                className={`flex items-center justify-between cursor-pointer py-2 hover:bg-gray-50 rounded-md ${customStyle}`}
            >
                <div className="flex items-center gap-3">
                    {icon && (
                        <div className="flex-shrink-0">
                            <Image src={icon} alt="" width={36} height={36} />
                        </div>
                    )}
                    <div style={{ paddingLeft: level * 16 }}>
                        <p className="text-gray-700">{title}</p>
                        {subtitle && <p className={subtitle.color}>{subtitle.text}</p>}
                    </div>
                </div>
                <div className="pr-2">
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
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden pl-4"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const systems: Record<SystemType, SystemInfo> = {
    nervoso: {
        name: 'Sistema Nervoso',
        icon: sistemaNervosoIcon,
        findings: 4
    },
    respiratorio: {
        name: 'Sistema Respiratório',
        icon: sistemaRespiratorioIcon,
        findings: 1
    },
    circulatorio: {
        name: 'Sistema Circulatório',
        icon: sistemaCirculatorioIcon,
        findings: 1
    },
    endocrino: {
        name: 'Sistema Endócrino',
        icon: sistemaEndocrinoIcon,
        findings: 0
    },
    urinario: {
        name: 'Sistema Urinário',
        icon: sistemaUrinarioIcon,
        findings: 1
    },
    reprodutivo: {
        name: 'Sistema Reprodutivo',
        icon: sistemaReprodutivoIcon,
        findings: 1
    },
    digestivo: {
        name: 'Sistema Digestivo',
        icon: sistemaDigestivoIcon,
        findings: 0
    },
    musculoesqueletico: {
        name: 'Sistema Musculoesquelético',
        icon: sistemaMusculoesqueleticoIcon,
        findings: 0
    }
}

export default function FindingsPage() {
    const [expandedSystems, setExpandedSystems] = useState<string[]>(['nervoso'])
    const [expandedOrgans, setExpandedOrgans] = useState<string[]>([])
    const [expandedPathologies, setExpandedPathologies] = useState<string[]>([])
    const [selectedSystem, setSelectedSystem] = useState<string>('Sistema Nervoso')
    const [organs, setOrgans] = useState<Organ[]>([])
    const [pathologies, setPathologies] = useState<Record<string, Pathology[]>>({})
    const [findings, setFindings] = useState<Record<string, Finding[]>>({})
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        // Load organs for the selected system
        const fetchOrgans = async () => {
            try {
                setLoading(true)
                const result = await api.get(`/system/organs?system=${selectedSystem}`)
                setOrgans(result || [])
            } catch (error) {
                console.error('Error fetching organs:', error)
                // Mock data for now
                if (selectedSystem === 'Sistema Nervoso') {
                    setOrgans([
                        { id: 1, system: 'Sistema Nervoso', key: 'cerebro', label: 'Cérebro', active: true, isSystemDefault: true },
                        { id: 2, system: 'Sistema Nervoso', key: 'coluna', label: 'Coluna', active: true, isSystemDefault: true }
                    ])
                } else if (selectedSystem === 'Sistema Urinário') {
                    setOrgans([
                        { id: 12, system: 'Sistema Urinário', key: 'rins', label: 'Rins', active: true, isSystemDefault: true },
                        { id: 13, system: 'Sistema Urinário', key: 'bexiga-e-ureteres', label: 'Bexiga e ureteres', active: true, isSystemDefault: true }
                    ])
                } else {
                    setOrgans([])
                }
            } finally {
                setLoading(false)
            }
        }

        fetchOrgans()
    }, [selectedSystem])

    const handleSystemToggle = (systemKey: string) => {
        setExpandedSystems(prev => {
            if (prev.includes(systemKey)) {
                return prev.filter(key => key !== systemKey)
            } else {
                return [...prev, systemKey]
            }
        })

        const system = systems[systemKey as SystemType]
        if (system) {
            setSelectedSystem(system.name)
        }
    }

    const handleOrganToggle = async (organKey: string, organLabel: string) => {
        setExpandedOrgans(prev => {
            if (prev.includes(organKey)) {
                return prev.filter(key => key !== organKey)
            } else {
                return [...prev, organKey]
            }
        })

        // Fetch pathologies for this organ if not already fetched
        if (!pathologies[organKey]) {
            try {
                setLoading(true)
                const result = await api.get(`/system/pathologies?system=${selectedSystem}&organ=${organLabel}`)
                setPathologies(prev => ({ ...prev, [organKey]: result || [] }))
            } catch (error) {
                console.error('Error fetching pathologies:', error)
                // Mock data
                if (organLabel === 'Coluna') {
                    setPathologies(prev => ({
                        ...prev,
                        [organKey]: [
                            { id: 101, system: selectedSystem, organ: organLabel, key: 'hemangioma', label: 'Hemangioma', active: true, isSystemDefault: true },
                            { id: 102, system: selectedSystem, organ: organLabel, key: 'espondiloartropatia-cervical', label: 'Espondiloartropatia da coluna cervical', active: true, isSystemDefault: true },
                            { id: 103, system: selectedSystem, organ: organLabel, key: 'espondiloartropatia-lombar', label: 'Espondiloartropatia da coluna lombar', active: true, isSystemDefault: true }
                        ]
                    }))
                } else if (organLabel === 'Rins') {
                    setPathologies(prev => ({
                        ...prev,
                        [organKey]: [
                            { id: 201, system: selectedSystem, organ: organLabel, key: 'cisto-simples-do-rim', label: 'Cisto simples do rim', active: true, isSystemDefault: true },
                            { id: 202, system: selectedSystem, organ: organLabel, key: 'rim-ausente', label: 'Rim ausente', active: true, isSystemDefault: true }
                        ]
                    }))
                } else {
                    setPathologies(prev => ({ ...prev, [organKey]: [] }))
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const handlePathologyToggle = async (pathologyKey: string) => {
        setExpandedPathologies(prev => {
            if (prev.includes(pathologyKey)) {
                return prev.filter(key => key !== pathologyKey)
            } else {
                return [...prev, pathologyKey]
            }
        })

        // Mock findings for now
        if (!findings[pathologyKey]) {
            setFindings(prev => ({
                ...prev,
                [pathologyKey]: [
                    { id: 1, title: 'Achado menor', description: 'Descrição do achado menor', type: 'menor' },
                    { id: 2, title: 'Achado informativo', description: 'Descrição do achado informativo', type: 'informativa' }
                ]
            }))
        }
    }

    const getFindingsText = (count: number) => {
        if (count === 0) return 'Nenhum resultado adverso'
        return count === 1
            ? '1 pequena descoberta'
            : `${count} pequenas descobertas`
    }

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <div className="w-[360px] border-r border-gray-200 overflow-y-auto p-4">
                <h1 className="text-xl text-gray-700 font-normal mb-6">SUAS DESCOBERTAS</h1>
                <div className="relative mb-8">
                    <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gradient-to-r from-green-200 via-amber-200 to-green-200 bg-[length:100%_1px] bg-bottom bg-no-repeat"
                        defaultValue="14 de maio de 2024 (Verificação mais recente)"
                    >
                        <option>14 de maio de 2024 (Verificação mais recente)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1">
                    {Object.keys(systems).map((systemKey) => {
                        const system = systems[systemKey as SystemType]
                        const isSystemOpen = expandedSystems.includes(systemKey)

                        return (
                            <CollapsibleItem
                                key={systemKey}
                                title={system.name}
                                subtitle={{
                                    text: getFindingsText(system.findings),
                                    color: system.findings > 0 ? 'text-xs text-amber-500' : 'text-xs text-green-500'
                                }}
                                isOpen={isSystemOpen}
                                onToggle={() => handleSystemToggle(systemKey)}
                                icon={system.icon}
                            >
                                {system.name === selectedSystem && organs.map((organ) => {
                                    const isOrganOpen = expandedOrgans.includes(organ.key)

                                    return (
                                        <CollapsibleItem
                                            key={organ.key}
                                            title={organ.label}
                                            isOpen={isOrganOpen}
                                            onToggle={() => handleOrganToggle(organ.key, organ.label)}
                                            level={1}
                                        >
                                            {pathologies[organ.key]?.map((pathology) => {
                                                const isPathologyOpen = expandedPathologies.includes(pathology.key)
                                                const findingCount = findings[pathology.key]?.length || 0

                                                return (
                                                    <CollapsibleItem
                                                        key={pathology.key}
                                                        title={pathology.label}
                                                        subtitle={
                                                            findingCount > 0
                                                                ? {
                                                                    text: `( ${findingCount} ${findingCount === 1 ? 'achado menor' : 'achados menores'} )`,
                                                                    color: 'text-xs text-amber-500'
                                                                }
                                                                : null
                                                        }
                                                        isOpen={isPathologyOpen}
                                                        onToggle={() => handlePathologyToggle(pathology.key)}
                                                        level={2}
                                                    >
                                                        {findings[pathology.key]?.map((finding) => (
                                                            <div
                                                                key={`finding-${finding.id}`}
                                                                className="py-2 pl-4"
                                                            >
                                                                <p className={`text-sm ${finding.type === 'informativa' ? 'text-blue-500' : 'text-amber-500'}`}>
                                                                    {finding.title}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </CollapsibleItem>
                                                )
                                            })}
                                        </CollapsibleItem>
                                    )
                                })}
                            </CollapsibleItem>
                        )
                    })}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6">
                <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-600">Content area for findings details will be implemented in the next step</p>
                </div>
            </div>
        </div>
    )
}