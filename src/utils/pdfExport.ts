import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_WIDTH_PX = 794
const A4_WIDTH_MM = 210

interface LinkInfo {
  url: string
  x: number
  y: number
  width: number
  height: number
}

/**
 * 페이지 내 링크 요소들의 위치와 URL을 추출
 */
function extractLinks(page: HTMLElement): LinkInfo[] {
  const links = page.querySelectorAll<HTMLAnchorElement>('.pdf-link')
  const pageRect = page.getBoundingClientRect()
  const result: LinkInfo[] = []

  links.forEach(link => {
    const url = link.getAttribute('data-href') || link.href
    if (!url) return

    const rect = link.getBoundingClientRect()
    // 페이지 기준 상대 좌표 계산
    const x = rect.left - pageRect.left
    const y = rect.top - pageRect.top
    const width = rect.width
    const height = rect.height

    result.push({ url, x, y, width, height })
  })

  return result
}

/**
 * html2canvas 방식: DOM → 고해상도 캔버스 → PNG → PDF
 * height 제약 없이 실제 높이를 캡처하여 A4 비율로 삽입
 * 링크 요소는 PDF 내 클릭 가능한 하이퍼링크로 변환
 */
export async function exportToPdf(containerEl: HTMLElement, filename = '이력서.pdf') {
  const pages = containerEl.querySelectorAll<HTMLElement>('.a4-page')
  if (pages.length === 0) return

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]

    // 링크 정보 추출 (html2canvas 전에 해야 함)
    const links = extractLinks(page)

    const canvas = await html2canvas(page, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')

    // 실제 캔버스 비율로 PDF 높이 계산 (A4 너비 210mm 기준)
    const imgWidth = A4_WIDTH_MM
    const imgHeight = (canvas.height / canvas.width) * imgWidth

    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    // 링크 annotation 추가
    const pxToMm = A4_WIDTH_MM / A4_WIDTH_PX
    links.forEach(link => {
      const x = link.x * pxToMm
      const y = link.y * pxToMm
      const w = link.width * pxToMm
      const h = link.height * pxToMm

      pdf.link(x, y, w, h, { url: link.url })
    })
  }

  pdf.save(filename)
}

/**
 * 브라우저 네이티브 인쇄 방식
 * DOM을 직접 벡터로 렌더링 → 텍스트가 완전히 선명하고 복사 가능
 */
export function printAsPdf() {
  window.print()
}
