export interface PersonalInfo {
  name: string
  birthDate: string
  phone: string
  email: string
  address: string
  photo: string // base64 or url
}

export interface CareerItem {
  id: string
  company: string
  department: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

export interface EducationItem {
  id: string
  school: string
  major: string
  degree: string
  graduationStatus: string
  startDate: string
  endDate: string
  isCurrent: boolean
  gpa: string
}

export interface SkillItem {
  id: string
  category: string
  skills: string
}

export interface CertificateItem {
  id: string
  name: string
  issuer: string
  date: string
}

export interface CareerDescriptionItem {
  id: string
  company: string
  period: string
  role: string
  projects: ProjectItem[]
}

export interface ProjectItem {
  id: string
  name: string
  period: string
  description: string
  techStack: string
  achievements: string
  image?: string // base64 or url
}

export interface ProjectSummaryItem {
  id: string
  name: string
  organization: string
  period: string
  techStack: string
  summary: string
}

export interface CustomSectionEntry {
  id: string
  startDate: string
  endDate: string
  name: string
  description: string
  isLink: boolean
}

export interface CustomSectionItem {
  id: string
  title: string
  entries: CustomSectionEntry[]
}

export type SectionKey = 'introduction' | 'careers' | 'projects' | 'educations' | 'skills' | 'certificates' | 'customSections'

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'introduction', 'careers', 'projects', 'educations', 'skills', 'certificates', 'customSections',
]

export interface ResumeData {
  personalInfo: PersonalInfo
  introduction: string
  careers: CareerItem[]
  projects: ProjectSummaryItem[]
  educations: EducationItem[]
  skills: SkillItem[]
  certificates: CertificateItem[]
  customSections: CustomSectionItem[]
  careerDescriptions: CareerDescriptionItem[]
  sectionOrder: SectionKey[]
}
