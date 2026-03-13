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

interface SectionHeaderProps {
  title: string
  onAdd?: () => void
  addLabel?: string
}

export function SectionHeader({ title, onAdd, addLabel = '추가' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
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
