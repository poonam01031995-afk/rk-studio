// Core Document & Block types for RK Study Notes & Assessment PDF Creator

export type SubjectPreset = 
  | 'Economics' 
  | 'History' 
  | 'Science' 
  | 'Mathematics' 
  | 'Polity' 
  | 'Geography' 
  | 'English' 
  | 'Physical Education'
  | 'General Studies'
  | 'Custom';

export type HeaderPreset = 
  | 'official-crest'      // High-res RK Crest with gold laurels, Swaroop Nagar, Helpline
  | 'assessment-banner'   // Exact match to header.png: Candidate Name, Roll No, Marks: 80/100, Time: 3 Hrs
  | 'modern-hero'         // Executive Navy Gradient banner with chips and chapter tags
  | 'english-formal'      // CBSE Class 9 & 10 English Language & Literature Formal Masthead
  | 'pe-bar'              // Physical Education Academic Section Bar
  | 'minimal-running'     // Crisp single-line rule with chapter title & subject
  | 'custom-image'        // Direct custom image banner (like header_crop.png)
  | 'none';

export type FooterPreset = 
  | 'hallmark-official'   // RK Institute Hallmark with Helpline & dynamic Page X of Y
  | 'dual-rule'           // Left: Internal Student Copy • Right: Page No
  | 'minimal-badge'       // Centered clean pill badge
  | 'none';

export type AccentTheme = 
  | 'navy'       // #0f3457 - RK Official Navy
  | 'blue'       // #1a5c9c - Academic Royal Blue
  | 'emerald'    // #127048 - Science / Success Green
  | 'amber'      // #9a6a05 - Focus Amber / Gold
  | 'crimson'    // #a92d34 - Key Alert / Foundation Red
  | 'purple';    // #5d4595 - Humanities / Literature Purple

export type BulletStyle = 
  | 'dot'        // Clean colored disc
  | 'check'      // Green circular checkmark pill (✓)
  | 'numbered'   // Circular numbered badge (1, 2, 3...)
  | 'arrow'      // Causal arrow indicator (➔)
  | 'bilingual'  // English main point with Hindi subtext
  | 'pros-cons'  // (+) and (-) comparison markers
  | 'star';      // (⭐) Key formula / Board takeaway

export interface BulletItem {
  id: string;
  text: string;
  subText?: string;
  isPositive?: boolean;
}

export interface VariableItem {
  symbol: string;
  meaning: string;
  unit?: string;
}

export interface CardItem {
  id: string;
  title: string;
  points: string[];
  note?: string;
  colorVariant?: 'navy' | 'blue' | 'green' | 'amber' | 'rose' | 'purple';
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  desc: string;
  color?: string;
}

