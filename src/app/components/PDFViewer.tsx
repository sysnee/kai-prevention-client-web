// components/PDFViewer.tsx
"use client"

import { Document, Page, pdfjs } from "react-pdf"
import { useState, useEffect } from "react"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Configurar o worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function PDFViewer({ fileUrl }: { fileUrl: string }) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

    const onLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
    }

    useEffect(() => {
        if (!containerRef) return;

        const updateWidth = () => {
            if (containerRef) {
                setContainerWidth(containerRef.clientWidth - 40); // Subtract padding
            }
        };

        // Initial width calculation
        updateWidth();

        // Add resize listener
        window.addEventListener('resize', updateWidth);

        // Cleanup
        return () => window.removeEventListener('resize', updateWidth);
    }, [containerRef]);

    return (
        <div className="flex flex-col items-center w-full">
            <div
                className="border border-gray-300 rounded-lg shadow-md p-4 bg-white w-full max-w-5xl"
                ref={setContainerRef}
            >
                <Document file={fileUrl} onLoadSuccess={onLoadSuccess}>
                    {Array.from(new Array(numPages), (_, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            className="mb-4"
                            width={containerWidth || undefined}
                        />
                    ))}
                </Document>
            </div>
        </div>
    )
}
