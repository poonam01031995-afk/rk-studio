import type { RKDocument } from '../types/document';

interface FilePickerAcceptType {
  description: string;
  accept: Record<string, string[]>;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: FilePickerAcceptType[];
}

interface FileSystemWindow extends Window {
  showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  showOpenFilePicker?: (options?: { types?: FilePickerAcceptType[]; multiple?: boolean }) => Promise<FileSystemFileHandle[]>;
}

/**
 * Save document directly to user's disk / chosen folder using File System Access API
 * Falls back to standard download if API is not supported in the browser.
 */
export async function saveDocumentDirectToDisk(doc: RKDocument): Promise<{ success: boolean; filename: string }> {
  const jsonStr = JSON.stringify(doc, null, 2);
  const cleanTitle = (doc.title || 'study_notes')
    .replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '_')
    .slice(0, 45);
  const suggestedName = `${cleanTitle}.rkdoc`;

  const win = window as FileSystemWindow;

  // Modern File System Access API (Chrome, Edge, Opera)
  if (typeof win.showSaveFilePicker === 'function') {
    try {
      const handle = await win.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'RK Notes Document (*.rkdoc)',
            accept: { 'application/json': ['.rkdoc', '.json'] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      return { success: true, filename: handle.name };
    } catch (err: unknown) {
      // User cancelled picker or error
      if (err instanceof Error && err.name === 'AbortError') {
        return { success: false, filename: suggestedName };
      }
      // Fallback to standard download if any file system error occurs
    }
  }

  // Graceful fallback: standard browser download
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = suggestedName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { success: true, filename: suggestedName };
}

/**
 * Open document directly from disk using File System Access API or input element
 */
export async function openDocumentDirectFromDisk(): Promise<RKDocument | null> {
  const win = window as FileSystemWindow;

  if (typeof win.showOpenFilePicker === 'function') {
    try {
      const [handle] = await win.showOpenFilePicker({
        types: [
          {
            description: 'RK Notes Document (*.rkdoc, *.json)',
            accept: { 'application/json': ['.rkdoc', '.json'] },
          },
        ],
        multiple: false,
      });

      const file = await handle.getFile();
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed && Array.isArray(parsed.blocks)) {
        return parsed as RKDocument;
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return null;
      }
    }
  }

  return null;
}
