export type Severity = 'none' | 'low' | 'medium' | 'high' | 'severe'

export const severityColors = {
    'none': 'rgba(21, 122, 237, 1)',
    'low': 'rgba(253, 224, 71, 1)',
    'medium': 'rgba(245, 158, 11, 1)',
    'high': 'rgba(244, 63, 94, 1)',
    'severe': 'rgba(0, 0, 0, 1)',
}

export const getSeverityText = (severity: Severity) => {
    switch (severity) {
        case 'none': return 'informativa'
        case 'low': return 'menor'
        case 'medium': return 'moderada'
        case 'high': return 'maior'
        case 'severe': return 'severa'
        default: return 'menor'
    }
}