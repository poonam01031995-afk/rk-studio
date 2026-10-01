// Rigorous testing of edge cases, data isolation, and new features
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
  applyHeaderTemplateToDocument,
  BUILTIN_HEADER_TEMPLATES
} from './src/utils/headerPresets.ts';
import { 
  getDocumentSnapshots, 
  saveDocumentSnapshot, 
  deleteDocumentSnapshot 
} from './src/utils/versionHistory.ts';
import { TEMPLATE_PE, TEMPLATE_SCIENCE } from './src/data/templates.ts';

console.log('=== Running Edge Case & Data Isolation Tests ===');

// Test 1: LocalStorage pollution test - builtins must NOT be stored in localStorage
console.log('\n[Test 1] LocalStorage Pollution & Storage Quota Test');
localStorage.clear();
const initialBuiltins = getSavedHeaderTemplates();
if (initialBuiltins.length === 0) {
  throw new Error('Expected built-in templates to be available!');
}
if (store['rk_docflow_saved_headers']) {
  throw new Error('localStorage should be empty before user saves any custom header!');
}
console.log('  ✓ No built-ins leaked into localStorage initially');

// Save a custom template
const custom1 = saveHeaderTemplate('Custom Board Test 2026', TEMPLATE_PE);
const storedRaw = JSON.parse(store['rk_docflow_saved_headers']);
console.log(`  ✓ Stored custom headers count: ${storedRaw.length} (Expected exactly 1)`);
if (storedRaw.length !== 1) {
  throw new Error(`Expected only 1 custom template in localStorage, found ${storedRaw.length}! Built-ins were leaked.`);
}
if (storedRaw[0].id !== custom1.id) {
  throw new Error('Stored template ID mismatch!');
}
console.log('  ✓ Only custom templates are persisted to localStorage, avoiding quota bloat');

// Test 2: Deletion cleans up localStorage properly
console.log('\n[Test 2] Header Deletion Edge Cases');
deleteHeaderTemplate(custom1.id);
const storedAfterDelete = JSON.parse(store['rk_docflow_saved_headers']);
if (storedAfterDelete.length !== 0) {
  throw new Error('Custom template was not removed from localStorage!');
}
console.log('  ✓ Custom template safely deleted from localStorage');

// Built-ins cannot be deleted
deleteHeaderTemplate(BUILTIN_HEADER_TEMPLATES[0].id);
const templatesAfterBuiltinDeleteAttempt = getSavedHeaderTemplates();
if (templatesAfterBuiltinDeleteAttempt.length !== BUILTIN_HEADER_TEMPLATES.length) {
  throw new Error('Built-in template was erroneously deleted!');
}
console.log('  ✓ Built-in templates are immutable and cannot be deleted');

// Test 3: Data isolation during template application
console.log('\n[Test 3] Template Application Data Isolation');
const targetDoc = JSON.parse(JSON.stringify(TEMPLATE_SCIENCE));
const templateToApply = BUILTIN_HEADER_TEMPLATES.find(t => t.preset === 'pe-bar');
if (!templateToApply) throw new Error('PE template not found');

const applied = applyHeaderTemplateToDocument(templateToApply, targetDoc);
if (applied.headerPreset !== 'pe-bar') {
  throw new Error('Header preset was not updated to pe-bar');
}
if (applied.headerConfig.instituteName !== templateToApply.headerConfig.instituteName) {
  throw new Error('Institute name was corrupted during application');
}
// Blocks should be preserved untouched
if (applied.blocks.length !== targetDoc.blocks.length) {
  throw new Error('Document content blocks were altered during header template application!');
}
console.log('  ✓ Template application successfully isolates header metadata and preserves document body blocks');

// Test 4: Document snapshot versioning capacity limit (max 30)
console.log('\n[Test 4] Version Snapshot Retention Cap (30 Milestones)');
localStorage.clear();
for (let i = 1; i <= 35; i++) {
  saveDocumentSnapshot(targetDoc, `Milestone snapshot #${i}`);
}
const snapshots = getDocumentSnapshots();
console.log(`  ✓ Total snapshots retained: ${snapshots.length} (Capped at 30)`);
if (snapshots.length !== 30) {
  throw new Error(`Snapshots count should be capped at 30, but got ${snapshots.length}`);
}
if (snapshots[0].note !== 'Milestone snapshot #35') {
  throw new Error('Latest snapshot is not at index 0');
}
deleteDocumentSnapshot(snapshots[0].id);
const snapshotsAfterDelete = getDocumentSnapshots();
if (snapshotsAfterDelete.length !== 29) {
  throw new Error('Snapshot was not removed after deleteDocumentSnapshot!');
}
console.log('  ✓ Snapshot FIFO cap correctly prevents localStorage exhaustion and deletion works');

console.log('\nAll edge cases and data isolation tests passed with 100% success!\n');
