'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import CollapsibleItem from '../components/CollapsibleItem'
import FindingCard from '../components/FindingCard'
import { debounce } from 'lodash'
import { severityColors } from '../constants'

// Import system icons
import sistemaNervosoIcon from '../assets/icons/sistema-nervoso-icon.svg'
import sistemaRespiratorioIcon from '../assets/icons/sistema-respiratorio-icon.svg'
import sistemaCirculatorioIcon from '../assets/icons/sistema-circulatorio-icon.svg'
import sistemaEndocrinoIcon from '../assets/icons/sistema-endocrino-icon.svg'
import sistemaUrinarioIcon from '../assets/icons/sistema-urinario-icon.svg'
import sistemaReprodutivoIcon from '../assets/icons/sistema-reprodutivo-icon.svg'
import sistemaDigestivoIcon from '../assets/icons/sistema-digestivo-icon.svg'
import sistemaMusculoesqueleticoIcon from '../assets/icons/sistema-musculoesqueletico-icon.svg'
import { LoadingSpinner } from '../components/LoadingSpinner'

// Types
type SystemType = 'nervoso' | 'respiratorio' | 'circulatorio' | 'endocrino' | 'urinario' | 'reprodutivo' | 'digestivo' | 'musculoesqueletico'
type Severity = 'none' | 'low' | 'medium' | 'high' | 'severe'

interface FindingSummary {
    system: string;
    findingsCount: number;
    severity: string;
}

interface OrganFindingSummary {
    organ: string;
    findingsCount: number;
    severity: string;
}

interface PathologyFindingSummary {
    pathology: string;
    findingsCount: number;
    severity: string;
}

interface SystemInfo {
    name: string
    icon: any
    findingsCount: number
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

const systemsMapping: Record<SystemType, Omit<SystemInfo, 'findingsCount'>> = {
    nervoso: {
        name: 'Sistema Nervoso',
        icon: sistemaNervosoIcon,
    },
    respiratorio: {
        name: 'Sistema Respiratório',
        icon: sistemaRespiratorioIcon,
    },
    circulatorio: {
        name: 'Sistema Circulatório',
        icon: sistemaCirculatorioIcon,
    },
    endocrino: {
        name: 'Sistema Endócrino',
        icon: sistemaEndocrinoIcon,
    },
    urinario: {
        name: 'Sistema Urinário',
        icon: sistemaUrinarioIcon,
    },
    reprodutivo: {
        name: 'Sistema Reprodutivo',
        icon: sistemaReprodutivoIcon,
    },
    digestivo: {
        name: 'Sistema Digestivo',
        icon: sistemaDigestivoIcon,
    },
    musculoesqueletico: {
        name: 'Sistema Musculoesquelético',
        icon: sistemaMusculoesqueleticoIcon,
    }
}

export default function FindingsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Get params safely
    const reportId = searchParams.get('reportId') || ''
    const systemParam = searchParams.get('system') || ''
    const organParam = searchParams.get('organ') || undefined
    const pathologyParam = searchParams.get('pathology') || undefined

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
    const [systems, setSystems] = useState<Record<SystemType, SystemInfo>>({} as Record<SystemType, SystemInfo>)
    const [systemSummaryData, setSystemSummaryData] = useState<Record<string, FindingSummary>>({})
    const [loadingSystems, setLoadingSystems] = useState<boolean>(true)
    const [organFindings, setOrganFindings] = useState<Record<string, OrganFindingSummary[]>>({})
    const [pathologyFindings, setPathologyFindings] = useState<Record<string, PathologyFindingSummary[]>>({})

    // Debounced URL update function to prevent multiple rapid updates
    const updateUrl = useCallback(
        debounce((params: Record<string, string | undefined>) => {
            const urlParams = new URLSearchParams()

            // Always include reportId
            if (reportId) {
                urlParams.set('reportId', reportId)
            }

            // Add other params only if they have values
            Object.entries(params).forEach(([key, value]) => {
                if (value) {
                    urlParams.set(key, value)
                }
            })

            const newUrl = `${pathname}?${urlParams.toString()}`
            router.push(newUrl, { scroll: false })
        }, 300),
        [pathname, router, reportId]
    )

    // Fetch all systems findings summary
    useEffect(() => {
        const fetchFindingsSummary = async () => {
            if (!reportId) return

            try {
                setLoadingSystems(true)
                const response = await api.get(`/findings/summary?reportId=${reportId}`) as FindingSummary[]

                // Initialize systems with data from mapping and 0 findings
                const initialSystems: Record<SystemType, SystemInfo> = {} as Record<SystemType, SystemInfo>;
                const summaryData: Record<string, FindingSummary> = {};

                Object.entries(systemsMapping).forEach(([key, info]) => {
                    initialSystems[key as SystemType] = {
                        ...info,
                        findingsCount: 0
                    };
                });

                // Update findings count from API response
                response.forEach(finding => {
                    // Find the system key that matches the system name
                    const systemKey = Object.keys(initialSystems).find(
                        key => initialSystems[key as SystemType].name === finding.system
                    );

                    if (systemKey) {
                        initialSystems[systemKey].findingsCount = finding.findingsCount;
                        summaryData[systemKey] = finding;
                    }
                });

                setSystems(initialSystems);
                setSystemSummaryData(summaryData);
            } catch (error) {
                console.error('Error fetching findings summary:', error)
            } finally {
                setLoadingSystems(false)
            }
        }

        if (reportId) {
            fetchFindingsSummary()
        }
    }, [reportId])

