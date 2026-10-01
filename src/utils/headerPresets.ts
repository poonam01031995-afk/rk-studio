import type { SavedHeaderTemplate, RKDocument } from '../types/document';

const SAVED_HEADERS_KEY = 'rk_docflow_saved_headers';

export const BUILTIN_HEADER_TEMPLATES: SavedHeaderTemplate[] = [
  {
    id: 'header-crest-swaroop',
    name: '🏛️ RK Swaroop Nagar Crest Masthead',
    createdAt: 'System Preset',
    preset: 'official-crest',
    headerConfig: {
      instituteName: 'RK INSTITUTE OF LEARNING',
      tagline: 'Center for Excellence • Swaroop Nagar, Delhi-110042',
      phone: '7903952008',
      address: 'Swaroop Nagar, Kushal Road, Delhi',
      examSeries: 'CBSE Secondary Board Preparatory Series 2026-27',
      studentFields: false,
      marks: '100',
      time: '3 Hours',
    },
    className: 'Class 10',
    subject: 'Economics',
    chapterNumber: 'Chapter 2',
    chapterTitle: 'भारतीय अर्थव्यवस्था के क्षेत्रक (Sectors of Indian Economy)',
  },
  {
    id: 'header-diagnostic-exam',
    name: '📝 Diagnostic Periodic Assessment Banner',
    createdAt: 'System Preset',
    preset: 'assessment-banner',
    headerConfig: {
      instituteName: 'RK INSTITUTE OF LEARNING',
      tagline: 'Strictly Aligned to CBSE Curriculum & Marking Scheme 2026-27',
      phone: '7903952008',
      address: 'Swaroop Nagar Center',
      examSeries: 'PERIODIC DIAGNOSTIC ASSESSMENT — BOARD REVISION MOCK',
      studentFields: true,
      marks: '80 / 100',
      time: '3.00 Hours',
    },
    className: 'Class 10',
    subject: 'Polity',
    chapterNumber: 'Unit Assessment',
    chapterTitle: 'लोकतांत्रिक राजनीति एवं अधिकार (Democratic Rights)',
  },
  {
    id: 'header-english-formal',
    name: '✍️ English Writing & Literature Masthead',
    createdAt: 'System Preset',
    preset: 'english-formal',
    headerConfig: {
      instituteName: 'R K INSTITUTE OF LEARNING',
      tagline: 'English Language & Literature • Secondary Curriculum (Session 2026–27)',
      phone: '7903952008',
      address: 'Delhi-110042',
      examSeries: 'CBSE Marking Scheme & Model Writing Formats',
      studentFields: false,
      marks: '80',
      time: '3 Hours',
    },
    className: 'Class 9 & 10',
    subject: 'English',
    chapterNumber: 'Module 1',
    chapterTitle: 'Formal Analytical Paragraph & Letter Writing',
  },
  {
    id: 'header-pe-bilingual',
    name: '🏃 Physical Education Section Bar',
    createdAt: 'System Preset',
    preset: 'pe-bar',
    headerConfig: {
      instituteName: 'RK INSTITUTE',
      tagline: 'शारीरिक शिक्षा (Physical Education) — आम बोल-चाल में नोट्स',
      phone: '7903952008',
      address: 'Swaroop Nagar Campus',
      examSeries: 'CBSE Class 11-12 Board Theory & Practical Guide',
      studentFields: false,
      marks: '70',
      time: '3 Hours',
    },
    className: 'Class 11/12',
    subject: 'Physical Education',
    chapterNumber: 'यूनिट 1',
    chapterTitle: 'शारीरिक पुष्टि, सुयोग्यता और जीवन शैली (Fitness & Lifestyle)',
  },
  {
    id: 'header-modern-navy',
    name: '🌌 Modern Academic Executive Navy',
    createdAt: 'System Preset',
    preset: 'modern-hero',
    headerConfig: {
      instituteName: 'RK INSTITUTE OF LEARNING',
      tagline: 'Empowering Minds • Board Preparation & High Achievers Club',
      phone: '7903952008',
      address: 'Delhi',
      examSeries: 'Competitive Foundation Series',
      studentFields: false,
      marks: '100',
      time: '3 Hours',
    },
    className: 'Class 10',
    subject: 'Science',
    chapterNumber: 'Chapter 12',
    chapterTitle: 'विद्युत एवं परिपथ (Electricity & Ohm\'s Law)',
  },
  {
    id: 'header-minimal-rule',
    name: '⚡ Minimal Academic Single-Line Rule',
    createdAt: 'System Preset',
    preset: 'minimal-running',
    headerConfig: {
      instituteName: 'RK INSTITUTE',
      tagline: 'Quick Revision Study Notes',
      phone: '7903952008',
      address: 'Delhi',
      examSeries: 'Quick Revision',
      studentFields: false,
      marks: '50',
      time: '2 Hours',
    },
    className: 'Class 10',
    subject: 'Geography',
    chapterNumber: 'Ch 4',
    chapterTitle: 'कृषि एवं फसल प्रारूप (Agriculture)',
  },
];

export function getSavedHeaderTemplates(): SavedHeaderTemplate[] {
  try {
    const raw = localStorage.getItem(SAVED_HEADERS_KEY);
    if (raw) {
      const parsed: SavedHeaderTemplate[] = JSON.parse(raw);
      // Merge builtin with user saved (avoiding duplicate IDs)
      const userCustom = parsed.filter(
        (u) => !BUILTIN_HEADER_TEMPLATES.some((b) => b.id === u.id)
      );
      return [...BUILTIN_HEADER_TEMPLATES, ...userCustom];
    }
  } catch {
    // fallback
  }
  return BUILTIN_HEADER_TEMPLATES;
}

export function saveHeaderTemplate(
  name: string,
  doc: RKDocument
): SavedHeaderTemplate {
  const newTemplate: SavedHeaderTemplate = {
    id: `custom-header-${Date.now()}`,
    name: name.trim() || `Custom Header ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    preset: doc.headerPreset,
    headerConfig: JSON.parse(JSON.stringify(doc.headerConfig)),
    className: doc.className,
    subject: doc.subject,
    chapterNumber: doc.chapterNumber,
    chapterTitle: doc.chapterTitle,
  };

  try {
    const currentCustom = getSavedHeaderTemplates().filter(
      (t) => !BUILTIN_HEADER_TEMPLATES.some((b) => b.id === t.id)
    );
    const updated = [...currentCustom, newTemplate];
    localStorage.setItem(SAVED_HEADERS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newTemplate;
}

export function deleteHeaderTemplate(id: string): void {
  try {
    const current = getSavedHeaderTemplates();
    const filtered = current.filter(
      (t) => t.id !== id || BUILTIN_HEADER_TEMPLATES.some((b) => b.id === id)
    );
    // Only save user ones
    const userOnly = filtered.filter(
      (t) => !BUILTIN_HEADER_TEMPLATES.some((b) => b.id === t.id)
    );
    localStorage.setItem(SAVED_HEADERS_KEY, JSON.stringify(userOnly));
  } catch {
    // ignore
  }
}

export function applyHeaderTemplateToDocument(
  template: SavedHeaderTemplate,
  doc: RKDocument
): RKDocument {
  return {
    ...doc,
    headerPreset: template.preset,
    headerConfig: JSON.parse(JSON.stringify(template.headerConfig)),
    ...(template.className ? { className: template.className } : {}),
    ...(template.subject ? { subject: template.subject } : {}),
    ...(template.chapterNumber ? { chapterNumber: template.chapterNumber } : {}),
    ...(template.chapterTitle ? { chapterTitle: template.chapterTitle } : {}),
  };
}
