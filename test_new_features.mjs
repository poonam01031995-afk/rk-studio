// Mock localStorage in Node environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(k => delete store[k]); }
};

import { 
  getSavedHeaderTemplates, 
  saveHeaderTemplate, 
  deleteHeaderTemplate, 
  applyHeaderTemplateToDocument
} from './src/utils/headerPresets.ts';
import { 
  getDocumentSnapshots, 
  saveDocumentSnapshot, 
  deleteDocumentSnapshot 
} from './src/utils/versionHistory.ts';
import { 
  recordBlockUsage, 
  getFrequentlyUsedBlocks 
} from './src/utils/blockUsage.ts';
import { TEMPLATE_ECONOMICS } from './src/data/templates.ts';

console.log('--- Testing Header Templates Presets ---');
const initialTemplates = getSavedHeaderTemplates();
console.log(`✓ Loaded ${initialTemplates.length} header templates (Expected >= 6 built-in)`);
if (initialTemplates.length < 6) throw new Error('Built-in header templates missing!');

const customSaved = saveHeaderTemplate('Delhi Public Test Banner', TEMPLATE_ECONOMICS);
console.log(`✓ Saved custom template: "${customSaved.name}" (ID: ${customSaved.id})`);
const afterSave = getSavedHeaderTemplates();
if (!afterSave.some(t => t.id === customSaved.id)) throw new Error('Custom template not found in saved list!');

const appliedDoc = applyHeaderTemplateToDocument(customSaved, TEMPLATE_ECONOMICS);
if (appliedDoc.headerConfig.instituteName !== customSaved.headerConfig.instituteName) {
  throw new Error('Header template application failed!');
}
console.log(`✓ Successfully applied template to document (${appliedDoc.headerConfig.instituteName})`);

deleteHeaderTemplate(customSaved.id);
const afterDelete = getSavedHeaderTemplates();
if (afterDelete.some(t => t.id === customSaved.id)) throw new Error('Custom template deletion failed!');
console.log('✓ Successfully deleted custom header template');

console.log('\n--- Testing Version Snapshots & History ---');
const initialSnapshots = getDocumentSnapshots();
console.log(`✓ Initial snapshots: ${initialSnapshots.length}`);

const snap1 = saveDocumentSnapshot(TEMPLATE_ECONOMICS, 'Milestone 1: Economics Draft');
console.log(`✓ Saved snapshot: ${snap1.versionLabel} - "${snap1.note}" with ${snap1.blockCount} blocks`);
const afterSnap = getDocumentSnapshots();
if (afterSnap.length !== 1 || afterSnap[0].id !== snap1.id) throw new Error('Snapshot not recorded properly!');

deleteDocumentSnapshot(snap1.id);
if (getDocumentSnapshots().length !== 0) throw new Error('Snapshot deletion failed!');
console.log('✓ Successfully deleted version snapshot');

console.log('\n--- Testing Block Usage Tracking ---');
const freqBefore = getFrequentlyUsedBlocks(5);
console.log('✓ Initial frequently used blocks:', freqBefore);

// Simulate teacher adding 10 question cards and 8 formula boxes
for (let i = 0; i < 15; i++) {
  recordBlockUsage('question-card');
}
for (let i = 0; i < 12; i++) {
  recordBlockUsage('box-formula');
}

const freqAfter = getFrequentlyUsedBlocks(5);
console.log('✓ Frequently used blocks after simulated usage:', freqAfter);
if (freqAfter[0] !== 'question-card') throw new Error('question-card should be ranked #1 after 15 uses!');
if (freqAfter[1] !== 'box-formula') throw new Error('box-formula should be ranked #2 after 12 uses!');
console.log('✓ Block usage ranking successfully prioritized most-used components');

console.log('\nAll new features verified successfully!');
