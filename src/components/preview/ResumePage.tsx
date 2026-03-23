import React from 'react'
import type { ResumeData, SectionKey, CareerItem, ProjectSummaryItem, EducationItem, SkillItem, CertificateItem, CustomSectionItem } from '../../types/resume'
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
const SECTION_HEADER_H = 32  // 섹션 헤더(타이틀+구분선+mb-3)
const SECTION_MB = 24        // mb-6
const ITEM_GAP = 14          // space-y-3.5

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

function lineCount(html: string, charsPerLine = 72) {
  const text = stripHtml(html).trim()
  if (!text) return 0
  return Math.max(1, Math.ceil(text.length / charsPerLine))
}

// ── 개별 항목 높이 계산 ──────────────────────────────────────────────────────
function estimateCareerItemH(career: CareerItem): number {
  const descLines = career.description ? lineCount(career.description) : 0
  return LINE_H + descLines * LINE_H + ITEM_GAP
}

function estimateProjectItemH(project: ProjectSummaryItem): number {
  const techH = project.techStack ? LINE_H : 0
  const summaryLines = project.summary ? lineCount(project.summary) : 0
  return LINE_H + techH + summaryLines * LINE_H + ITEM_GAP
}

function estimateEducationItemH(): number {
  return LINE_H + 12
}

function estimateSkillItemH(): number {
  return LINE_H + 8
}

function estimateCertificateItemH(): number {
  return LINE_H + 8
}

function estimateCustomEntryH(description: string): number {
  const descLines = description ? lineCount(description) : 0
  return LINE_H + descLines * LINE_H + 8
}

function estimateIntroductionH(introduction: string): number {
  if (!introduction) return 0
  return SECTION_HEADER_H + lineCount(introduction, 90) * LINE_H + 8 + SECTION_MB
}

// ── 렌더 청크 타입 정의 ─────────────────────────────────────────────────────
type RenderChunk =
  | { type: 'introduction'; content: string }
  | { type: 'section-header'; key: SectionKey; title: string; continued?: boolean }
  | { type: 'career-item'; item: CareerItem }
  | { type: 'project-item'; item: ProjectSummaryItem }
  | { type: 'education-item'; item: EducationItem }
  | { type: 'skill-item'; item: SkillItem }
  | { type: 'certificate-item'; item: CertificateItem }
  | { type: 'custom-section-header'; section: CustomSectionItem; continued?: boolean }
  | { type: 'custom-entry-item'; sectionId: string; entry: CustomSectionItem['entries'][0] }
  | { type: 'section-end' }

function getChunkHeight(chunk: RenderChunk): number {
  switch (chunk.type) {
    case 'introduction':
      return estimateIntroductionH(chunk.content)
    case 'section-header':
      return SECTION_HEADER_H
    case 'career-item':
      return estimateCareerItemH(chunk.item)
    case 'project-item':
      return estimateProjectItemH(chunk.item)
    case 'education-item':
      return estimateEducationItemH()
    case 'skill-item':
      return estimateSkillItemH()
    case 'certificate-item':
      return estimateCertificateItemH()
    case 'custom-section-header':
      return SECTION_HEADER_H
    case 'custom-entry-item':
      return estimateCustomEntryH(chunk.entry.description)
    case 'section-end':
      return SECTION_MB
    default:
      return 0
  }
}

// ── 청크 생성 ────────────────────────────────────────────────────────────────
function buildChunks(sectionOrder: SectionKey[], data: ResumeData): RenderChunk[] {
  const chunks: RenderChunk[] = []

  for (const key of sectionOrder) {
    switch (key) {
      case 'introduction':
        if (data.introduction) {
          chunks.push({ type: 'introduction', content: data.introduction })
        }
        break
      case 'careers':
        if (data.careers.length > 0) {
          chunks.push({ type: 'section-header', key: 'careers', title: '경력' })
          data.careers.forEach(item => chunks.push({ type: 'career-item', item }))
          chunks.push({ type: 'section-end' })
        }
        break
      case 'projects':
        if ((data.projects ?? []).length > 0) {
          chunks.push({ type: 'section-header', key: 'projects', title: '프로젝트' })
          ;(data.projects ?? []).forEach(item => chunks.push({ type: 'project-item', item }))
          chunks.push({ type: 'section-end' })
        }
        break
      case 'educations':
        if (data.educations.length > 0) {
          chunks.push({ type: 'section-header', key: 'educations', title: '학력' })
          data.educations.forEach(item => chunks.push({ type: 'education-item', item }))
          chunks.push({ type: 'section-end' })
        }
        break
      case 'skills':
        if (data.skills.length > 0) {
          chunks.push({ type: 'section-header', key: 'skills', title: '기술 스택' })
          data.skills.forEach(item => chunks.push({ type: 'skill-item', item }))
          chunks.push({ type: 'section-end' })
        }
        break
      case 'certificates':
        if (data.certificates.length > 0) {
          chunks.push({ type: 'section-header', key: 'certificates', title: '자격증' })
          data.certificates.forEach(item => chunks.push({ type: 'certificate-item', item }))
          chunks.push({ type: 'section-end' })
        }
        break
      case 'customSections':
        (data.customSections ?? []).forEach(section => {
          if (section.title && section.entries.length > 0) {
            chunks.push({ type: 'custom-section-header', section })
            section.entries.forEach(entry => chunks.push({ type: 'custom-entry-item', sectionId: section.id, entry }))
            chunks.push({ type: 'section-end' })
          }
        })
        break
    }
  }

  return chunks
}

