import type { RKDocument } from '../types/document';

export const exportDocumentToStandaloneHtml = (doc: RKDocument) => {
  // Find all page sheets or continuous canvas
  const pageSheets = document.querySelectorAll('.print-page-sheet');
  const continuousCanvas = document.getElementById('print-canvas');

  let combinedContent = '';

  if (pageSheets && pageSheets.length > 0) {
    pageSheets.forEach((sheet) => {
      const clone = sheet.cloneNode(true) as HTMLElement;
      // Remove all edit/screen elements
      clone.querySelectorAll('.no-print').forEach((el) => el.remove());
      clone.querySelectorAll('[contenteditable]').forEach((el) => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('suppresscontenteditablewarning');
      });
      combinedContent += `<div class="a4-sheet">${clone.innerHTML}</div>\n`;
    });
  } else if (continuousCanvas) {
    const clone = continuousCanvas.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.no-print').forEach((el) => el.remove());
    clone.querySelectorAll('[contenteditable]').forEach((el) => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('suppresscontenteditablewarning');
    });
    combinedContent = `<div class="a4-sheet">${clone.innerHTML}</div>`;
  } else {
    alert('Canvas element not found for export');
    return;
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title} — ${doc.headerConfig.instituteName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm;
    }
    body {
      font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b0f19;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
      padding: 30px 10px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .font-heading {
      font-family: 'Outfit', 'Noto Sans Devanagari', sans-serif;
    }
    .a4-sheet {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto 30px auto;
      background: #ffffff;
      padding: 38px;
      box-shadow: 0 16px 50px -12px rgba(0, 0, 0, 0.5);
      border-radius: 2px;
      box-sizing: border-box;
      position: relative;
    }
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .a4-sheet {
        width: 100% !important;
        max-width: 100% !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        border-radius: 0 !important;
        break-after: page !important;
        page-break-after: always !important;
      }
      .break-inside-avoid, .defbox, .caution, .life, .casebox, .exam-tip, .formula-box, .worked-box, .activity-box, .summary-box, .qcard, tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  ${combinedContent}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title.replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
