'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface CollapsibleItemProps {
    title: string
    subtitle?: {
        text: string
        color: string
    } | null
    isOpen: boolean
    onToggle: () => void
    children?: ReactNode
    level?: number
    icon?: any
    customStyle?: string
}

export default function CollapsibleItem({
    title,
    subtitle,
    isOpen,
    onToggle,
    children,
    level = 0,
    icon = null,
    customStyle = ""
}: CollapsibleItemProps) {
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