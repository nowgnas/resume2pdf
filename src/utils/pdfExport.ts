import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_WIDTH_PX = 794

/**
 * html2canvas 방식: DOM → 고해상도 캔버스 → PNG → PDF
 * height 제약 없이 실제 높이를 캡처하여 A4 비율로 삽입
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
    const imgWidth = 210
    const imgHeight = (canvas.height / canvas.width) * imgWidth

    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
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
