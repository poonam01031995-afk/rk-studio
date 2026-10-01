import type { DocumentSnapshot, RKDocument } from '../types/document';

const SNAPSHOTS_KEY = 'rk_docflow_snapshots';

export function getDocumentSnapshots(): DocumentSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveDocumentSnapshot(
  doc: RKDocument,
  note?: string
): DocumentSnapshot {
  const snapshots = getDocumentSnapshots();
  const versionNum = snapshots.length + 1;
  const newSnapshot: DocumentSnapshot = {
    id: `snap-${Date.now()}`,
    versionLabel: `v${versionNum}.0`,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    note: note || `Snapshot of ${doc.title} (${doc.blocks.length} blocks)`,
    blockCount: doc.blocks.length,
    subject: doc.subject,
    title: doc.title,
    doc: JSON.parse(JSON.stringify(doc)),
  };

  try {
    const updated = [newSnapshot, ...snapshots].slice(0, 30); // keep up to 30 snapshots
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newSnapshot;
}

export function deleteDocumentSnapshot(id: string): void {
  try {
    const snapshots = getDocumentSnapshots();
    const updated = snapshots.filter((s) => s.id !== id);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
