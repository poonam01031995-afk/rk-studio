import React, { useState } from 'react';
import type { RKDocument, DocumentSnapshot } from '../types/document';
import { History, BookmarkCheck, RotateCcw, Trash2, X, Plus, Layers, Clock } from 'lucide-react';
import {
  getDocumentSnapshots,
  saveDocumentSnapshot,
  deleteDocumentSnapshot,
} from '../utils/versionHistory';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDoc: RKDocument;
  onRestoreDoc: (restored: RKDocument) => void;
}

export const VersionHistoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDoc,
  onRestoreDoc,
}) => {
  const [snapshots, setSnapshots] = useState<DocumentSnapshot[]>(() => getDocumentSnapshots());
  const [newNote, setNewNote] = useState('');
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const created = saveDocumentSnapshot(currentDoc, newNote.trim());
    setSnapshots(getDocumentSnapshots());
    setNewNote('');
    setSuccessMsg(`Saved snapshot ${created.versionLabel}!`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleRestore = (snap: DocumentSnapshot) => {
    onRestoreDoc(JSON.parse(JSON.stringify(snap.doc)));
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteDocumentSnapshot(id);
    setSnapshots(getDocumentSnapshots());
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/40 backdrop-blur-sm animate-fadeIn select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800 ring-1 ring-stone-200"
      >
        {/* Modal Top Header */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
              <History size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-heading">
                Document Version Snapshots
              </h3>
              <p className="text-[11px] text-slate-500">
                Save version milestones, track edits, and restore previous states
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-stone-200 transition-colors text-xs cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Save New Snapshot Card */}
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <form onSubmit={handleCreateSnapshot} className="space-y-2">
            <label className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-amber-500" />
              <span>Create New Version Snapshot</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Version milestone note (e.g. 'Completed Section B Numericals and 5 PYQs')..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-400 transition-colors shadow-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
              >
                <BookmarkCheck size={14} />
                <span>Save Snapshot</span>
              </button>
            </div>
            {successMsg && (
              <p className="text-xs text-emerald-600 font-medium">{successMsg}</p>
            )}
          </form>
        </div>

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {snapshots.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <History size={32} className="mx-auto mb-2 text-blue-300" />
              <div className="text-sm font-semibold text-slate-600">No version snapshots saved yet</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Save a milestone snapshot above to keep a restore point before making major content or layout edits.
              </p>
            </div>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3 rounded-xl bg-white border border-stone-200 hover:border-stone-300 shadow-sm transition-all flex items-start justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {snap.versionLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {snap.title}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                      {snap.subject}
                    </span>
                  </div>

                  {snap.note && (
                    <p className="text-[11.5px] text-slate-600 font-medium leading-snug mb-1.5">
                      "{snap.note}"
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-[10.5px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {snap.timestamp}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers size={11} />
                      {snap.blockCount} Blocks
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  {confirmRestoreId === snap.id ? (
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 p-1 rounded-lg">
                      <span className="text-[10px] text-amber-700 px-1 font-semibold">Restore?</span>
                      <button
                        onClick={() => handleRestore(snap)}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmRestoreId(null)}
                        className="px-1.5 py-0.5 text-slate-500 hover:text-slate-800 text-[10px] cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRestoreId(snap.id)}
                      className="px-2.5 py-1 bg-stone-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold rounded-lg border border-stone-200 hover:border-blue-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Revert document to this snapshot"
                    >
                      <RotateCcw size={12} />
                      <span>Revert</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(snap.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete snapshot"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>Local browser storage • Up to 30 version snapshots retained</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
