import type { CareerDescriptionItem } from '../../types/resume'

interface Props {
  careerDescriptions: CareerDescriptionItem[]
}

// A4 height in px at 96dpi
const A4_HEIGHT = 1123
// Approximate content height (subtract padding)
const PAGE_CONTENT_HEIGHT = A4_HEIGHT - 96 // 48px top + 48px bottom padding

export default function CareerDescriptionPages({ careerDescriptions }: Props) {
  if (careerDescriptions.length === 0) return null

  const pages = buildPages(careerDescriptions)

  return (
    <>
      {pages.map((pageContent, pageIdx) => (
        <div
          key={pageIdx}
          className="a4-page p-12 text-sm text-gray-800"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {pageIdx === 0 && (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">경력 기술서</h1>
              <div className="w-10 h-1 bg-indigo-400 rounded-full mt-2" />
            </div>
          )}
          {pageIdx > 0 && (
            <div className="mb-6 pb-3 border-b border-slate-200">
              <p className="text-xs text-slate-400 text-right">경력 기술서 (계속)</p>
            </div>
          )}

          {pageContent.map((item, idx) => (
            <CareerDescSection key={`${pageIdx}-${idx}`} item={item} />
          ))}
        </div>
      ))}
    </>
  )
}

function CareerDescSection({ item }: { item: CareerDescriptionItem }) {
  return (
    <div className="mb-8">
      {/* Company Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-6 bg-indigo-400 rounded-full shrink-0" />
        <h2 className="text-base font-bold text-slate-900">{item.company}</h2>
        {item.period && (
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.period}</span>
        )}
        {item.role && (
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
            {item.role}
          </span>
        )}
      </div>

      {/* Projects */}
      <div className="space-y-4 ml-5">
        {item.projects.map((project) => (
          <div key={project.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            {/* Project header + image */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 text-sm">{project.name}</h3>
                  {project.period && (
                    <span className="text-xs text-slate-400">{project.period}</span>
                  )}
                </div>

                {project.description && (
                  <p className="text-xs text-slate-600 leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}

                {project.techStack && (
                  <div className="flex gap-2 mb-3 items-start">
                    <span className="text-xs font-semibold text-slate-400 shrink-0 w-14 pt-0.5">기술 스택</span>
                    <div className="flex flex-wrap gap-1">
                      {project.techStack.split(',').map((tech, i, arr) => (
                        <span
                          key={i}
                          className="text-xs text-indigo-600 font-medium"
                        >
                          {tech.trim()}{i < arr.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.achievements && (
                  <div className="flex gap-2 items-start">
                    <span className="text-xs font-semibold text-slate-400 shrink-0 w-14 pt-0.5">주요 성과</span>
                    <p className="text-xs text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.achievements }} />
                  </div>
                )}
              </div>

              {/* Project Image */}
              {project.image && (
                <div className="shrink-0 self-start">
                  <img
                    src={project.image}
                    alt={`${project.name} 이미지`}
                    className="w-32 h-20 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple page splitting: each career description goes into pages
function buildPages(items: CareerDescriptionItem[]): CareerDescriptionItem[][] {
  const estimateHeight = (item: CareerDescriptionItem): number => {
    let h = 68 // company header (with new design)
    for (const p of item.projects) {
      h += 44 // project header
      h += (p.description.split('\n').length) * 16 + 16
      h += p.techStack ? 24 : 0
      h += p.achievements ? (p.achievements.split('\n').length) * 16 + 8 : 0
      h += p.image ? 88 : 0 // image height
      h += 24 // card padding + spacing
    }
    h += 32 // section margin
    return h
  }

  const firstPageHeight = PAGE_CONTENT_HEIGHT - 88 // subtract title
  const pages: CareerDescriptionItem[][] = [[]]
  let currentHeight = 0
  let isFirst = true

  for (const item of items) {
    const h = estimateHeight(item)
    const limit = isFirst ? firstPageHeight : PAGE_CONTENT_HEIGHT

    if (currentHeight + h > limit && pages[pages.length - 1].length > 0) {
      pages.push([])
      currentHeight = 0
      isFirst = false
    }

    pages[pages.length - 1].push(item)
    currentHeight += h
  }

  return pages.filter(p => p.length > 0)
}

export { PAGE_CONTENT_HEIGHT }
