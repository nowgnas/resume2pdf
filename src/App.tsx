import { useRef, useState, useCallback, useEffect } from 'react'
import { useResumeStore } from './store/resumeStore'
import ResumeEditor from './components/editor/ResumeEditor'
import CareerDescEditor from './components/editor/CareerDescEditor'
import PreviewPanel from './components/preview/PreviewPanel'
import LandingPage from './pages/LandingPage'

const EDITOR_MIN = 260
const EDITOR_MAX = 600
const EDITOR_DEFAULT = 320

export default function App() {
  const store = useResumeStore()
  const { activeTab, setActiveTab, exportData, importData, resetData, startNew } = store
  const [view, setView] = useState<'landing' | 'editor'>('landing')
  const [editorWidth, setEditorWidth] = useState(EDITOR_DEFAULT)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)
  const importInputRef = useRef<HTMLInputElement>(null)

  const handleStartNew = () => {
    startNew()
    setView('editor')
  }

  const handleLandingImport = (file: File) => {
    importData(file, () => setView('editor'))
  }

  const handleEditorImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) importData(file)
    e.target.value = ''
  }

  // ── Resize divider ─────────────────────────────────────────────────────────
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = editorWidth
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [editorWidth])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const delta = e.clientX - startX.current
      const next = Math.min(EDITOR_MAX, Math.max(EDITOR_MIN, startWidth.current + delta))
      setEditorWidth(next)
    }
    const onMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  if (view === 'landing') {
    return <LandingPage onStartNew={handleStartNew} onImport={handleLandingImport} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left: Editor */}
      <div
        className="shrink-0 flex flex-col bg-white border-r border-gray-200 shadow-sm"
        style={{ width: editorWidth }}
      >
        {/* Tab Header */}
        <div className="flex border-b border-gray-200 shrink-0">
          <TabButton active={activeTab === 'resume'} onClick={() => setActiveTab('resume')} label="이력서" />
          <TabButton active={activeTab === 'career'} onClick={() => setActiveTab('career')} label="경력 기술서" />
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'resume' ? (
            <ResumeEditor store={store} />
          ) : (
            <CareerDescEditor store={store} />
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="shrink-0 border-t border-gray-100 px-3 py-2 bg-gray-50 flex items-center gap-1.5">
          <div className="flex items-center gap-1 mr-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-400">자동 저장됨</span>
          </div>
          <button
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-white transition-colors"
            title="JSON 파일 불러오기"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            불러오기
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-white transition-colors"
            title="JSON 파일로 저장"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            저장
          </button>
          <button
            onClick={resetData}
            className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-600 border border-red-100 rounded-md hover:bg-red-50 transition-colors"
          >
            초기화
          </button>
          <input ref={importInputRef} type="file" accept=".json" className="hidden" onChange={handleEditorImport} />
        </div>
      </div>

      {/* Resize Divider */}
      <div
        onMouseDown={handleDividerMouseDown}
        className="w-1 shrink-0 bg-gray-200 hover:bg-indigo-400 cursor-col-resize transition-colors relative group"
        title="드래그하여 크기 조절"
      >
        {/* 중앙 핸들 점 */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white" />
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PreviewPanel data={store.data} activeTab={activeTab} />
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition-colors ${
        active
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
