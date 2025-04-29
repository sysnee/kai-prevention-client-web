'use client'

interface Tab {
    id: string
    label: string
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
    className?: string
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <div className="flex gap-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`pb-2 px-1 font-medium ${activeTab === tab.id
                            ? 'border-b-2 border-kai-primary text-kai-primary'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
} 