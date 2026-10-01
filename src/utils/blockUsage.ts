import type { BlockType } from '../types/document';

const BLOCK_USAGE_KEY = 'rk_docflow_block_usage';

// Sensible defaults for competitive & CBSE academic notes
const DEFAULT_FREQUENT_BLOCKS: BlockType[] = [
  'heading',
  'box-definition',
  'bullet-list',
  'box-caution',
  'question-card',
  'box-exam-tip',
  'paragraph',
  'box-formula',
];

export function getBlockUsage(): Record<string, number> {
  try {
    const raw = localStorage.getItem(BLOCK_USAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  // Initialize with default counts
  const initial: Record<string, number> = {};
  DEFAULT_FREQUENT_BLOCKS.forEach((type, index) => {
    initial[type] = DEFAULT_FREQUENT_BLOCKS.length - index;
  });
  return initial;
}

export function recordBlockUsage(type: BlockType): void {
  try {
    const usage = getBlockUsage();
    usage[type] = (usage[type] || 0) + 1;
    localStorage.setItem(BLOCK_USAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore
  }
}

export function getFrequentlyUsedBlocks(limit = 6): BlockType[] {
  const usage = getBlockUsage();
  
  // Sort block types by usage descending
  const sorted = Object.entries(usage)
    .sort(([, a], [, b]) => b - a)
    .map(([type]) => type as BlockType);

  // Combine with defaults to ensure we always have enough items
  const combined = Array.from(new Set([...sorted, ...DEFAULT_FREQUENT_BLOCKS]));
  return combined.slice(0, limit);
}
