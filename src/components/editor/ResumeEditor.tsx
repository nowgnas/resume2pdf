import { type SectionKey, DEFAULT_SECTION_ORDER } from '../../types/resume'
import type { useResumeStore } from '../../store/resumeStore'
import { FormInput, FormRichTextarea, SectionHeader, ItemCard } from './FormField'
import { DraggableList } from './DraggableList'

type Store = ReturnType<typeof useResumeStore>

interface Props {
  store: Store
}

export default function ResumeEditor({ store }: Props) {
  const {
    data,
    updatePersonalInfo, updateIntroduction,
    addCareer, updateCareer, removeCareer, reorderCareers,
    addEducation, updateEducation, removeEducation, reorderEducations,
    addSkill, updateSkill, removeSkill, reorderSkills,
    addCertificate, updateCertificate, removeCertificate, reorderCertificates,
    addCustomSection, updateCustomSectionTitle, removeCustomSection, reorderCustomSections,
    addCustomEntry, updateCustomEntry, removeCustomEntry, reorderCustomEntries,
    addResumeProject, updateResumeProject, removeResumeProject, reorderResumeProjects,
    reorderSections,
  } = store

  const sectionOrder = data.sectionOrder ?? DEFAULT_SECTION_ORDER

  const moveUp = (idx: number) => idx > 0 ? reorderSections(idx, idx - 1) : undefined
  const moveDown = (idx: number) => idx < sectionOrder.length - 1 ? reorderSections(idx, idx + 1) : undefined

  const renderSection = (key: SectionKey, idx: number) => {
    const isFirst = idx === 0
    const isLast = idx === sectionOrder.length - 1
    const arrows = {
      onMoveUp: !isFirst ? () => moveUp(idx) : undefined,
      onMoveDown: !isLast ? () => moveDown(idx) : undefined,
    }

    switch (key) {
      case 'introduction':
        return (
          <section>
            <SectionHeader title="자기소개" {...arrows} />
            <FormRichTextarea label="" value={data.introduction} onChange={updateIntroduction} placeholder="자기소개를 입력하세요..." rows={4} />
          </section>
        )

      case 'careers':
        return (
          <section>
            <SectionHeader title="경력" onAdd={addCareer} {...arrows} />
            <DraggableList
              items={data.careers}
              keyExtractor={c => c.id}
              onReorder={reorderCareers}
              renderItem={(career) => (
                <ItemCard onRemove={() => removeCareer(career.id)}>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="회사명" value={career.company} onChange={v => updateCareer(career.id, 'company', v)} placeholder="(주)회사명" />
                    <FormInput label="부서" value={career.department} onChange={v => updateCareer(career.id, 'department', v)} placeholder="개발팀" />
                  </div>
                  <FormInput label="직책/직급" value={career.position} onChange={v => updateCareer(career.id, 'position', v)} placeholder="백엔드 개발자" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="입사일" value={career.startDate} onChange={v => updateCareer(career.id, 'startDate', v)} placeholder="2020.03" />
                    <div>
                      <FormInput label="퇴사일" value={career.endDate} onChange={v => updateCareer(career.id, 'endDate', v)} placeholder="2023.02" />
                      <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                        <input type="checkbox" checked={career.isCurrent} onChange={e => updateCareer(career.id, 'isCurrent', e.target.checked)} className="rounded" />
                        <span className="text-xs text-gray-500">재직 중</span>
                      </label>
                    </div>
                  </div>
                  <FormRichTextarea label="업무 내용" value={career.description} onChange={v => updateCareer(career.id, 'description', v)} placeholder="주요 업무를 간략히 입력하세요" rows={2} />
                </ItemCard>
              )}
            />
          </section>
        )

      case 'projects':
        return (
          <section>
            <SectionHeader title="프로젝트" onAdd={addResumeProject} {...arrows} />
            <DraggableList
              items={data.projects ?? []}
              keyExtractor={p => p.id}
              onReorder={reorderResumeProjects}
              renderItem={(project) => (
                <ItemCard onRemove={() => removeResumeProject(project.id)}>
                  <FormInput label="프로젝트명" value={project.name} onChange={v => updateResumeProject(project.id, 'name', v)} placeholder="프로젝트 이름" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="소속/조직" value={project.organization ?? ''} onChange={v => updateResumeProject(project.id, 'organization', v)} placeholder="(주)회사명, 개인 프로젝트 등" />
                    <FormInput label="기간" value={project.period} onChange={v => updateResumeProject(project.id, 'period', v)} placeholder="2024.01 ~ 2024.03" />
                  </div>
                  <FormInput label="사용 기술 (쉼표로 구분)" value={project.techStack} onChange={v => updateResumeProject(project.id, 'techStack', v)} placeholder="React, TypeScript, ..." />
                  <FormRichTextarea label="요약" value={project.summary} onChange={v => updateResumeProject(project.id, 'summary', v)} placeholder="무엇을 했는지, 성과가 있다면 수치로 작성하세요." rows={2} />
                </ItemCard>
              )}
            />
          </section>
        )

      case 'educations':
        return (
          <section>
            <SectionHeader title="학력" onAdd={addEducation} {...arrows} />
            <DraggableList
              items={data.educations}
              keyExtractor={e => e.id}
              onReorder={reorderEducations}
              renderItem={(edu) => (
                <ItemCard onRemove={() => removeEducation(edu.id)}>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="학교명" value={edu.school} onChange={v => updateEducation(edu.id, 'school', v)} placeholder="한국대학교" />
                    <FormInput label="학과" value={edu.major} onChange={v => updateEducation(edu.id, 'major', v)} placeholder="컴퓨터공학과" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">학위</label>
                      <select value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
                        <option>학사</option><option>석사</option><option>박사</option><option>전문학사</option><option>고졸</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">졸업 상태</label>
                      <select value={edu.graduationStatus ?? '졸업'} onChange={e => updateEducation(edu.id, 'graduationStatus', e.target.value)} className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white">
                        <option>졸업</option><option>재학</option><option>휴학</option><option>수료</option><option>중퇴</option>
                      </select>
                    </div>
                  </div>
                  <FormInput label="학점" value={edu.gpa} onChange={v => updateEducation(edu.id, 'gpa', v)} placeholder="3.8 / 4.5" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="입학" value={edu.startDate} onChange={v => updateEducation(edu.id, 'startDate', v)} placeholder="2014.03" />
                    <div>
                      <FormInput label="졸업" value={edu.endDate} onChange={v => updateEducation(edu.id, 'endDate', v)} placeholder="2018.02" />
                      <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                        <input type="checkbox" checked={edu.isCurrent} onChange={e => updateEducation(edu.id, 'isCurrent', e.target.checked)} className="rounded" />
                        <span className="text-xs text-gray-500">재학 중</span>
                      </label>
                    </div>
                  </div>
                </ItemCard>
              )}
            />
          </section>
        )

      case 'skills':
        return (
          <section>
            <SectionHeader title="기술 스택" onAdd={addSkill} {...arrows} />
            <DraggableList
              items={data.skills}
              keyExtractor={s => s.id}
              onReorder={reorderSkills}
              renderItem={(skill) => (
                <ItemCard onRemove={() => removeSkill(skill.id)}>
                  <FormInput label="분류" value={skill.category} onChange={v => updateSkill(skill.id, 'category', v)} placeholder="언어, 프레임워크..." />
                  <FormInput label="내용" value={skill.skills} onChange={v => updateSkill(skill.id, 'skills', v)} placeholder="Python, TypeScript, ..." />
                </ItemCard>
              )}
            />
          </section>
        )

      case 'certificates':
        return (
          <section>
            <SectionHeader title="자격증" onAdd={addCertificate} {...arrows} />
            <DraggableList
              items={data.certificates}
              keyExtractor={c => c.id}
              onReorder={reorderCertificates}
              renderItem={(cert) => (
                <ItemCard onRemove={() => removeCertificate(cert.id)}>
                  <FormInput label="자격증명" value={cert.name} onChange={v => updateCertificate(cert.id, 'name', v)} placeholder="정보처리기사" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="발급기관" value={cert.issuer} onChange={v => updateCertificate(cert.id, 'issuer', v)} placeholder="한국산업인력공단" />
                    <FormInput label="취득일" value={cert.date} onChange={v => updateCertificate(cert.id, 'date', v)} placeholder="2023.06" />
                  </div>
                </ItemCard>
              )}
            />
          </section>
        )

      case 'customSections':
        return (
          <section>
            <SectionHeader title="추가 항목" onAdd={addCustomSection} addLabel="카테고리 추가" {...arrows} />
            <DraggableList
              items={data.customSections}
              keyExtractor={s => s.id}
              onReorder={reorderCustomSections}
              renderItem={(section) => (
                <div className="border border-gray-200 rounded-xl p-4 bg-white mb-3">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <FormInput
                        label="카테고리 제목"
                        value={section.title}
                        onChange={v => updateCustomSectionTitle(section.id, v)}
                        placeholder="수상 이력, 어학, 대외활동 등..."
                      />
                    </div>
                    <button onClick={() => removeCustomSection(section.id)} className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-400 text-xl leading-none mt-5 shrink-0">×</button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">세부 항목</span>
                      <button onClick={() => addCustomEntry(section.id)} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <span className="text-base leading-none">+</span> 항목 추가
                      </button>
                    </div>

                    <DraggableList
                      items={section.entries}
                      keyExtractor={e => e.id}
                      onReorder={(from, to) => reorderCustomEntries(section.id, from, to)}
                      renderItem={(entry) => (
                        <ItemCard onRemove={() => removeCustomEntry(section.id, entry.id)}>
                          <FormInput label="항목 이름" value={entry.name} onChange={v => updateCustomEntry(section.id, entry.id, 'name', v)} placeholder="항목 이름" />
                          <div className="grid grid-cols-2 gap-2">
                            <FormInput label="시작 날짜" value={entry.startDate} onChange={v => updateCustomEntry(section.id, entry.id, 'startDate', v)} placeholder="2023.03" />
                            <FormInput label="종료 날짜 (선택)" value={entry.endDate} onChange={v => updateCustomEntry(section.id, entry.id, 'endDate', v)} placeholder="2023.06" />
                          </div>
                          <FormRichTextarea label="설명" value={entry.description} onChange={v => updateCustomEntry(section.id, entry.id, 'description', v)} placeholder="설명을 입력하세요..." rows={2} />
                        </ItemCard>
                      )}
                    />

                    {section.entries.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-3">항목을 추가해주세요</p>
                    )}
                  </div>
                </div>
              )}
            />
            {data.customSections.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">수상 이력, 어학 점수, 대외활동 등 자유롭게 추가하세요</p>
            )}
          </section>
        )
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* Personal Info — always first, not reorderable */}
      <section>
        <SectionHeader title="기본 정보" />
        <div className="space-y-2">
          <FormInput label="이름" value={data.personalInfo.name} onChange={v => updatePersonalInfo('name', v)} placeholder="홍길동" />
          <div className="grid grid-cols-2 gap-2">
            <FormInput label="생년월일" value={data.personalInfo.birthDate} onChange={v => updatePersonalInfo('birthDate', v)} placeholder="1990.01.01" />
            <FormInput label="연락처" value={data.personalInfo.phone} onChange={v => updatePersonalInfo('phone', v)} placeholder="010-0000-0000" />
          </div>
          <FormInput label="이메일" value={data.personalInfo.email} onChange={v => updatePersonalInfo('email', v)} placeholder="email@example.com" type="email" />
          <FormInput label="주소" value={data.personalInfo.address} onChange={v => updatePersonalInfo('address', v)} placeholder="서울특별시 ..." />
        </div>
      </section>

      <Divider />

      {/* Reorderable sections */}
      {sectionOrder.map((key, idx) => (
        <div key={key} className="space-y-6">
          {renderSection(key, idx)}
          <Divider />
        </div>
      ))}

      <div className="h-8" />
    </div>
  )
}

function Divider() {
  return <div className="border-t border-gray-100" />
}
