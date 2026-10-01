export interface StampItem {
  id: string;
  name: string;
  category: 'official-seal' | 'exam-badge' | 'evaluation' | 'image-asset';
  badgeText: string;
  subtitle: string;
  hindiText?: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  iconName: string;
  imageUrl?: string;
}

export const RK_STAMPS_AND_ASSETS: StampItem[] = [
  {
    id: 'stamp-cbse-pyq',
    name: 'CBSE Important PYQ',
    category: 'exam-badge',
    badgeText: 'CBSE BOARD PYQ • बार-बार पूछा गया प्रश्न',
    subtitle: 'Repeated 5+ Times in Board Examinations (2018–2024)',
    hindiText: 'बोर्ड परीक्षा में 100% पूछे जाने की संभावना',
    accentColor: '#991b1b',
    borderColor: '#f87171',
    bgGradient: 'from-red-50 via-rose-50 to-amber-50',
    iconName: 'Flame',
  },
  {
    id: 'stamp-topper-must',
    name: 'Board Topper Must-Know',
    category: 'exam-badge',
    badgeText: 'TARGET 95+ • TOPPER CONCEPT BOOSTER',
    subtitle: 'Crucial differentiator for 90%+ marks in board evaluation',
    hindiText: 'अवधारणा जो औसत और टॉपर छात्र में अंतर तय करती है',
    accentColor: '#b45309',
    borderColor: '#fbbf24',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
    iconName: 'Star',
  },
  {
    id: 'stamp-anti-trap',
    name: 'Exam Trap / Anti-Trap Alert',
    category: 'exam-badge',
    badgeText: '⚠️ EXAM TRAP WARNING • यहाँ 85% छात्र गलती करते हैं',
    subtitle: 'Common negative marking trap in Section A / MCQ',
    hindiText: 'सावधानी: भ्रामक विकल्प से बचें और मुख्य शर्त ध्यान से पढ़ें',
    accentColor: '#c2410c',
    borderColor: '#fb923c',
    bgGradient: 'from-orange-50 via-red-50 to-amber-50',
    iconName: 'AlertTriangle',
  },
  {
    id: 'stamp-rk-verified',
    name: 'Checked & Approved by RK Sir',
    category: 'official-seal',
    badgeText: '✓ VERIFIED & APPROVED BY RK SIR • RK INSTITUTE',
    subtitle: 'स्वरूप नगर, दिल्ली-110042 • Helpline: 7903952008',
    hindiText: 'गुणवत्तापूर्ण शिक्षा और संकल्प से सिद्धि',
    accentColor: '#0f3457',
    borderColor: '#38bdf8',
    bgGradient: 'from-blue-50 via-indigo-50 to-sky-50',
    iconName: 'Award',
  },
  {
    id: 'stamp-teacher-sign',
    name: "Teacher's Evaluation & Signature Box",
    category: 'evaluation',
    badgeText: 'मूल्यांकन व हस्ताक्षर / TEACHER EVALUATION BOX',
    subtitle: 'हस्ताक्षर (Sign): ____________  |  प्राप्तांक (Marks): ____/10  |  दिनांक: __/__/2026',
    hindiText: 'अध्यापक की टिप्पणी (Remarks): __________________________________________',
    accentColor: '#334155',
    borderColor: '#94a3b8',
    bgGradient: 'from-slate-50 to-stone-100',
    iconName: 'CheckCircle2',
  },
  {
    id: 'stamp-hots-ncert',
    name: 'NCERT Exemplar / HOTS Stamp',
    category: 'exam-badge',
    badgeText: 'HOTS • HIGH ORDER THINKING SKILLS (NCERT)',
    subtitle: 'Analytical application-based problem for competitive edge',
    hindiText: 'तार्किक चिंतन व विश्लेषणात्मक समझ पर आधारित प्रश्न',
    accentColor: '#047857',
    borderColor: '#34d399',
    bgGradient: 'from-emerald-50 via-teal-50 to-green-50',
    iconName: 'Target',
  },
  // Pre-cropped institutional graphics from D drive / public/rk-assets/
  {
    id: 'asset-header-official',
    name: 'RK Institute Official Assessment Masthead',
    category: 'image-asset',
    badgeText: 'Official Header Image (with Candidate Name, Marks & Time)',
    subtitle: 'Pre-cropped 794px header banner with gold laurels',
    imageUrl: '/rk-assets/header.png',
    accentColor: '#0f3457',
    borderColor: '#93c5fd',
    bgGradient: 'from-blue-50 to-slate-50',
    iconName: 'Image',
  },
  {
    id: 'asset-header-crop',
    name: 'RK Institute Emblem Crest Banner',
    category: 'image-asset',
    badgeText: 'Institutional Crest with Devanagari Slogan Banner',
    subtitle: 'Swaroop Nagar, Kushal Road, Delhi-110042',
    imageUrl: '/rk-assets/header_crop.png',
    accentColor: '#0f3457',
    borderColor: '#cbd5e1',
    bgGradient: 'from-slate-50 to-blue-50',
    iconName: 'Image',
  },
  {
    id: 'asset-solutions-ribbon',
    name: 'Digital Solutions Ribbon Banner',
    category: 'image-asset',
    badgeText: 'Detailed Step-by-Step Solutions Ribbon',
    subtitle: 'Visual divider for Model Answers & Marking Key',
    imageUrl: '/rk-assets/solutions_digital.png',
    accentColor: '#1e3a8a',
    borderColor: '#bfdbfe',
    bgGradient: 'from-indigo-50 to-blue-50',
    iconName: 'Image',
  },
  {
    id: 'asset-mcq-aligned',
    name: 'CBSE 4-Option Aligned Reference Banner',
    category: 'image-asset',
    badgeText: 'Standard MCQ Aligned Option Layout Asset',
    subtitle: 'Balanced 2-column or 4-row option alignment',
    imageUrl: '/rk-assets/options_aligned.png',
    accentColor: '#475569',
    borderColor: '#cbd5e1',
    bgGradient: 'from-stone-50 to-slate-50',
    iconName: 'Image',
  },
];
