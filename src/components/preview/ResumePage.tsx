import React from 'react'
import type { ResumeData, SectionKey } from '../../types/resume'
import { DEFAULT_SECTION_ORDER } from '../../types/resume'

interface Props {
  data: ResumeData
}

// ── 높이 상수 (px, 96dpi 기준) ────────────────────────────────────────────────
const PAGE_H = 1123          // A4 전체 높이
const PADDING = 96           // p-12 (48px × 2)
const PAGE_CONTENT_H = PAGE_H - PADDING  // 1027px
const HEADER_H = 136         // 개인정보 블록 + mb-8
const LINE_H = 20            // text-xs leading-relaxed 한 줄
const SECTION_OVERHEAD = 52  // 섹션 헤더(타이틀+구분선+mb-3) + mb-6

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

function lineCount(html: string, charsPerLine = 72) {
  const text = stripHtml(html).trim()
  if (!text) return 0
  return Math.max(1, Math.ceil(text.length / charsPerLine))
}

function estimateSectionH(key: SectionKey, data: ResumeData): number {
  switch (key) {
    case 'introduction': {
      if (!data.introduction) return 0
      return SECTION_OVERHEAD + lineCount(data.introduction, 90) * LINE_H + 8
    }
    case 'careers': {
      if (!data.careers.length) return 0
      const itemsH = data.careers.reduce((h, c) => {
        const descLines = c.description ? lineCount(c.description) : 0
        return h + LINE_H + descLines * LINE_H + 14
      }, 0)
      return SECTION_OVERHEAD + itemsH
    }
    case 'projects': {
      const projects = data.projects ?? []
      if (!projects.length) return 0
      const itemsH = projects.reduce((h, p) => {
        const techH = p.techStack ? LINE_H : 0
        const summaryLines = p.summary ? lineCount(p.summary) : 0
        return h + LINE_H + techH + summaryLines * LINE_H + 14
      }, 0)
      return SECTION_OVERHEAD + itemsH
    }
    case 'educations': {
      if (!data.educations.length) return 0
      return SECTION_OVERHEAD + data.educations.length * (LINE_H + 12)
    }
    case 'skills': {
      if (!data.skills.length) return 0
      return SECTION_OVERHEAD + data.skills.length * (LINE_H + 8)
    }
    case 'certificates': {
      if (!data.certificates.length) return 0
      return SECTION_OVERHEAD + data.certificates.length * (LINE_H + 8)
    }
    case 'customSections': {
      const visible = (data.customSections ?? []).filter(s => s.title && s.entries.length > 0)
      if (!visible.length) return 0
      return visible.reduce((total, section) => {
        const entriesH = section.entries.reduce((h, e) => {
          const descLines = e.description ? lineCount(e.description) : 0
          return h + LINE_H + descLines * LINE_H + 8
        }, 0)
        return total + SECTION_OVERHEAD + entriesH
      }, 0)
    }
    default:
      return 0
  }
}

function buildResumePages(sectionOrder: SectionKey[], data: ResumeData): SectionKey[][] {
  const pages: SectionKey[][] = [[]]
  let currentH = HEADER_H  // 첫 페이지는 헤더만큼 이미 사용

  for (const key of sectionOrder) {
    const h = estimateSectionH(key, data)
    if (h === 0) continue

    // 현재 페이지에 안 들어가면 새 페이지로
    if (currentH + h > PAGE_CONTENT_H && pages[pages.length - 1].length > 0) {
      pages.push([])
      currentH = 0
    }

    pages[pages.length - 1].push(key)
    currentH += h
  }

  return pages.filter(p => p.length > 0)
}

// ── 섹션 렌더러 ───────────────────────────────────────────────────────────────
function renderSection(key: SectionKey, data: ResumeData) {
  const { introduction, careers, educations, skills, certificates, customSections } = data

  switch (key) {
    case 'introduction':
      return introduction ? (
        <Section title="자기소개">
          <p className="rich-content text-xs text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: introduction }} />
        </Section>
      ) : null

    case 'careers':
      return careers.length > 0 ? (
        <Section title="경력">
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
                    <p className="rich-content text-xs text-slate-500 mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: career.description }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null

    case 'projects': {
      const projects = data.projects ?? []
      return projects.length > 0 ? (
        <Section title="프로젝트">
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="flex gap-4">
                <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">
                  <div>{project.period}</div>
                  {project.organization && <div className="mt-0.5">{project.organization}</div>}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 mb-1">{project.name}</div>
                  {project.techStack && (
                    <div className="flex flex-wrap gap-x-1 mb-1">
                      {project.techStack.split(',').map((tech, i, arr) => (
                        <span key={i} className="text-xs text-slate-500 font-medium">
                          {tech.trim()}{i < arr.length - 1 ? ' ·' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.summary && (
                    <p className="rich-content text-xs text-slate-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.summary }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null
    }

    case 'educations':
      return educations.length > 0 ? (
        <Section title="학력">
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
                    {edu.isCurrent && (
                      <span className="text-xs text-indigo-500 font-medium border border-indigo-300 px-1.5 py-0.5 rounded leading-none">재학중</span>
                    )}
                    {edu.major && <span className="text-slate-500 text-xs">{edu.major}</span>}
                    {edu.degree && <span className="text-xs text-slate-400">| {edu.degree}{edu.graduationStatus ? ` | ${edu.graduationStatus}` : ''}</span>}
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
        <Section title="기술 스택">
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
        <Section title="자격증">
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
                        {entry.startDate}{entry.endDate ? ` ~ ${entry.endDate}` : ''}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-xs">{entry.name}</div>
                        {entry.description && (
                          <p className="rich-content text-xs text-slate-500 mt-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.description }} />
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

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ResumePage({ data }: Props) {
  const { personalInfo } = data
  const sectionOrder = data.sectionOrder ?? DEFAULT_SECTION_ORDER
  const pages = buildResumePages(sectionOrder, data)

  return (
    <>
      {pages.map((pageSections, pageIdx) => (
        <div
          key={pageIdx}
          className="a4-page p-12 text-sm text-gray-800"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          {/* 첫 페이지: 개인정보 헤더 */}
          {pageIdx === 0 && (
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
          )}

{pageSections.map(key => (
            <React.Fragment key={key}>{renderSection(key, data)}</React.Fragment>
          ))}
        </div>
      ))}
    </>
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
