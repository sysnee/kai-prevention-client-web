'use client'

import { KeyboardArrowDown } from '@mui/icons-material'

interface Option {
    value: string
    label: string
}

interface GradientSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    label?: string
    className?: string
    placeholder?: string
}

export default function GradientSelect({
    options,
    value,
    onChange,
    label,
    className = '',
    placeholder = 'Select an option'
}: GradientSelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value)
    }

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm text-gray-600 mb-2">{label}</label>
            )}
            <div className="relative inline-block w-full">
                <select
                    value={value}
                    onChange={handleChange}
                    className="kai-gradient-input pr-8 py-2 appearance-none cursor-pointer w-full"
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <KeyboardArrowDown className="text-gray-400" />
                </div>
            </div>
        </div>
    )
} 