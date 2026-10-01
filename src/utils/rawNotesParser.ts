import type { ContentBlock } from '../types/document';

/**
 * Intelligent parser that converts raw text, outlines, or markdown from D:\ drive files
 * into modular RK Institute pedagogical blocks.
 */
export function parseRawNotesToBlocks(rawText: string): ContentBlock[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/);
  const blocks: ContentBlock[] = [];

  let i = 0;
  const generateId = (prefix: string) =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // 1. Heading 1 -> Hero Banner or H1
    if (line.startsWith('# ')) {
      const text = line.replace(/^#\s+/, '').trim();
      blocks.push({
        id: generateId('heading'),
        type: 'heading',
        level: 1,
        text,
        tag: 'MAIN TOPIC • NCERT',
      });
      i++;
      continue;
    }

    // 2. Heading 2 -> H2
    if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '').trim();
      blocks.push({
        id: generateId('heading'),
        type: 'heading',
        level: 2,
        text,
        tag: 'SECTION • CONCEPT',
      });
      i++;
      continue;
    }

    // 3. Heading 3 -> H3
    if (line.startsWith('### ')) {
      const text = line.replace(/^###\s+/, '').trim();
      blocks.push({
        id: generateId('heading'),
        type: 'heading',
        level: 3,
        text,
      });
      i++;
      continue;
    }

    // 4. Questions with MCQs or Descriptive (e.g. Q1. or 1. or Question:)
    const qMatch = line.match(/^(?:Q(?:uestion)?\.?\s*(\d+)?:?|(\d+)\.)\s*(.+)/i);
    if (qMatch) {
      const qNum = qMatch[1] || qMatch[2] || `${blocks.filter(b => b.type === 'question-card').length + 1}`;
      const questionText = qMatch[3] || line;
      const options: string[] = [];
      let answer = '';
      let explanation = '';

      i++;
      // Check subsequent lines for options (a), (b), (c), (d) or Ans:
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (!nextLine) {
          i++;
          break;
        }

        const optMatch = nextLine.match(/^(?:\(?([a-dA-D1-4क-घ])\)?|\b([a-dA-D1-4क-घ])\.)\s*(.+)/);
        if (optMatch) {
          options.push(optMatch[3]);
          i++;
          continue;
        }

        const ansMatch = nextLine.match(/^(?:Ans(?:wer)?|उत्तर):\s*(.+)/i);
        if (ansMatch) {
          answer = ansMatch[1].trim();
          i++;
          continue;
        }

        const expMatch = nextLine.match(/^(?:Explanation|व्याख्या):\s*(.+)/i);
        if (expMatch) {
          explanation = expMatch[1].trim();
          i++;
          continue;
        }

        break;
      }

      blocks.push({
        id: generateId('qcard'),
        type: 'question-card',
        qno: `Q${qNum}`,
        marks: options.length > 0 ? '1 Mark' : '3 Marks',
        hot: /pyq|important|repeated/i.test(line),
        question: questionText,
        questionType: options.length >= 2 ? 'mcq' : 'descriptive',
        options: options.length >= 2 ? options : undefined,
        answer: answer || (options.length > 0 ? options[0] : undefined),
        explanation: explanation || undefined,
        showSolution: Boolean(explanation || answer),
      });
      continue;
    }

    // 5. Caution / Anti-Trap Box
    if (/^(?:>\s*\[!WARNING\]|>\s*\[!CAUTION\]|>\s*Caution:|Caution:|सावधानी:)/i.test(line)) {
      const content = line.replace(/^(?:>\s*\[!(?:WARNING|CAUTION)\]|>\s*Caution:|Caution:|सावधानी:)\s*/i, '').trim();
      blocks.push({
        id: generateId('caution'),
        type: 'box-caution',
        title: 'सावधानी चेकपॉइंट • परीक्षा जाल (EXAM TRAP ALERT)',
        content: content || 'इस अवधारणा में अक्सर होने वाली भ्रामक गलतियों से सावधान रहें।',
        misconception: 'भ्रांति (Common Trap): गलत धारणा',
        reality: 'तथ्य (Board Fact): सही NCERT नियम',
      });
      i++;
      continue;
    }

    // 6. Definition Box
    if (/^(?:>\s*\[!DEFINITION\]|>\s*Definition:|Def:|परिभाषा:)/i.test(line)) {
      const content = line.replace(/^(?:>\s*\[!DEFINITION\]|>\s*Definition:|Def:|परिभाषा:)\s*/i, '').trim();
      const parts = content.split(/[-–—:]/);
      const term = parts[0]?.trim() || 'मुख्य अवधारणा / Technical Term';
      const def = parts.slice(1).join('—').trim() || content;

      blocks.push({
        id: generateId('defbox'),
        type: 'box-definition',
        term,
        definition: def,
        points: [
          '1. सरल अर्थ: अवधारणा का प्राथमिक और व्यावहारिक स्वरूप।',
          '2. NCERT मानक: बोर्ड परीक्षा मार्किंग स्कीम के अनुकूल निष्कर्ष।',
        ],
        memoryHook: 'Devanagari Hook: सहज उदाहरण जिससे यह परिभाषा परीक्षा हॉल में तुरंत याद आ जाए!',
      });
      i++;
      continue;
    }

    // 7. General Note / Lead Card
    if (/^(?:>\s*\[!NOTE\]|>\s*\[!TIP\]|>\s*Note:|Note:|ध्यान दें:)/i.test(line)) {
      const content = line.replace(/^(?:>\s*\[!(?:NOTE|TIP)\]|>\s*Note:|Note:|ध्यान दें:)\s*/i, '').trim();
      blocks.push({
        id: generateId('lead'),
        type: 'box-lead',
        badge: '📖 महत्वपूर्ण अवधारणा • KEY NOTE',
        text: content,
      });
      i++;
      continue;
    }

    // 8. Formula Box ($...$ or Formula:)
    if (/^(?:Formula:|सूत्र:|\$\$.+\$\$)/i.test(line)) {
      const expr = line.replace(/^(?:Formula:|सूत्र:)\s*/i, '').replace(/^\$\$|\$\$$/g, '').trim();
      blocks.push({
        id: generateId('formula'),
        type: 'box-formula',
        formulaName: 'गणितीय सूत्र / Mathematical & Scientific Law',
        formulaExpr: expr || 'K = \\frac{1}{1 - MPC}',
        description: 'परीक्षा में संबंधित चरों (variables) की स्पष्ट इकाइयां लिखना अनिवार्य है।',
        variables: [
          { symbol: 'K', meaning: 'निवेश गुणक (Investment Multiplier)', unit: 'ratio' },
          { symbol: 'MPC', meaning: 'सीमांत उपभोग प्रवृत्ति', unit: '0 to 1' },
        ],
      });
      i++;
      continue;
    }

    // 9. Bullet Lists (- or * or numbered list item)
    if (/^[-*•]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const bulletItems: { id: string; text: string }[] = [];
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (/^[-*•]\s+(.+)/.test(nextLine)) {
          const itemText = nextLine.replace(/^[-*•]\s+/, '');
          bulletItems.push({ id: `${bulletItems.length + 1}`, text: itemText });
          i++;
        } else if (/^\d+\.\s+(.+)/.test(nextLine)) {
          const itemText = nextLine.replace(/^\d+\.\s+/, '');
          bulletItems.push({ id: `${bulletItems.length + 1}`, text: itemText });
          i++;
        } else {
          break;
        }
      }

      blocks.push({
        id: generateId('bullets'),
        type: 'bullet-list',
        title: 'मुख्य बिंदु व विशेषताएं (Key Highlights):',
        style: 'check',
        items: bulletItems,
      });
      continue;
    }

    // 10. Markdown Tables (| col | col |)
    if (line.startsWith('|') && line.endsWith('|')) {
      const headers = line.split('|').map(c => c.trim()).filter(Boolean);
      i++;
      // Check divider
      if (i < lines.length && /^\|[-:\s|]+\|$/.test(lines[i].trim())) {
        i++;
      }
      const rows: string[][] = [];
      while (i < lines.length) {
        const rowLine = lines[i].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
          const rowCells = rowLine.split('|').map(c => c.trim()).filter(Boolean);
          rows.push(rowCells);
          i++;
        } else {
          break;
        }
      }

      blocks.push({
        id: generateId('table'),
        type: 'data-table',
        caption: 'अवधारणा तुलना सारणी (Comparative Analysis Table)',
        headers: headers.length > 0 ? headers : ['आधार (Parameter)', 'पहलू A', 'पहलू B'],
        rows: rows.length > 0 ? rows : [['विशेषता 1', 'विवरण A', 'विवरण B']],
      });
      continue;
    }

    // 11. Default fallback: Paragraph Block
    blocks.push({
      id: generateId('p'),
      type: 'paragraph',
      text: line,
    });
    i++;
  }

  return blocks;
}
