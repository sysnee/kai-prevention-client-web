import api from "@/lib/api"

export async function getOrgans(system: string) {
    const response = await api.get(`/system/organs?system=${system}`)
    return response
}

export async function getPathologies(system: string, organ: string, active?: boolean) {
    const response = await api.get(`/system/pathologies?system=${system}&organ=${organ}${active ? "&active=true" : ""}`)
    return response
}

export async function getMedicalReportPDF(id: string) {
    const response = await api.get(`/findings/service-request/${id}/report`)
    return response
}

export async function getServiceRequest(id: string) {
    const response = await api.get(`/service-requests/${id}`)
    return response
}
