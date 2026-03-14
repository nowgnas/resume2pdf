import { useRef, useEffect } from 'react'

interface InputProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}

export function FormInput({ label, value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white"
      />
    </div>
  )
}

interface TextareaProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}

export function FormTextarea({ label, value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white resize-y min-h-[60px]"
      />
    </div>
  )
}

interface RichTextareaProps {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}

export function FormRichTextarea({ label, value, onChange, placeholder, rows = 3 }: RichTextareaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isFocused = useRef(false)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = value || ''
  }, [])

  useEffect(() => {
    if (!isFocused.current && ref.current) ref.current.innerHTML = value || ''
  }, [value])

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault()
    document.execCommand('bold')
    if (ref.current) onChange(ref.current.innerHTML)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        {label && <label className="block text-xs font-medium text-gray-600">{label}</label>}
        <button
          type="button"
          onMouseDown={handleBold}
          className="text-xs font-bold px-1.5 py-0.5 border border-gray-200 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors ml-auto"
          title="굵게 (Ctrl+B)"
        >
          B
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onFocus={() => { isFocused.current = true }}
        onBlur={() => { isFocused.current = false }}
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML) }}
        data-placeholder={placeholder}
        style={{ minHeight: `${rows * 1.6}rem` }}
        className="rich-textarea w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 bg-white"
        suppressContentEditableWarning
      />
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  onAdd?: () => void
  addLabel?: string
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function SectionHeader({ title, onAdd, addLabel = '추가', onMoveUp, onMoveDown }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-1.5">
        {(onMoveUp || onMoveDown) && (
          <div className="flex flex-col gap-0.5">
            <button
              onClick={onMoveUp}
              disabled={!onMoveUp}
              className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:cursor-default transition-colors"
              title="위로 이동"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={!onMoveDown}
              className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-gray-500 disabled:opacity-0 disabled:cursor-default transition-colors"
              title="아래로 이동"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> {addLabel}
        </button>
      )}
    </div>
  )
}

interface ItemCardProps {
  children: React.ReactNode
  onRemove: () => void
}

export function ItemCard({ children, onRemove }: ItemCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 relative group mb-3">
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
        title="삭제"
      >
        ×
      </button>
      <div className="space-y-2 pr-4">{children}</div>
    </div>
  )
}
