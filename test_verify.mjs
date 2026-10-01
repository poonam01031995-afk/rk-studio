import { 
  TEMPLATE_ECONOMICS, 
  TEMPLATE_POLITY, 
  TEMPLATE_HISTORY, 
  TEMPLATE_GRAMMAR, 
  TEMPLATE_ASSESSMENT, 
  TEMPLATE_PE, 
  TEMPLATE_SCIENCE, 
  TEMPLATE_GEOGRAPHY, 
  TEMPLATE_BLANK 
} from './src/data/templates.ts';
import { createDefaultBlock } from './src/utils/blockFactory.ts';

const templates = [
  TEMPLATE_ECONOMICS, 
  TEMPLATE_POLITY, 
  TEMPLATE_HISTORY, 
  TEMPLATE_GRAMMAR, 
  TEMPLATE_ASSESSMENT, 
  TEMPLATE_PE, 
  TEMPLATE_SCIENCE, 
  TEMPLATE_GEOGRAPHY, 
  TEMPLATE_BLANK
];

console.log(`Checking ${templates.length} templates...`);
for (const t of templates) {
  if (!t.title || !t.subject || !t.blocks || !Array.isArray(t.blocks)) {
    throw new Error(`Invalid template: ${t.id}`);
  }
  console.log(`  ✓ [${t.subject}] ${t.title} (${t.blocks.length} blocks)`);
}

const blockTypes = [
  'hero-intro', 'heading', 'paragraph', 'box-lead', 'box-definition',
  'box-caution', 'box-life-example', 'box-case-study', 'box-exam-tip',
  'box-formula', 'box-worked', 'box-activity', 'box-summary',
  'box-instructions', 'bullet-list', 'card-grid-3', 'comparison-vs',
  'timeline-steps', 'data-table', 'question-card', 'companion-grid',
  'image-block', 'hallmark-closing', 'page-break'
];

console.log(`Checking ${blockTypes.length} block factories...`);
for (const type of blockTypes) {
  const block = createDefaultBlock(type);
  if (!block || block.type !== type) {
    throw new Error(`Failed to create block of type: ${type}`);
  }
  console.log(`  ✓ Block factory: ${type}`);
}

console.log('\nAll 9 templates and 24 block factories verified successfully!');