    // Initialize state based on URL params
    useEffect(() => {
        if (systemParam) {
            const systemKey = Object.keys(systemsMapping).find(key =>
                systemsMapping[key as SystemType].name === systemParam
            )
            if (systemKey) {
                setExpandedSystems([systemKey])
                setSelectedSystem(systemParam)
            }
        }
    }, [])

    // Effect to fetch findings when URL params change
    useEffect(() => {
        const fetchFindings = async () => {
            if (!reportId) return

            try {
                setLoadingFindings(true)
                const params: any = { reportId }

                if (systemParam) params.system = systemParam
                if (organParam) params.organ = organParam
                if (pathologyParam) params.pathology = pathologyParam

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
    }, [reportId, systemParam, organParam])

    // Load organs when system changes
    useEffect(() => {
        const fetchOrgans = async () => {
            if (!selectedSystem) return

            try {
                setLoadingOrgans(true)
                setOrgans([])

                const result = await api.get(`/system/organs?system=${selectedSystem}`)
                setOrgans(result || [])

                // Fetch organ findings summary
                try {
                    const organSummary = await api.get(`/findings/summary?reportId=${reportId}&system=${selectedSystem}`) as OrganFindingSummary[]
                    setOrganFindings(prev => ({
                        ...prev,
                        [selectedSystem]: organSummary || []
                    }))
                } catch (err) {
                    console.error('Error fetching organ findings summary:', err)
                }

                // If organ param is present, expand it
                if (organParam) {
                    const organKey = result?.find((o: Organ) => o.label === organParam)?.key
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
    }, [selectedSystem, reportId])

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

                // Update URL with new system and clear organ/pathology
                updateUrl({
                    system: system.name,
                    organ: undefined,
                    pathology: undefined
                })
            }
            return [systemKey]
        })
    }

    const handleOrganToggle = async (organKey: string, organLabel: string) => {
        const isClosing = expandedOrgans.includes(organKey)

        setExpandedOrgans(prev => {
            return isClosing
                ? prev.filter(key => key !== organKey)
                : [...prev, organKey]
        })

        // Update URL
        updateUrl({
            system: selectedSystem,
            organ: isClosing ? undefined : organLabel,
            pathology: undefined
        })

        // Fetch pathologies for this organ if not already fetched and we're opening
        if (!pathologies[organKey] && !isClosing) {
            try {
                setLoadingPathologies(prev => ({ ...prev, [organKey]: true }))

                const result = await api.get(`/system/pathologies?system=${selectedSystem}&organ=${organLabel}`)
                setPathologies(prev => ({ ...prev, [organKey]: result || [] }))

                // Fetch pathology findings summary
                try {
                    const pathologySummary = await api.get(`/findings/summary?reportId=${reportId}&system=${selectedSystem}&organ=${organLabel}`) as PathologyFindingSummary[]
                    setPathologyFindings(prev => ({
                        ...prev,
                        [`${selectedSystem}-${organLabel}`]: pathologySummary || []
                    }))
                } catch (err) {
                    console.error('Error fetching pathology findings summary:', err)
                }

                // If pathology param is present, expand it
                if (pathologyParam) {
                    const pathologyKey = result?.find((p: Pathology) => p.label === pathologyParam)?.key
                    if (pathologyKey) {
                        setExpandedPathologies([pathologyKey])
                    }
                }
            } catch (error) {
                console.error('Error fetching pathologies:', error)
            } finally {
                setLoadingPathologies(prev => ({ ...prev, [organKey]: false }))
            }
        }
    }

    const handlePathologyToggle = (pathologyKey: string, pathologyLabel: string, organLabel: string) => {
        const isClosing = expandedPathologies.includes(pathologyKey)

        setExpandedPathologies(prev => {
            return isClosing
                ? prev.filter(key => key !== pathologyKey)
                : [...prev, pathologyKey]
        })

        // Update URL
        updateUrl({
            system: selectedSystem,
            organ: organLabel,
            pathology: isClosing ? undefined : pathologyLabel
        })
    }

    const getFindingsText = (count: number) => {
        if (count === 0) return 'Nenhum resultado adverso'
        return count === 1
            ? '1 pequena descoberta'
            : `${count} pequenas descobertas`
    }

    // Helper function to get organ findings count
    const getOrganFindingsCount = (organLabel: string): number => {
        if (!selectedSystem || !organFindings[selectedSystem]) return 0

        const organSummary = organFindings[selectedSystem].find(
            summary => summary.organ === organLabel
        )

        return organSummary?.findingsCount || 0
    }

    // Helper function to get pathology findings count
    const getPathologyFindingsCount = (organLabel: string, pathologyLabel: string): number => {
        if (!selectedSystem || !pathologyFindings[`${selectedSystem}-${organLabel}`]) return 0

        const pathologySummary = pathologyFindings[`${selectedSystem}-${organLabel}`].find(
            summary => summary.pathology === pathologyLabel
        )

        return pathologySummary?.findingsCount || 0
    }

    // Helper function to get the proper color based on severity
    const getSeverityColor = (severity: string = 'none'): string => {
        return severity in severityColors
            ? `text-xs`
            : `text-xs text-green-500`;
    }

    const getSeverityTextColor = (severity: string = 'none'): string => {
        if (severity === 'none') return 'text-blue-500';
        if (severity === 'low') return 'text-yellow-500';
        if (severity === 'medium') return 'text-amber-500';
        if (severity === 'high') return 'text-red-500';
        if (severity === 'severe') return 'text-black';
        return 'text-green-500';
    }

    return (
        <div className="min-h-screen flex max-w-[1840px] mx-auto">
            {/* Sidebar */}
            <div className="w-[360px] border-r border-gray-200 overflow-y-auto p-4">
                <h1 className="text-xl text-gray-700 font-normal mb-6">SUAS DESCOBERTAS</h1>
                <div className="relative mb-8">
                    <select
                        className="w-full border border-gray-300 rounded-md py-2 px-3 appearance-none bg-gradient-to-r from-green-200 via-amber-200 to-green-200 bg-[length:100%_1px] bg-bottom bg-no-repeat"
                        defaultValue="14 de maio de 2024 (Verificação mais recente)"
                    >
                        <option>22 de abril de 2025 (Verificação mais recente)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-1">
                    {loadingSystems ? (
                        <LoadingSpinner />
                    ) : (
                        Object.keys(systems).map((systemKey) => {
                            const system = systems[systemKey as SystemType]
                            const isSystemOpen = expandedSystems.includes(systemKey)

                            return (
                                <CollapsibleItem
                                    key={systemKey}
                                    title={system.name}
                                    subtitle={{
                                        text: getFindingsText(system.findingsCount),
                                        color: system.findingsCount > 0
                                            ? getSeverityTextColor(systemSummaryData[systemKey]?.severity || 'none')
                                            : 'text-xs text-green-500'
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
                                            const organFindingsCount = getOrganFindingsCount(organ.label)

                                            return (
                                                <CollapsibleItem
                                                    key={organ.key}
                                                    title={organ.label}
                                                    subtitle={
                                                        organFindingsCount > 0
                                                            ? {
                                                                text: getFindingsText(organFindingsCount),
                                                                color: getSeverityTextColor(organFindings[selectedSystem]?.find(o => o.organ === organ.label)?.severity || 'none')
                                                            }
                                                            : {
                                                                text: 'Nenhum resultado adverso',
                                                                color: 'text-xs text-green-500'
                                                            }
                                                    }
                                                    isOpen={isOrganOpen}
                                                    onToggle={() => handleOrganToggle(organ.key, organ.label)}
                                                    level={1}
                                                >
                                                    {loadingPathologies[organ.key] ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        pathologies[organ.key]?.map((pathology) => {
                                                            const isPathologyOpen = expandedPathologies.includes(pathology.key)
                                                            const pathologyFindingsCount = getPathologyFindingsCount(organ.label, pathology.label)

                                                            return (
                                                                <CollapsibleItem
                                                                    key={pathology.key}
                                                                    title={pathology.label}
                                                                    subtitle={
                                                                        pathologyFindingsCount > 0
                                                                            ? {
                                                                                text: `${pathologyFindingsCount} ${pathologyFindingsCount === 1 ? 'achado menor' : 'achados menores'}`,
                                                                                color: getSeverityTextColor(pathologyFindings[`${selectedSystem}-${organ.label}`]?.find(p => p.pathology === pathology.label)?.severity || 'none')
                                                                            }
                                                                            : {
                                                                                text: 'Nenhum resultado adverso',
                                                                                color: 'text-xs text-green-500'
                                                                            }
                                                                    }
                                                                    isOpen={isPathologyOpen}
                                                                    onToggle={() => handlePathologyToggle(pathology.key, pathology.label, organ.label)}
                                                                    level={2}
                                                                >
                                                                    {findings[pathology.key]?.map((finding) => (
                                                                        <div
                                                                            key={`finding-${finding.id}`}
                                                                            className="py-2 pl-4"
                                                                        >
                                                                            <p className={`text-sm ${getSeverityTextColor(finding.severity)}`}>
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
                        })
                    )}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 p-6">
                <div className="flex-1 max-w-2xl">
                    {/* Breadcrumb */}
                    {selectedSystem && (
                        <div className="mb-4 text-sm text-gray-600">
                            <span>{selectedSystem}</span>
                            {organParam && (
                                <>
                                    <span className="mx-2">→</span>
                                    <span>{organParam}</span>
                                </>
                            )}
                        </div>
                    )}

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