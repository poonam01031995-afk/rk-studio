import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function createSamplePdf() {
  const pdfDoc = await PDFDocument.create();
  const _timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const _timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // PAGE 1: Executive Summary & System Architecture
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page1.getSize();

  // Header banner
  page1.drawRectangle({
    x: 40,
    y: height - 100,
    width: width - 80,
    height: 60,
    color: rgb(0.12, 0.22, 0.45),
  });

  page1.drawText('INTELLIGENT KNOWLEDGE SYNTHESIS REPORT', {
    x: 55,
    y: height - 65,
    size: 16,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  page1.drawText('Vol. 24 | Next-Generation Document Processing & Drag-and-Drop Workflows', {
    x: 55,
    y: height - 85,
    size: 10,
    font: helvetica,
    color: rgb(0.85, 0.9, 1),
  });

  // Section 1: Executive Overview
  page1.drawText('1. Executive Overview & Problem Formulation', {
    x: 50,
    y: height - 130,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.22, 0.45),
  });

  const p1Text = [
    'Knowledge workers spend more than 38% of their analytical hours synthesizing unstructured',
    'information from portable document formats (PDFs). Traditional approaches either isolate the reader',
    'in static viewer silos or require cumbersome manual copy-pasting between disparate software suites.',
    '',
    'Key Discovery: Active spatial reading improves synthesis recall by 64% when direct excerpt drag-and-drop',
    'is coupled with continuous bidirectional linking back to original contextual coordinates.',
  ];

  let currentY = height - 155;
  for (const line of p1Text) {
    if (line.startsWith('Key Discovery:')) {
      page1.drawRectangle({
        x: 45,
        y: currentY - 8,
        width: width - 90,
        height: 28,
        color: rgb(0.93, 0.95, 1),
        borderColor: rgb(0.2, 0.45, 0.85),
        borderWidth: 1,
      });
      page1.drawText(line, {
        x: 55,
        y: currentY + 2,
        size: 9.5,
        font: helveticaBold,
        color: rgb(0.1, 0.3, 0.7),
      });
    } else {
      page1.drawText(line, {
        x: 50,
        y: currentY,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
    currentY -= 18;
  }

  // Section 2: Architectural Breakdown
  currentY -= 15;
  page1.drawText('2. Core Architectural Components', {
    x: 50,
    y: currentY,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.22, 0.45),
  });
  currentY -= 25;

  const points = [
    '[A] Dual-Layer Canvas Renderer: High-performance PDF rendering coupled with an SVG/HTML5 interactive overlay.',
    '[B] Excerpt Bounding Resolver: Translates selection coordinates into resilient page anchors.',
    '[C] Structured Note Compiler: Aggregates atomic insights into thematic outlines and exportable deliverables.',
    '[D] In-Situ Annotation Burner: Embeds user edits, signatures, and callout stamps into clean vector PDF output.',
  ];

  for (const pt of points) {
    page1.drawText(pt, {
      x: 55,
      y: currentY,
      size: 9.5,
      font: helvetica,
      color: rgb(0.15, 0.15, 0.15),
    });
    currentY -= 20;
  }

  // Diagram Box on Page 1
  currentY -= 15;
  page1.drawRectangle({
    x: 50,
    y: currentY - 140,
    width: width - 100,
    height: 140,
    color: rgb(0.97, 0.98, 0.99),
    borderColor: rgb(0.8, 0.85, 0.9),
    borderWidth: 1,
  });

  page1.drawText('FIGURE 1: BIDIRECTIONAL DATAFLOW PIPELINE', {
    x: 65,
    y: currentY - 20,
    size: 10,
    font: helveticaBold,
    color: rgb(0.3, 0.4, 0.5),
  });

  // Visual flow boxes
  const boxWidth = 100;
  const boxHeight = 45;
  const startX = 75;
  const boxY = currentY - 85;

  // Box 1: PDF Source
  page1.drawRectangle({ x: startX, y: boxY, width: boxWidth, height: boxHeight, color: rgb(0.2, 0.4, 0.8) });
  page1.drawText('PDF Engine', { x: startX + 18, y: boxY + 26, size: 9, font: helveticaBold, color: rgb(1,1,1) });
  page1.drawText('Selection / Snip', { x: startX + 12, y: boxY + 12, size: 8, font: helvetica, color: rgb(0.9,0.9,1) });

  // Arrow 1
  page1.drawText('== Drag ==>', { x: startX + boxWidth + 8, y: boxY + 18, size: 10, font: helveticaBold, color: rgb(0.4, 0.5, 0.6) });

  // Box 2: Drag Protocol
  page1.drawRectangle({ x: startX + 175, y: boxY, width: boxWidth, height: boxHeight, color: rgb(0.1, 0.65, 0.45) });
  page1.drawText('Live Canvas', { x: startX + 195, y: boxY + 26, size: 9, font: helveticaBold, color: rgb(1,1,1) });
  page1.drawText('Coordinate Link', { x: startX + 185, y: boxY + 12, size: 8, font: helvetica, color: rgb(0.9,1,0.9) });

  // Arrow 2
  page1.drawText('== Drop ==>', { x: startX + 175 + boxWidth + 8, y: boxY + 18, size: 10, font: helveticaBold, color: rgb(0.4, 0.5, 0.6) });

  // Box 3: Note Compiler
  page1.drawRectangle({ x: startX + 350, y: boxY, width: boxWidth, height: boxHeight, color: rgb(0.55, 0.25, 0.75) });
  page1.drawText('Compile Notes', { x: startX + 368, y: boxY + 26, size: 9, font: helveticaBold, color: rgb(1,1,1) });
  page1.drawText('Synthesis & Export', { x: startX + 360, y: boxY + 12, size: 8, font: helvetica, color: rgb(1,0.9,1) });

  page1.drawText('Note: Dragging excerpts directly creates bidirectional citations linked to exact page coordinates.', {
    x: 65,
    y: currentY - 125,
    size: 8.5,
    font: helvetica,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Footer
  page1.drawText('DocFlow Research Lab | Page 1 of 2', {
    x: width / 2 - 80,
    y: 30,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  // PAGE 2: Comparative Analysis & Actionable Takeaways
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  
  page2.drawText('3. Comparative Workflow Efficiency Metrics', {
    x: 50,
    y: height - 60,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.22, 0.45),
  });

  // Table header
  let tableY = height - 95;
  page2.drawRectangle({
    x: 50,
    y: tableY - 5,
    width: width - 100,
    height: 25,
    color: rgb(0.18, 0.28, 0.52),
  });

  page2.drawText('Evaluation Metric', { x: 60, y: tableY + 3, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });
  page2.drawText('Traditional PDF Workflow', { x: 210, y: tableY + 3, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });
  page2.drawText('DocFlow Drag & Compile', { x: 375, y: tableY + 3, size: 10, font: helveticaBold, color: rgb(1, 1, 1) });

  const rows = [
    ['Excerpt Extraction Time', '4.2 minutes per page', '0.6 minutes (-85%)'],
    ['Context Fragmentation Error', 'High (broken references)', 'Near Zero (live link)'],
    ['Annotation Interactivity', 'Static / Read-only notes', 'Dynamic draggable stamps'],
    ['Multi-source Synthesis', 'Scattered external docs', 'Unified Compiled Outline'],
    ['Bi-directional Navigation', 'Unsupported', '1-Click Jump to Source'],
  ];

  tableY -= 25;
  rows.forEach((row, i) => {
    const bgColor = i % 2 === 0 ? rgb(0.96, 0.97, 0.99) : rgb(1, 1, 1);
    page2.drawRectangle({
      x: 50,
      y: tableY - 5,
      width: width - 100,
      height: 22,
      color: bgColor,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 0.5,
    });
    page2.drawText(row[0], { x: 60, y: tableY + 2, size: 9, font: helveticaBold, color: rgb(0.2, 0.2, 0.2) });
    page2.drawText(row[1], { x: 210, y: tableY + 2, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
    page2.drawText(row[2], { x: 375, y: tableY + 2, size: 9, font: helveticaBold, color: rgb(0.08, 0.52, 0.32) });
    tableY -= 22;
  });

  // Section 4: Implementation Blueprint
  tableY -= 20;
  page2.drawText('4. Critical Strategic Recommendations', {
    x: 50,
    y: tableY,
    size: 14,
    font: helveticaBold,
    color: rgb(0.12, 0.22, 0.45),
  });

  tableY -= 25;
  const strategies = [
    'Strategy Alpha: Treat annotations as first-class graph entities rather than passive graphical overlays.',
    'Strategy Beta: Support direct snipping of non-text entities like figures, chemical formulas, and charts.',
    'Strategy Gamma: Provide an instant "Compile to Digest" feature that transforms atomic cards into structured markdown.',
    'Strategy Delta: Maintain lossless vector-accurate burning back to standard PDF specifications without quality loss.',
  ];

  for (const strat of strategies) {
    page2.drawText(strat, {
      x: 55,
      y: tableY,
      size: 9.5,
      font: helvetica,
      color: rgb(0.18, 0.18, 0.18),
    });
    tableY -= 22;
  }

  // Stamp simulation on Page 2
  page2.drawRectangle({
    x: width - 190,
    y: tableY - 45,
    width: 140,
    height: 40,
    color: rgb(0.98, 0.92, 0.92),
    borderColor: rgb(0.85, 0.2, 0.2),
    borderWidth: 2,
  });
  page2.drawText('VERIFIED RESEARCH', {
    x: width - 180,
    y: tableY - 25,
    size: 10,
    font: helveticaBold,
    color: rgb(0.85, 0.2, 0.2),
  });
  page2.drawText('Peer Reviewed Draft 2026', {
    x: width - 176,
    y: tableY - 38,
    size: 7.5,
    font: helvetica,
    color: rgb(0.65, 0.15, 0.15),
  });

  // Footer
  page2.drawText('DocFlow Research Lab | Page 2 of 2', {
    x: width / 2 - 80,
    y: 30,
    size: 9,
    font: helvetica,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'sample-paper.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Sample PDF successfully created at:', outputPath);
}

createSamplePdf().catch(console.error);
