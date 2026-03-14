import { useState, useEffect } from 'react'
import type {
  ResumeData, CareerItem, EducationItem, SkillItem, CertificateItem,
  CustomSectionItem, CustomSectionEntry, CareerDescriptionItem, ProjectItem,
} from '../types/resume'
import { DEFAULT_SECTION_ORDER } from '../types/resume'

const generateId = () => Math.random().toString(36).substr(2, 9)
const STORAGE_KEY = 'resume2pdf_data'

const emptyData: ResumeData = {
  personalInfo: { name: '', birthDate: '', phone: '', email: '', address: '', photo: '' },
  introduction: '',
  careers: [],
  educations: [],
  skills: [],
  certificates: [],
  customSections: [],
  careerDescriptions: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
}

const sampleData: ResumeData = {
  personalInfo: {
    name: '홍길동',
    birthDate: '1990.01.01',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    address: '서울특별시 강남구',
    photo: '',
  },
  introduction: '안녕하세요. 저는 사용자 중심의 서비스를 만드는 것에 열정을 가진 개발자입니다.\n다양한 프로젝트 경험을 통해 팀워크와 문제 해결 능력을 키워왔으며,\n새로운 기술을 빠르게 습득하고 적용하는 것을 즐깁니다.',
  careers: [
    { id: generateId(), company: '(주)테크컴퍼니', department: '개발팀', position: '백엔드 개발자', startDate: '2020.03', endDate: '', isCurrent: true, description: 'API 설계 및 개발, 서버 인프라 관리' },
    { id: generateId(), company: '(주)스타트업', department: '개발팀', position: '풀스택 개발자', startDate: '2018.06', endDate: '2020.02', isCurrent: false, description: '웹 서비스 개발 및 유지보수' },
  ],
  educations: [
    { id: generateId(), school: '한국대학교', major: '컴퓨터공학과', degree: '학사', startDate: '2014.03', endDate: '2018.02', isCurrent: false, gpa: '3.8 / 4.5' },
  ],
  skills: [
    { id: generateId(), category: '언어', skills: 'Python, TypeScript, Java' },
    { id: generateId(), category: '프레임워크', skills: 'React, FastAPI, Spring Boot' },
    { id: generateId(), category: '도구', skills: 'Git, Docker, AWS' },
  ],
  certificates: [
    { id: generateId(), name: '정보처리기사', issuer: '한국산업인력공단', date: '2018.11' },
  ],
  customSections: [],
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  careerDescriptions: [
    {
      id: generateId(),
      company: '(주)테크컴퍼니',
      period: '2020.03 ~ 현재',
      role: '백엔드 개발자',
      projects: [
        { id: generateId(), name: '결제 시스템 개발', period: '2022.06 ~ 2023.03', description: '기존 레거시 결제 시스템을 MSA 기반으로 전환하는 프로젝트입니다.\n안정적인 서비스 운영을 위해 트랜잭션 처리 및 장애 대응 시스템을 구축했습니다.', techStack: 'Python, FastAPI, PostgreSQL, Redis, Kafka', achievements: '• 결제 처리 속도 40% 개선\n• 장애 발생률 95% 감소\n• 월간 거래량 500만 건 처리', image: '' },
        { id: generateId(), name: 'API Gateway 구축', period: '2021.03 ~ 2021.12', description: '마이크로서비스 간 통신을 위한 API Gateway를 설계하고 구현했습니다.', techStack: 'Node.js, Nginx, Docker, Kubernetes', achievements: '• API 응답 시간 30% 단축\n• 서비스 간 의존성 분리\n• 인증/인가 중앙화', image: '' },
      ],
    },
  ],
}

function loadFromStorage(): ResumeData | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as ResumeData
      if (!parsed.sectionOrder) parsed.sectionOrder = [...DEFAULT_SECTION_ORDER]
      return parsed
    }
  } catch {}
  return null
}

function reorderArray<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr]
  const [removed] = result.splice(from, 1)
  result.splice(to, 0, removed)
  return result
}

