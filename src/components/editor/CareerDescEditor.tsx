import { useRef } from 'react'
import type { useResumeStore } from '../../store/resumeStore'
import { FormInput, FormRichTextarea, SectionHeader, ItemCard } from './FormField'
import { DraggableList } from './DraggableList'

type Store = ReturnType<typeof useResumeStore>

interface Props {
  store: Store
}

export default function CareerDescEditor({ store }: Props) {
  const {
    data,
    addCareerDescription, updateCareerDescription, removeCareerDescription, reorderCareerDescriptions,
    addProject, updateProject, removeProject, reorderProjects,
  } = store

  return (
    <div className="space-y-6 p-4">
      <SectionHeader title="경력 기술서" onAdd={addCareerDescription} addLabel="회사 추가" />

      <DraggableList
        items={data.careerDescriptions}
        keyExtractor={cd => cd.id}
        onReorder={reorderCareerDescriptions}
        renderItem={(cd) => (
          <div className="border border-gray-200 rounded-xl p-4 bg-white mb-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">{cd.company || '회사명 없음'}</h3>
              <button onClick={() => removeCareerDescription(cd.id)} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-400 text-xl leading-none">×</button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-2 gap-2">
                <FormInput label="회사명" value={cd.company} onChange={v => updateCareerDescription(cd.id, 'company', v)} placeholder="(주)회사명" />
                <FormInput label="재직 기간" value={cd.period} onChange={v => updateCareerDescription(cd.id, 'period', v)} placeholder="2020.03 ~ 현재" />
              </div>
              <FormInput label="역할/직책" value={cd.role} onChange={v => updateCareerDescription(cd.id, 'role', v)} placeholder="백엔드 개발자" />
            </div>

            {/* Projects */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">프로젝트</span>
                <button onClick={() => addProject(cd.id)} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <span className="text-base leading-none">+</span> 프로젝트 추가
                </button>
              </div>

              <DraggableList
                items={cd.projects}
                keyExtractor={p => p.id}
                onReorder={(from, to) => reorderProjects(cd.id, from, to)}
                renderItem={(project) => (
                  <ItemCard onRemove={() => removeProject(cd.id, project.id)}>
                    <div className="grid grid-cols-2 gap-2">
                      <FormInput label="프로젝트명" value={project.name} onChange={v => updateProject(cd.id, project.id, 'name', v)} placeholder="프로젝트 이름" />
                      <FormInput label="기간" value={project.period} onChange={v => updateProject(cd.id, project.id, 'period', v)} placeholder="2022.06 ~ 2023.03" />
                    </div>
                    <FormRichTextarea label="프로젝트 설명" value={project.description} onChange={v => updateProject(cd.id, project.id, 'description', v)} placeholder="프로젝트 개요 및 담당 역할을 설명하세요..." rows={3} />
                    <FormInput label="기술 스택 (쉼표로 구분)" value={project.techStack} onChange={v => updateProject(cd.id, project.id, 'techStack', v)} placeholder="Python, FastAPI, PostgreSQL" />
                    <FormRichTextarea label="주요 성과" value={project.achievements} onChange={v => updateProject(cd.id, project.id, 'achievements', v)} placeholder="• 성과 1&#10;• 성과 2" rows={3} />
                    <FormInput label="기여도" value={project.contribution || ''} onChange={v => updateProject(cd.id, project.id, 'contribution', v)} placeholder="예: 70%, 핵심 개발자, 팀 리드 등" />
                    <ProjectImageUpload image={project.image || ''} onChange={v => updateProject(cd.id, project.id, 'image', v)} />
                  </ItemCard>
                )}
              />

              {cd.projects.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-3">프로젝트를 추가해주세요</p>
              )}
            </div>
          </div>
        )}
      />

      {data.careerDescriptions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">경력 기술서를 추가해보세요</p>
        </div>
      )}

      <div className="h-8" />
    </div>
  )
}

function ProjectImageUpload({ image, onChange }: { image: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">프로젝트 이미지</label>
      <div className="flex items-start gap-3">
        {image ? (
          <div className="relative group">
            <img src={image} alt="프로젝트 이미지" className="w-24 h-16 object-cover rounded-lg border border-gray-200" />
            <button onClick={() => onChange('')} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">이미지 추가</span>
          </button>
        )}
        {image && <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-700 mt-1">변경</button>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