// All block types supported by the creator
export type BlockType = 
  | 'hero-intro'
  | 'heading'
  | 'paragraph'
  | 'box-lead'
  | 'box-definition'
  | 'box-caution'
  | 'box-life-example'
  | 'box-case-study'
  | 'box-exam-tip'
  | 'box-formula'
  | 'box-worked'
  | 'box-activity'
  | 'box-summary'
  | 'box-instructions'
  | 'bullet-list'
  | 'card-grid-3'
  | 'comparison-vs'
  | 'timeline-steps'
  | 'data-table'
  | 'question-card'
  | 'companion-grid'
  | 'image-block'
  | 'page-break'
  | 'hallmark-closing';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroIntroBlock extends BaseBlock {
  type: 'hero-intro';
  eyebrow: string;
  title: string;
  subtitle: string;
  chips: string[];
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
  tag?: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

export interface BoxLeadBlock extends BaseBlock {
  type: 'box-lead';
  badge?: string;
  text: string;
}

export interface BoxDefinitionBlock extends BaseBlock {
  type: 'box-definition';
  term: string;
  definition: string;
  points: string[];
  memoryHook?: string;
}

export interface BoxCautionBlock extends BaseBlock {
  type: 'box-caution';
  title: string;
  content: string;
  misconception?: string;
  reality?: string;
  bulletPoints?: string[];
}

export interface BoxLifeExampleBlock extends BaseBlock {
  type: 'box-life-example';
  title: string;
  content: string;
  takeaway?: string;
}

export interface BoxCaseStudyBlock extends BaseBlock {
  type: 'box-case-study';
  title: string;
  source?: string;
  content: string;
  points?: string[];
}

export interface BoxExamTipBlock extends BaseBlock {
  type: 'box-exam-tip';
  title: string;
  marksTag?: string;
  tip: string;
  scoringRule?: string;
}

export interface BoxFormulaBlock extends BaseBlock {
  type: 'box-formula';
  formulaName: string;
  formulaExpr: string;
  description: string;
  variables: VariableItem[];
}

export interface BoxWorkedBlock extends BaseBlock {
  type: 'box-worked';
  title: string;
  problem: string;
  steps: string[];
  finalAnswer: string;
}

export interface BoxActivityBlock extends BaseBlock {
  type: 'box-activity';
  activityNum: string;
  title: string;
  objective: string;
  materials: string;
  procedure: string[];
  observation: string;
}

export interface BoxSummaryBlock extends BaseBlock {
  type: 'box-summary';
  title: string;
  points: string[];
}

export interface BoxInstructionsBlock extends BaseBlock {
  type: 'box-instructions';
  title: string;
  instructions: string[];
}

export interface BulletListBlock extends BaseBlock {
  type: 'bullet-list';
  title?: string;
  style: BulletStyle;
  items: BulletItem[];
}

export interface CardGrid3Block extends BaseBlock {
  type: 'card-grid-3';
  cards: CardItem[];
}

export interface ComparisonVsBlock extends BaseBlock {
  type: 'comparison-vs';
  leftTitle: string;
  leftPoints: string[];
  rightTitle: string;
  rightPoints: string[];
}

export interface TimelineStepsBlock extends BaseBlock {
  type: 'timeline-steps';
  items: TimelineItem[];
}

export interface DataTableBlock extends BaseBlock {
  type: 'data-table';
  caption: string;
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface QuestionCardBlock extends BaseBlock {
  type: 'question-card';
  qno: string;
  marks: string;
  hot: boolean;
  question: string;
  questionHindi?: string;
  questionType: 'mcq' | 'descriptive';
  options?: string[];
  answer?: string;
  explanation?: string;
  showSolution?: boolean;
  subQuestions?: string[];
  solutionPoints?: string[];
}

export interface CompanionGridBlock extends BaseBlock {
  type: 'companion-grid';
  imageSrc: string;
  imageCaption: string;
  title: string;
  narrative: string;
  points: string[];
}

export interface ImageBlock extends BaseBlock {
  type: 'image-block';
  url: string;
  caption: string;
  alt?: string;
  widthPercent?: number;
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break';
  label?: string;
}

export interface HallmarkClosingBlock extends BaseBlock {
  type: 'hallmark-closing';
  instituteName: string;
  tagline: string;
  helpline: string;
  address: string;
  session: string;
  note: string;
}

export type ContentBlock = 
  | HeroIntroBlock
  | HeadingBlock
  | ParagraphBlock
  | BoxLeadBlock
  | BoxDefinitionBlock
  | BoxCautionBlock
  | BoxLifeExampleBlock
  | BoxCaseStudyBlock
  | BoxExamTipBlock
  | BoxFormulaBlock
  | BoxWorkedBlock
  | BoxActivityBlock
  | BoxSummaryBlock
  | BoxInstructionsBlock
  | BulletListBlock
  | CardGrid3Block
  | ComparisonVsBlock
  | TimelineStepsBlock
  | DataTableBlock
  | QuestionCardBlock
  | CompanionGridBlock
  | ImageBlock
  | PageBreakBlock
  | HallmarkClosingBlock;

// Document metadata and invariant settings
export interface RKDocument {
  id: string;
  title: string;
  subject: SubjectPreset;
  className: string;
  chapterNumber: string;
  chapterTitle: string;
  subtitle: string;
  tags: string[];
  accentTheme: AccentTheme;
  headerPreset: HeaderPreset;
  footerPreset: FooterPreset;
  headerConfig: {
    instituteName: string;
    tagline: string;
    phone: string;
    address: string;
    examSeries: string;
    studentFields: boolean; // Name, Roll No, Marks, Time
    marks: string;
    time: string;
    customImageUrl?: string;
  };
  footerConfig: {
    footerText: string;
    showPageNumbers: boolean;
    showWatermark: boolean;
    watermarkText: string;
  };
  showClosingHallmark?: boolean;
  blocks: ContentBlock[];
}

// Saved Header Template Preset for reusable invariant headers
export interface SavedHeaderTemplate {
  id: string;
  name: string;
  createdAt: string;
  preset: HeaderPreset;
  headerConfig: {
    instituteName: string;
    tagline: string;
    phone: string;
    address: string;
    examSeries: string;
    studentFields: boolean;
    marks: string;
    time: string;
    customImageUrl?: string;
  };
  className?: string;
  subject?: SubjectPreset;
  chapterNumber?: string;
  chapterTitle?: string;
}

// Document Snapshot for Version History and Reversion
export interface DocumentSnapshot {
  id: string;
  versionLabel: string;
  timestamp: string;
  note?: string;
  blockCount: number;
  subject: SubjectPreset;
  title: string;
  doc: RKDocument;
}
