import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    text-align: center;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo-icon {
    width: 56px;
    height: 56px;
    background: #6366f1;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-text {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    letter-spacing: -0.5px;
  }
  .headline {
    font-size: 52px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1px;
    line-height: 1.15;
  }
  .headline span {
    color: #6366f1;
  }
  .sub {
    font-size: 22px;
    color: #64748b;
    font-weight: 400;
    line-height: 1.6;
  }
  .badges {
    display: flex;
    gap: 12px;
    margin-top: 4px;
  }
  .badge {
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 500;
  }
  .badge-primary {
    background: #6366f1;
    color: white;
  }
  .badge-secondary {
    background: white;
    color: #475569;
    border: 1.5px solid #e2e8f0;
  }
  .deco-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.12;
    background: #6366f1;
  }
  .c1 { width: 320px; height: 320px; top: -80px; right: -60px; }
  .c2 { width: 200px; height: 200px; bottom: -60px; left: -40px; }
  .c3 { width: 120px; height: 120px; bottom: 80px; right: 120px; }
</style>
</head>
<body>
  <div class="deco-circle c1"></div>
  <div class="deco-circle c2"></div>
  <div class="deco-circle c3"></div>
  <div class="container">
    <div class="logo-row">
      <div class="logo-icon">
        <svg width="32" height="32" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <span class="logo-text">resume2pdf</span>
    </div>
    <div class="headline">이력서를 <span>PDF</span>로<br>한 번에</div>
    <div class="sub">무료 온라인 이력서 생성기 · 설치 없이 바로 사용</div>
    <div class="badges">
      <span class="badge badge-primary">이력서 작성</span>
      <span class="badge badge-secondary">경력 기술서</span>
      <span class="badge badge-secondary">PDF 다운로드</span>
    </div>
  </div>
</body>
</html>`

const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630 })
await page.setContent(html, { waitUntil: 'networkidle0' })

const outputPath = resolve(__dirname, '../public/og-image.png')
await page.screenshot({ path: outputPath, type: 'png' })
await browser.close()

console.log('✅ OG image generated:', outputPath)
