export type ToolType = 
  | 'select' 
  | 'mask'      // Whiteout / Redaction tool to hide old logos/headers/watermarks
  | 'text' 
  | 'sticky' 
  | 'snip' 
  | 'stamp' 
  | 'highlight'
  | 'image';

export type StampType = 
  | 'APPROVED' 
  | 'CONFIDENTIAL' 
  | 'IMPORTANT' 
  | 'ACTION REQUIRED' 
  | 'VERIFIED'
  | 'NEEDS REVISION'
  | 'RK INSTITUTE'
  | 'STUDENT COPY'
  | 'EXAM MUST READ';

export interface PDFAnnotation {
  id: string;
  page: number;
  type: ToolType;
  x: number; // percentage (0 to 100) relative to page width
  y: number; // percentage (0 to 100) relative to page height
  width?: number; // percentage relative to page width
  height?: number; // percentage relative to page height
  content: string;
  color: string;
  fontSize?: number;
  stampType?: StampType;
  imageData?: string; // base64 / data URL for pasted images or snips
  isWhiteoutMask?: boolean; // if true, renders solid white to mask underlying scan/text
  timestamp: string;
}

export type SubjectPreset = 'History' | 'Polity' | 'Economics' | 'Geography' | 'General Studies' | 'Custom';

export interface RKTemplateConfig {
  enabled: boolean;
  subject: SubjectPreset;
  instituteName: string;
  instituteTagline: string;
  subjectTitle: string;
  chapterTitle: string;
  // Header Settings
  showHeader: boolean;
  headerMode: 'image' | 'text-banner';
  headerImageUrl: string; // e.g. /rk-assets/header.png or pasted base64
  headerHeight: number; // in percentage of page height or px
  maskTop: boolean; // whiteout existing header
  maskTopHeight: number; // percentage (typically 6-8%)
  // Footer Settings
  showFooter: boolean;
  maskBottom: boolean; // whiteout existing footer
  maskBottomHeight: number; // percentage (typically 4-5%)
  footerText: string;
  showPageNumbers: boolean;
  // Watermark Settings
  showWatermark: boolean;
  watermarkText: string;
  watermarkOpacity: number; // 0.05 to 0.4
  watermarkAngle: number; // -45 deg
  watermarkFontSize: number;
  watermarkColor: string;
  // Style
  accentColor: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  sourceExcerpt?: string;
  sourcePage: number;
  sourcePdfName: string;
  sourceImage?: string; // snip clipping preview
  tags: string[];
  createdAt: string;
  color?: string;
  isPinned?: boolean;
}

export interface DragExcerptPayload {
  type: 'pdf-excerpt' | 'pdf-snip' | 'note-card' | 'stamp-template' | 'mask-template';
  text?: string;
  page?: number;
  pdfName?: string;
  imageData?: string;
  stampType?: StampType;
  noteId?: string;
}
