interface Props {
  onStartNew: () => void
  onImport: (file: File) => void
}

export default function LandingPage({ onStartNew, onImport }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onImport(file)
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      {/* Logo / Title */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">resume2pdf</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          이력서를 PDF로
        </h1>
        <p className="text-slate-500 text-base max-w-sm leading-relaxed">
          깔끔한 이력서와 경력 기술서를<br />작성하고 PDF로 바로 다운로드하세요.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onStartNew}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새로 작성하기
        </button>

        <label className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          불러오기
          <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <p className="mt-6 text-xs text-slate-400">
        이전에 저장한 JSON 파일을 불러올 수 있습니다
      </p>
    </div>
  )
}
