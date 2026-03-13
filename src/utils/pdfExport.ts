import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_WIDTH_PX = 794
const A4_HEIGHT_PX = 1123

/**
 * html2canvas 방식: DOM → 고해상도 캔버스 → PNG → PDF
 * scale: 3 (3배 해상도), PNG 무손실 포맷 사용
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

    const canvas = await html2canvas(page, {
      scale: 3,             // 3배 해상도 (2382 × 3369px)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: A4_WIDTH_PX,
      height: A4_HEIGHT_PX,
      windowWidth: A4_WIDTH_PX,
      windowHeight: A4_HEIGHT_PX,
      logging: false,
    })

    // PNG: 무손실 포맷 — 텍스트/선 선명도 유지
    const imgData = canvas.toDataURL('image/png')

    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
  }

  pdf.save(filename)
}

/**
 * 브라우저 네이티브 인쇄 방식
 * DOM을 직접 벡터로 렌더링 → 텍스트가 완전히 선명하고 복사 가능
 * "PDF로 저장" 선택 시 고품질 PDF 생성
 */
export function printAsPdf() {
  window.print()
}
