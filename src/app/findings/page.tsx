'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import api from '@/lib/api'
import CollapsibleItem from '../components/CollapsibleItem'
import FindingCard from '../components/FindingCard'

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
type Severity = 'none' | 'low' | 'medium' | 'high' | 'severe'

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

export const LoadingSpinner = () => (
    <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
    </div>
)

export default function FindingsPage({ searchParams }: { searchParams: { reportId: string, system: string, organ?: string, pathology?: string } }) {
    const router = useRouter()
    const pathname = usePathname()
    const [expandedSystems, setExpandedSystems] = useState<string[]>([])
    const [expandedOrgans, setExpandedOrgans] = useState<string[]>([])
    const [expandedPathologies, setExpandedPathologies] = useState<string[]>([])
    const [selectedSystem, setSelectedSystem] = useState<string>('')
    const [organs, setOrgans] = useState<Organ[]>([])
    const [pathologies, setPathologies] = useState<Record<string, Pathology[]>>({})
    const [findings, setFindings] = useState<Record<string, Finding[]>>({})
    const [currentFindings, setCurrentFindings] = useState<Finding[]>([])
    const [loadingOrgans, setLoadingOrgans] = useState<boolean>(false)
    const [loadingPathologies, setLoadingPathologies] = useState<Record<string, boolean>>({})
    const [loadingFindings, setLoadingFindings] = useState<boolean>(false)

    // Initialize state based on URL params
    useEffect(() => {
        if (searchParams.system) {
            const systemKey = Object.keys(systems).find(key =>
                systems[key as SystemType].name === searchParams.system
            )
            if (systemKey) {
                setExpandedSystems([systemKey])
                setSelectedSystem(searchParams.system)
            }
        }
    }, [searchParams.system])

    // Fetch findings based on URL params
    useEffect(() => {
        const fetchFindings = async () => {
            if (!searchParams.reportId) return

            try {
                setLoadingFindings(true)
                const params: any = { reportId: searchParams.reportId }

                if (searchParams.system) params.system = searchParams.system
                if (searchParams.organ) params.organ = searchParams.organ
                if (searchParams.pathology) params.pathology = searchParams.pathology

                const result = await api.get('/findings', { params })
                if (result && result.data) {
                    setCurrentFindings(result.data)
                }
            } catch (error) {
                console.error('Error fetching findings:', error)
            } finally {
                setLoadingFindings(false)
            }
        }

        fetchFindings()
    }, [searchParams.reportId, searchParams.system, searchParams.organ, searchParams.pathology])

    useEffect(() => {
        // Clear previous organs when switching systems
        setOrgans([])
        setExpandedOrgans([])

        // Load organs for the selected system
        const fetchOrgans = async () => {
            if (!selectedSystem) return

            try {
                setLoadingOrgans(true)
                const result = await api.get(`/system/organs?system=${selectedSystem}`)
                setOrgans(result || [])

                // If organ param is present, expand it
                if (searchParams.organ) {
                    const organKey = result?.find((o: Organ) => o.label === searchParams.organ)?.key
                    if (organKey) {
                        setExpandedOrgans([organKey])
                    }
                }
            } catch (error) {
                console.error('Error fetching organs:', error)
            } finally {
                setLoadingOrgans(false)
            }
        }

        fetchOrgans()
    }, [selectedSystem, searchParams.organ])

    const updateUrlParams = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams()

        // Always include reportId
        if (searchParams.reportId) {
            params.set('reportId', searchParams.reportId)
        }

        // Update with new params
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleSystemToggle = (systemKey: string) => {
        setExpandedSystems(prev => {
            // If clicking an already open system, just close it
            if (prev.includes(systemKey)) {
                return prev.filter(key => key !== systemKey)
            }

            // Open the clicked system and close others
            const system = systems[systemKey as SystemType]
            if (system) {
                setSelectedSystem(system.name)

                // Update URL with system param
                updateUrlParams({
                    system: system.name,
                    organ: undefined,
                    pathology: undefined
                })
            }
            return [systemKey]
        })
    }

    const handleOrganToggle = async (organKey: string, organLabel: string) => {
        setExpandedOrgans(prev => {
            if (prev.includes(organKey)) {
                const newOrgans = prev.filter(key => key !== organKey)

                // Update URL, removing organ param if closing
                updateUrlParams({
                    system: selectedSystem,
                    organ: undefined,
                    pathology: undefined
                })

                return newOrgans
            } else {
                // Update URL with organ param
                updateUrlParams({
                    system: selectedSystem,
                    organ: organLabel,
                    pathology: undefined
                })

                return [...prev, organKey]
            }
        })

        // Fetch pathologies for this organ if not already fetched
        if (!pathologies[organKey]) {
            try {
                setLoadingPathologies(prev => ({ ...prev, [organKey]: true }))
                const result = await api.get(`/system/pathologies?system=${selectedSystem}&organ=${organLabel}`)

                setPathologies(prev => ({ ...prev, [organKey]: result || [] }))

                // If pathology param is present, expand it
                if (searchParams.pathology) {
                    const pathologyKey = result?.find((p: Pathology) => p.label === searchParams.pathology)?.key
                    if (pathologyKey) {
                        setExpandedPathologies([pathologyKey])
                    }
                }

                setLoadingPathologies(prev => ({ ...prev, [organKey]: false }))
            } catch (error) {
                console.error('Error fetching pathologies:', error)
            }
        }
    }

    const handlePathologyToggle = async (pathologyKey: string, pathologyLabel: string, organLabel: string) => {
        setExpandedPathologies(prev => {
            if (prev.includes(pathologyKey)) {
                const newPathologies = prev.filter(key => key !== pathologyKey)

                // Update URL, removing pathology param if closing
                updateUrlParams({
                    system: selectedSystem,
                    organ: organLabel,
                    pathology: undefined
                })

                return newPathologies
            } else {
                // Update URL with pathology param
                updateUrlParams({
                    system: selectedSystem,
                    organ: organLabel,
                    pathology: pathologyLabel
                })

                return [...prev, pathologyKey]
            }
        })
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
                                {loadingOrgans ? (
                                    <LoadingSpinner />
                                ) : (
                                    system.name === selectedSystem && organs.map((organ) => {
                                        const isOrganOpen = expandedOrgans.includes(organ.key)

                                        return (
                                            <CollapsibleItem
                                                key={organ.key}
                                                title={organ.label}
                                                isOpen={isOrganOpen}
                                                onToggle={() => handleOrganToggle(organ.key, organ.label)}
                                                level={1}
                                            >
                                                {loadingPathologies[organ.key] ? (
                                                    <LoadingSpinner />
                                                ) : (
                                                    pathologies[organ.key]?.map((pathology) => {
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
                                                                onToggle={() => handlePathologyToggle(pathology.key, pathology.label, organ.label)}
                                                                // onToggle={() => { }}
                                                                level={2}
                                                            >
                                                                {findings[pathology.key]?.map((finding) => (
                                                                    <div
                                                                        key={`finding-${finding.id}`}
                                                                        className="py-2 pl-4"
                                                                    >
                                                                        <p className={`text-sm ${finding.severity === 'none' ? 'text-blue-500' : 'text-amber-500'
                                                                            }`}>
                                                                            {finding.pathology}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </CollapsibleItem>
                                                        )
                                                    })
                                                )}
                                            </CollapsibleItem>
                                        )
                                    })
                                )}
                            </CollapsibleItem>
                        )
                    })}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6">
                <div className="flex-1 max-w-2xl">
                    {loadingFindings ? (
                        <div className="flex justify-center items-center h-60">
                            <LoadingSpinner />
                        </div>
                    ) : currentFindings.length > 0 ? (
                        <div>
                            {currentFindings.map(finding => (
                                <FindingCard key={finding.id} finding={finding} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-600">
                            Selecione um achado para ver os detalhes
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}