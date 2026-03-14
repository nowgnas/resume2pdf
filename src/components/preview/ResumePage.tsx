import React from 'react'
import type { ResumeData, SectionKey } from '../../types/resume'
import { DEFAULT_SECTION_ORDER } from '../../types/resume'

interface Props {
  data: ResumeData
}

export default function ResumePage({ data }: Props) {
  const { personalInfo, introduction, careers, educations, skills, certificates, customSections } = data
  const sectionOrder = data.sectionOrder ?? DEFAULT_SECTION_ORDER

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'introduction':
        return introduction ? (
          <Section key="introduction" title="자기소개">
            <p className="text-xs text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: introduction }} />
          </Section>
        ) : null

      case 'careers':
        return careers.length > 0 ? (
          <Section key="careers" title="경력">
            <div className="space-y-3.5">
              {careers.map((career) => (
                <div key={career.id} className="flex gap-4">
                  <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">
                    {career.startDate} ~{' '}
                    <span className={career.isCurrent ? 'text-indigo-500 font-medium' : ''}>
                      {career.isCurrent ? '현재' : career.endDate}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{career.company}</span>
                      {career.department && <span className="text-slate-400 text-xs">{career.department}</span>}
                      {career.position && <span className="text-xs text-slate-500">| {career.position}</span>}
                    </div>
                    {career.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: career.description }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null

      case 'educations':
        return educations.length > 0 ? (
          <Section key="educations" title="학력">
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex gap-4">
                  <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">
                    {edu.startDate} ~{' '}
                    <span className={edu.isCurrent ? 'text-indigo-500 font-medium' : ''}>
                      {edu.isCurrent ? '재학중' : edu.endDate}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">{edu.school}</span>
                      {edu.major && <span className="text-slate-500 text-xs">{edu.major}</span>}
                      {edu.degree && <span className="text-xs text-slate-400">| {edu.degree}</span>}
                      {edu.gpa && <span className="text-slate-400 text-xs">GPA {edu.gpa}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null

      case 'skills':
        return skills.length > 0 ? (
          <Section key="skills" title="기술 스택">
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-4 items-start">
                  <span className="font-semibold text-slate-600 w-20 shrink-0 text-xs pt-0.5">{skill.category}</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.skills.split(',').map((s, i, arr) => (
                      <span key={i} className="text-xs text-indigo-600 font-medium">
                        {s.trim()}{i < arr.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null

      case 'certificates':
        return certificates.length > 0 ? (
          <Section key="certificates" title="자격증">
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex gap-4">
                  <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">{cert.date}</div>
                  <div className="flex-1 flex items-baseline gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-xs">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-400 text-xs">{cert.issuer}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null

      case 'customSections':
        return (
          <>
            {customSections?.map((section) =>
              section.title && section.entries.length > 0 ? (
                <Section key={section.id} title={section.title}>
                  <div className="space-y-2">
                    {section.entries.map((entry) => (
                      <div key={entry.id} className="flex gap-4">
                        <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">
                          {entry.startDate}
                          {entry.endDate ? ` ~ ${entry.endDate}` : ''}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 text-xs">{entry.name}</div>
                          {entry.description && (
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.description }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              ) : null
            )}
          </>
        )
    }
  }

  return (
    <div className="a4-page p-12 text-sm text-gray-800" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Header: Personal Info — always first */}
      <div className="flex gap-6 mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{personalInfo.name}</h1>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-500">
            {personalInfo.birthDate && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 w-14 shrink-0">생년월일</span>
                <span>{personalInfo.birthDate}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 w-14 shrink-0">연락처</span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 w-14 shrink-0">이메일</span>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 w-14 shrink-0">주소</span>
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        {personalInfo.photo && (
          <div className="w-24 h-28 shrink-0">
            <img src={personalInfo.photo} alt="증명사진" className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm" />
          </div>
        )}
      </div>

      {sectionOrder.map(key => (
        <React.Fragment key={key}>{renderSection(key)}</React.Fragment>
      ))}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">{title}</h2>
        <div className="flex-1 h-px bg-slate-200" />
      </div>
      {children}
    </div>
  )
}