export function useResumeStore() {
  const [data, setData] = useState<ResumeData>(() => loadFromStorage() ?? emptyData)
  const [activeTab, setActiveTab] = useState<'resume' | 'career'>('resume')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // ── Personal Info ──────────────────────────────────────────────────────────
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }))
  }

  const updateIntroduction = (value: string) => {
    setData(prev => ({ ...prev, introduction: value }))
  }

  // ── Careers ────────────────────────────────────────────────────────────────
  const addCareer = () => {
    const item: CareerItem = { id: generateId(), company: '', department: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' }
    setData(prev => ({ ...prev, careers: [...prev.careers, item] }))
  }
  const updateCareer = (id: string, field: keyof CareerItem, value: string | boolean) => {
    setData(prev => ({ ...prev, careers: prev.careers.map(c => c.id === id ? { ...c, [field]: value } : c) }))
  }
  const removeCareer = (id: string) => {
    setData(prev => ({ ...prev, careers: prev.careers.filter(c => c.id !== id) }))
  }
  const reorderCareers = (from: number, to: number) => {
    setData(prev => ({ ...prev, careers: reorderArray(prev.careers, from, to) }))
  }

  // ── Education ──────────────────────────────────────────────────────────────
  const addEducation = () => {
    const item: EducationItem = { id: generateId(), school: '', major: '', degree: '학사', startDate: '', endDate: '', isCurrent: false, gpa: '' }
    setData(prev => ({ ...prev, educations: [...prev.educations, item] }))
  }
  const updateEducation = (id: string, field: keyof EducationItem, value: string | boolean) => {
    setData(prev => ({ ...prev, educations: prev.educations.map(e => e.id === id ? { ...e, [field]: value } : e) }))
  }
  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, educations: prev.educations.filter(e => e.id !== id) }))
  }
  const reorderEducations = (from: number, to: number) => {
    setData(prev => ({ ...prev, educations: reorderArray(prev.educations, from, to) }))
  }

  // ── Skills ─────────────────────────────────────────────────────────────────
  const addSkill = () => {
    const item: SkillItem = { id: generateId(), category: '', skills: '' }
    setData(prev => ({ ...prev, skills: [...prev.skills, item] }))
  }
  const updateSkill = (id: string, field: keyof SkillItem, value: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s) }))
  }
  const removeSkill = (id: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }))
  }
  const reorderSkills = (from: number, to: number) => {
    setData(prev => ({ ...prev, skills: reorderArray(prev.skills, from, to) }))
  }

  // ── Certificates ───────────────────────────────────────────────────────────
  const addCertificate = () => {
    const item: CertificateItem = { id: generateId(), name: '', issuer: '', date: '' }
    setData(prev => ({ ...prev, certificates: [...prev.certificates, item] }))
  }
  const updateCertificate = (id: string, field: keyof CertificateItem, value: string) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.map(c => c.id === id ? { ...c, [field]: value } : c) }))
  }
  const removeCertificate = (id: string) => {
    setData(prev => ({ ...prev, certificates: prev.certificates.filter(c => c.id !== id) }))
  }
  const reorderCertificates = (from: number, to: number) => {
    setData(prev => ({ ...prev, certificates: reorderArray(prev.certificates, from, to) }))
  }

  // ── Custom Sections ────────────────────────────────────────────────────────
  const addCustomSection = () => {
    const item: CustomSectionItem = { id: generateId(), title: '', entries: [] }
    setData(prev => ({ ...prev, customSections: [...prev.customSections, item] }))
  }
  const updateCustomSectionTitle = (id: string, title: string) => {
    setData(prev => ({ ...prev, customSections: prev.customSections.map(s => s.id === id ? { ...s, title } : s) }))
  }
  const removeCustomSection = (id: string) => {
    setData(prev => ({ ...prev, customSections: prev.customSections.filter(s => s.id !== id) }))
  }
  const reorderCustomSections = (from: number, to: number) => {
    setData(prev => ({ ...prev, customSections: reorderArray(prev.customSections, from, to) }))
  }

  const addCustomEntry = (sectionId: string) => {
    const item: CustomSectionEntry = { id: generateId(), startDate: '', endDate: '', name: '', description: '' }
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId ? { ...s, entries: [...s.entries, item] } : s
      ),
    }))
  }
  const updateCustomEntry = (sectionId: string, entryId: string, field: keyof CustomSectionEntry, value: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId
          ? { ...s, entries: s.entries.map(e => e.id === entryId ? { ...e, [field]: value } : e) }
          : s
      ),
    }))
  }
  const removeCustomEntry = (sectionId: string, entryId: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId ? { ...s, entries: s.entries.filter(e => e.id !== entryId) } : s
      ),
    }))
  }
  const reorderCustomEntries = (sectionId: string, from: number, to: number) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === sectionId ? { ...s, entries: reorderArray(s.entries, from, to) } : s
      ),
    }))
  }

  // ── Section Order ──────────────────────────────────────────────────────────
  const reorderSections = (from: number, to: number) => {
    setData(prev => {
      const current = prev.sectionOrder ?? [...DEFAULT_SECTION_ORDER]
      return { ...prev, sectionOrder: reorderArray(current, from, to) }
    })
  }

  // ── Career Descriptions ────────────────────────────────────────────────────
  const addCareerDescription = () => {
    const item: CareerDescriptionItem = { id: generateId(), company: '', period: '', role: '', projects: [] }
    setData(prev => ({ ...prev, careerDescriptions: [...prev.careerDescriptions, item] }))
  }
  const updateCareerDescription = (id: string, field: keyof CareerDescriptionItem, value: string) => {
    setData(prev => ({
      ...prev,
      careerDescriptions: prev.careerDescriptions.map(cd => cd.id === id ? { ...cd, [field]: value } : cd),
    }))
  }
  const removeCareerDescription = (id: string) => {
    setData(prev => ({ ...prev, careerDescriptions: prev.careerDescriptions.filter(cd => cd.id !== id) }))
  }
  const reorderCareerDescriptions = (from: number, to: number) => {
    setData(prev => ({ ...prev, careerDescriptions: reorderArray(prev.careerDescriptions, from, to) }))
  }

  const addProject = (careerDescId: string) => {
    const item: ProjectItem = { id: generateId(), name: '', period: '', description: '', techStack: '', achievements: '', image: '' }
    setData(prev => ({
      ...prev,
      careerDescriptions: prev.careerDescriptions.map(cd =>
        cd.id === careerDescId ? { ...cd, projects: [...cd.projects, item] } : cd
      ),
    }))
  }
  const updateProject = (careerDescId: string, projectId: string, field: keyof ProjectItem, value: string) => {
    setData(prev => ({
      ...prev,
      careerDescriptions: prev.careerDescriptions.map(cd =>
        cd.id === careerDescId
          ? { ...cd, projects: cd.projects.map(p => p.id === projectId ? { ...p, [field]: value } : p) }
          : cd
      ),
    }))
  }
  const removeProject = (careerDescId: string, projectId: string) => {
    setData(prev => ({
      ...prev,
      careerDescriptions: prev.careerDescriptions.map(cd =>
        cd.id === careerDescId
          ? { ...cd, projects: cd.projects.filter(p => p.id !== projectId) }
          : cd
      ),
    }))
  }
  const reorderProjects = (careerDescId: string, from: number, to: number) => {
    setData(prev => ({
      ...prev,
      careerDescriptions: prev.careerDescriptions.map(cd =>
        cd.id === careerDescId ? { ...cd, projects: reorderArray(cd.projects, from, to) } : cd
      ),
    }))
  }

  // ── Data persistence ───────────────────────────────────────────────────────
  const startNew = () => {
    setData(emptyData)
    localStorage.removeItem(STORAGE_KEY)
  }

  const loadSaved = (): ResumeData | null => loadFromStorage()

  const loadData = (newData: ResumeData) => {
    setData(newData)
  }

  const exportData = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `이력서_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (file: File, onSuccess?: () => void) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as ResumeData
        if (!parsed.sectionOrder) parsed.sectionOrder = [...DEFAULT_SECTION_ORDER]
        setData(parsed)
        onSuccess?.()
      } catch {
        alert('파일을 불러오는 데 실패했습니다. 올바른 JSON 파일인지 확인해주세요.')
      }
    }
    reader.readAsText(file)
  }

  const resetData = () => {
    if (confirm('모든 내용이 삭제됩니다. 계속하시겠습니까?')) {
      setData(emptyData)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // 샘플 데이터 로드 (새로 작성하기 → 샘플로 시작 옵션)
  const loadSample = () => {
    setData(sampleData)
  }

  return {
    data,
    activeTab,
    setActiveTab,
    updatePersonalInfo,
    updateIntroduction,
    addCareer, updateCareer, removeCareer, reorderCareers,
    addEducation, updateEducation, removeEducation, reorderEducations,
    addSkill, updateSkill, removeSkill, reorderSkills,
    addCertificate, updateCertificate, removeCertificate, reorderCertificates,
    addCustomSection, updateCustomSectionTitle, removeCustomSection, reorderCustomSections,
    addCustomEntry, updateCustomEntry, removeCustomEntry, reorderCustomEntries,
    reorderSections,
    addCareerDescription, updateCareerDescription, removeCareerDescription, reorderCareerDescriptions,
    addProject, updateProject, removeProject, reorderProjects,
    startNew, loadSaved, loadData, exportData, importData, resetData, loadSample,
  }
}
