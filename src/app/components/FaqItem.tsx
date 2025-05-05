'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FaqItemProps {
    question: string
    answer: string
}

export default function FaqItem({ question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border-b border-gray-200">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between cursor-pointer py-4 hover:bg-gray-50"
            >
                <p className="text-gray-700 pr-4">{question}</p>
                <div className="flex-shrink-0">
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                        className="overflow-hidden pb-4 text-gray-600"
                    >
                        <p>{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 