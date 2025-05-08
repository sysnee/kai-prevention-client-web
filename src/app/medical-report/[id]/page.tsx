"use client"

import { useEffect, useState } from "react"
import { getMedicalReportPDF, getServiceRequest } from "@/services/system"
import { use } from "react"
import Link from "next/link"
import { ChevronRight, Download, Print, Fullscreen } from "@mui/icons-material"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import PDFViewer from "@/app/components/PDFViewer"


export default function MedicalReport({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [serviceRequest, setServiceRequest] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<string>("report")
    const [formattedDate, setFormattedDate] = useState<string>("")

    useEffect(() => {
        const fetchServiceRequest = async () => {
            try {
                const response = await getServiceRequest(resolvedParams.id)
                setServiceRequest(response)
                if (response?.createdAt) {
                    setFormattedDate(response.createdAt.split(',')[0])
                }
                console.log(response)
            } catch (err) {
                console.error(err)
            }
        }

        fetchServiceRequest()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMedicalReportPDF(resolvedParams.id)
                // Create a URL for the PDF blob
                const blobUrl = URL.createObjectURL(data)
                setPdfUrl(blobUrl)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()

        // Cleanup function to revoke the URL when component unmounts
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl)
            }
        }
    }, [resolvedParams.id])

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Breadcrumb and content */}
            <div className="flex-1 flex flex-col px-4 sm:px-8 md:px-14 py-8 md:py-14">

                <div className="flex flex-wrap justify-between gap-2">
                    {/* Breadcrumb */}
                    <div className="text-sm overflow-x-auto whitespace-nowrap">
                        <Link href="/dashboard" className="text-gray-500">Painel</Link> <ChevronRight className="inline-block h-3 w-3 mx-1 text-gray-400" />
                        <Link href="/relatorio" className="text-gray-500">Relatório</Link> <ChevronRight className="inline-block h-3 w-3 mx-1 text-gray-400" />
                        <span className="font-bold text-gray-500">Relatório do Médico</span>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm font-bold">Criado em: {formattedDate}</p>
                    </div>

                </div>

                {/* Main content */}
                <div className="flex-1 pb-6 mt-10">
                    <h1 color="#5B5B5F" className="text-2xl mb-4">{serviceRequest?.doctorRequest?.doctorName}</h1>

                    {/* Tabs */}
                    <div className="mb-6 mt-8 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-8">
                            <button
                                className={`pb-2 px-1 font-medium relative ${activeTab === "report"
                                    ? 'text-gray-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#A9DC93] after:to-[#FF8046]'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab("report")}
                            >
                                Relatório
                            </button>
                            <button
                                className={`pb-2 px-1 font-medium relative ${activeTab === "images"
                                    ? 'text-gray-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#A9DC93] after:to-[#FF8046]'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab("images")}
                            >
                                Imagens
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-end gap-4 mb-4">
                            <button
                                onClick={() => window.open(pdfUrl, '_blank')}
                                className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                            >
                                <Fullscreen fontSize="small" /> <span className="whitespace-nowrap">Tela cheia</span>
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                            >
                                <Print fontSize="small" /> <span className="whitespace-nowrap">Imprimir</span>
                            </button>
                            <a
                                href={pdfUrl}
                                download="relatorio.pdf"
                                className="flex items-center gap-1 text-gray-700 hover:text-gray-900"
                            >
                                <Download fontSize="small" /> <span className="whitespace-nowrap">Baixar</span>
                            </a>
                        </div>
                    </div>

                    {/* Tab content */}
                    {activeTab === "report" && (
                        <div className="">
                            {pdfUrl ? (
                                <div className="mt-14">
                                    <PDFViewer fileUrl={pdfUrl} />
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64">
                                    <p>Carregando PDF...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "images" && (
                        <div className="flex justify-center items-center h-[800px] bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">Imagens não disponíveis no momento</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}
