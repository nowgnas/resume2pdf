import { useRef, useState } from 'react'
import type { ResumeData } from '../../types/resume'
import ResumePage from './ResumePage'
import CareerDescriptionPages from './CareerDescriptionPage'
import { exportToPdf, printAsPdf } from '../../utils/pdfExport'

interface Props {
  data: ResumeData
  activeTab: 'resume' | 'career'
}

export default function PreviewPanel({ data, activeTab }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const handleDownload = async () => {
    if (!containerRef.current) return
    setExporting(true)
    try {
      const filename = activeTab === 'resume' ? '이력서.pdf' : '경력기술서.pdf'
      await exportToPdf(containerRef.current, filename)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <span className="text-sm font-medium text-gray-500">
          미리보기 — A4 (210 × 297mm)
        </span>

        <div className="flex items-center gap-2">
          {/* 브라우저 인쇄 (벡터, 고품질) */}
          <button
            onClick={printAsPdf}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title="브라우저 인쇄 — 텍스트가 선명한 벡터 PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            인쇄
          </button>

          {/* html2canvas PDF 다운로드 */}
          <button
            onClick={handleDownload}
            disabled={exporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {exporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                변환 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF 다운로드
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto bg-gray-200 p-6">
        <div
          ref={containerRef}
          className="print-area flex flex-col items-center gap-4"
          style={{ minWidth: '794px' }}
        >
          {activeTab === 'resume' ? (
            <div className="shadow-xl">
              <ResumePage data={data} />
            </div>
          ) : (
            <CareerDescriptionPages careerDescriptions={data.careerDescriptions} />
          )}
        </div>
      </div>
    </div>
  )
}