// ── 페이지별 청크 분배 ────────────────────────────────────────────────────────
function buildPages(chunks: RenderChunk[]): RenderChunk[][] {
  const pages: RenderChunk[][] = [[]]
  let currentH = HEADER_H  // 첫 페이지는 헤더만큼 이미 사용
  let currentSectionKey: SectionKey | null = null
  let currentSectionTitle: string | null = null
  let currentCustomSection: CustomSectionItem | null = null

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const chunkH = getChunkHeight(chunk)

    // 현재 페이지에 안 들어가면 새 페이지로
    if (currentH + chunkH > PAGE_CONTENT_H && pages[pages.length - 1].length > 0) {
      pages.push([])
      currentH = 0

      // 섹션이 계속되면 "(계속)" 헤더 추가
      if (currentSectionKey && chunk.type !== 'section-header' && chunk.type !== 'section-end' && chunk.type !== 'introduction' && chunk.type !== 'custom-section-header') {
        if (currentCustomSection) {
          pages[pages.length - 1].push({ type: 'custom-section-header', section: currentCustomSection, continued: true })
          currentH += SECTION_HEADER_H
        } else if (currentSectionTitle) {
          pages[pages.length - 1].push({ type: 'section-header', key: currentSectionKey, title: currentSectionTitle, continued: true })
          currentH += SECTION_HEADER_H
        }
      }
    }

    // 섹션 상태 추적
    if (chunk.type === 'section-header') {
      currentSectionKey = chunk.key
      currentSectionTitle = chunk.title
      currentCustomSection = null
    } else if (chunk.type === 'custom-section-header') {
      currentSectionKey = 'customSections'
      currentSectionTitle = chunk.section.title
      currentCustomSection = chunk.section
    } else if (chunk.type === 'section-end') {
      currentSectionKey = null
      currentSectionTitle = null
      currentCustomSection = null
    }

    pages[pages.length - 1].push(chunk)
    currentH += chunkH
  }

  return pages.filter(p => p.length > 0)
}

// ── 청크 렌더러 ───────────────────────────────────────────────────────────────
function renderChunk(chunk: RenderChunk, index: number) {
  switch (chunk.type) {
    case 'introduction':
      return (
        <div key={`intro-${index}`} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">자기소개</h2>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <p className="rich-content text-xs text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: chunk.content }} />
        </div>
      )

    case 'section-header':
      return (
        <div key={`header-${chunk.key}-${index}`} className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            {chunk.title}
          </h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      )

    case 'custom-section-header':
      return (
        <div key={`custom-header-${chunk.section.id}-${index}`} className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
            {chunk.section.title}
          </h2>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      )

    case 'career-item': {
      const career = chunk.item
      return (
        <div key={career.id} className="flex gap-4 mb-3.5">
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
      )
    }

    case 'project-item': {
      const project = chunk.item
      return (
        <div key={project.id} className="flex gap-4 mb-3">
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
      )
    }

    case 'education-item': {
      const edu = chunk.item
      return (
        <div key={edu.id} className="flex gap-4 mb-3">
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
      )
    }

    case 'skill-item': {
      const skill = chunk.item
      return (
        <div key={skill.id} className="flex gap-4 items-start mb-2">
          <span className="font-semibold text-slate-600 w-20 shrink-0 text-xs pt-0.5">{skill.category}</span>
          <div className="flex flex-wrap gap-1">
            {skill.skills.split(',').map((s, i, arr) => (
              <span key={i} className="text-xs text-indigo-600 font-medium">
                {s.trim()}{i < arr.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>
        </div>
      )
    }

    case 'certificate-item': {
      const cert = chunk.item
      return (
        <div key={cert.id} className="flex gap-4 mb-2">
          <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">{cert.date}</div>
          <div className="flex-1 flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 text-xs">{cert.name}</span>
            {cert.issuer && <span className="text-slate-400 text-xs">{cert.issuer}</span>}
          </div>
        </div>
      )
    }

    case 'custom-entry-item': {
      const entry = chunk.entry
      return (
        <div key={entry.id} className="flex gap-4 mb-2">
          <div className="text-xs text-slate-400 shrink-0 w-28 pt-0.5">
            {entry.startDate}{entry.endDate ? ` ~ ${entry.endDate}` : ''}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-800 text-xs">{entry.name}</div>
            {entry.description && (
              entry.isLink ? (
                <a
                  href={entry.description}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdf-link text-xs text-indigo-600 hover:text-indigo-800 underline mt-0.5 block"
                  data-href={entry.description}
                >
                  {entry.description}
                </a>
              ) : (
                <p className="rich-content text-xs text-slate-500 mt-0.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.description }} />
              )
            )}
          </div>
        </div>
      )
    }

    case 'section-end':
      return <div key={`end-${index}`} className="mb-6" />

    default:
      return null
  }
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ResumePage({ data }: Props) {
  const { personalInfo } = data
  const sectionOrder = data.sectionOrder ?? DEFAULT_SECTION_ORDER
  const chunks = buildChunks(sectionOrder, data)
  const pages = buildPages(chunks)

  return (
    <>
      {pages.map((pageChunks, pageIdx) => (
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

          {pageChunks.map((chunk, idx) => (
            <React.Fragment key={idx}>{renderChunk(chunk, idx)}</React.Fragment>
          ))}
        </div>
      ))}
    </>
  )
}
