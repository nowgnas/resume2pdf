import { useState } from 'react'

interface Props<T> {
  items: T[]
  onReorder: (fromIndex: number, toIndex: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string
}

export function DraggableList<T>({ items, onReorder, renderItem, keyExtractor }: Props<T>) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    e.dataTransfer.effectAllowed = 'move'
    // Delay so the drag image renders before opacity changes
    setTimeout(() => setDragIdx(idx), 0)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIdx !== idx) setOverIdx(idx)
  }

  const handleDrop = (idx: number) => {
    if (dragIdx !== null && dragIdx !== idx) {
      onReorder(dragIdx, idx)
    }
    setDragIdx(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setOverIdx(null)
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div
          key={keyExtractor(item)}
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={handleDragEnd}
          className={[
            'relative transition-opacity select-none',
            dragIdx === idx ? 'opacity-40' : 'opacity-100',
            overIdx === idx && dragIdx !== idx
              ? 'before:absolute before:inset-x-0 before:-top-1 before:h-0.5 before:bg-indigo-400 before:rounded-full'
              : '',
          ].join(' ')}
        >
          {/* Drag handle */}
          <div
            className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 group"
            title="드래그하여 순서 변경"
          >
            <svg
              className="w-3 h-4 text-gray-300 group-hover:text-gray-400 transition-colors"
              viewBox="0 0 8 16"
              fill="currentColor"
            >
              <circle cx="2" cy="3" r="1.2" />
              <circle cx="6" cy="3" r="1.2" />
              <circle cx="2" cy="7" r="1.2" />
              <circle cx="6" cy="7" r="1.2" />
              <circle cx="2" cy="11" r="1.2" />
              <circle cx="6" cy="11" r="1.2" />
            </svg>
          </div>
          <div className="pl-5">
            {renderItem(item, idx)}
          </div>
        </div>
      ))}
    </div>
  )
}
