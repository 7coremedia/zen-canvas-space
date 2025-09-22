import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { exportHtmlToPdf, exportHtmlToPdfText } from '@/lib/pdf/export';
import { openPrintWindow } from '@/lib/pdf/export';
import { blocksToHtml } from '@/lib/editor/blocksToHtml';

export type BlocksData = {
  time?: number;
  blocks: Array<any>;
  version?: string;
};

interface BlocksEditorProps {
  initialData: BlocksData;
  onChange?: (data: BlocksData) => void;
  onExportPdf?: (html: string) => void;
  title?: string;
  singlePageDefault?: boolean;
  storageKey?: string; // optional localStorage key for autosave when page hides/unloads
}

const BlocksEditor: React.FC<BlocksEditorProps> = ({ initialData, onChange, onExportPdf, title, singlePageDefault = true, storageKey }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = useMemo(() => `editorjs-${Math.random().toString(36).slice(2)}`, []);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<BlocksData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const applyingRef = useRef(false);
  const lastSaveRef = useRef<number>(0);
  const lastDataRef = useRef<BlocksData | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Initialize Editor.js only on client
  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (typeof window === 'undefined') return;
      const [{ default: EditorJS }, Header, List, Quote, Checklist, Table] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/header').then(m => m.default || m),
        import('@editorjs/list').then(m => m.default || m),
        import('@editorjs/quote').then(m => m.default || m),
        import('@editorjs/checklist').then(m => m.default || m),
        import('@editorjs/table').then(m => m.default || m),
      ]);

      if (!isMounted) return;

      const instance = new EditorJS({
        holder: holderId,
        autofocus: true,
        data: initialData,
        tools: {
          header: {
            class: Header as any,
            inlineToolbar: ['link'],
            config: { levels: [1, 2, 3], defaultLevel: 2 },
          },
          list: {
            class: List as any,
            inlineToolbar: true,
          },
          quote: {
            class: Quote as any,
            inlineToolbar: true,
            config: { quotePlaceholder: 'Quote', captionPlaceholder: 'Author' },
          },
          checklist: {
            class: Checklist as any,
            inlineToolbar: true,
          },
          table: {
            class: Table as any,
            inlineToolbar: true,
            config: {
              rows: 3,
              cols: 2,
            },
          },
        },
        onReady: async () => {
          setReady(true);
          const first = (await instance.save()) as BlocksData;
          setHistory([first]);
          setHistoryIndex(0);
        },
        onChange: async () => {
          if (applyingRef.current) return; // don't capture history during programmatic render
          const now = Date.now();
          if (now - lastSaveRef.current < 250) return; // simple debounce
          lastSaveRef.current = now;
          const data = (await instance.save()) as BlocksData;
          // Update external listener
          onChange?.(data);
          lastDataRef.current = data;
          setLastSavedAt(Date.now());
          // Push into history if content changed
          setHistory(prev => {
            const next = prev.slice(0, historyIndex + 1);
            const last = next[next.length - 1];
            const changed = JSON.stringify(last?.blocks) !== JSON.stringify(data.blocks);
            return changed ? [...next, data] : next;
          });
          setHistoryIndex(idx => {
            const prevData = history[idx];
            const changed = JSON.stringify(prevData?.blocks) !== JSON.stringify(data.blocks);
            return changed ? idx + 1 : idx;
          });
        },
      });

      editorRef.current = instance as unknown as EditorJS;
    }

    init();
    return () => {
      isMounted = false;
      if (editorRef.current && (editorRef.current as any).destroy) {
        // save on unmount if storageKey is provided
        if (storageKey && lastDataRef.current && typeof window !== 'undefined') {
          try { localStorage.setItem(storageKey, JSON.stringify({ data: lastDataRef.current, ts: Date.now() })); } catch {}
        }
        (editorRef.current as any).destroy();
        editorRef.current = null;
      }
    };
  }, [holderId, initialData, onChange, storageKey]);

  // Save on tab hide or before unload
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.hidden && storageKey && typeof window !== 'undefined') {
        let data = lastDataRef.current;
        if (!data && editorRef.current) {
          try { data = await (editorRef.current as any).save(); } catch {}
        }
        if (data) {
          try { localStorage.setItem(storageKey, JSON.stringify({ data, ts: Date.now() })); } catch {}
          setLastSavedAt(Date.now());
        }
      }
    };
    const handleBeforeUnload = async () => {
      if (storageKey && typeof window !== 'undefined') {
        let data = lastDataRef.current;
        if (!data && editorRef.current) {
          try { data = await (editorRef.current as any).save(); } catch {}
        }
        if (data) {
          try { localStorage.setItem(storageKey, JSON.stringify({ data, ts: Date.now() })); } catch {}
          setLastSavedAt(Date.now());
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [storageKey]);

  const handleExportPdf = useCallback(async (page: 'a4' | 'letter') => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    if (onExportPdf) onExportPdf(html);
    else exportHtmlToPdf(html, { filename: (title ? `${title}.pdf` : 'document.pdf'), pageSize: page, singlePage: singlePageDefault });
  }, [title, onExportPdf, singlePageDefault]);

  const handleExportHtml = useCallback(async () => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (title ? `${title}.html` : 'document.html');
    a.click();
    URL.revokeObjectURL(url);
  }, [title]);

  const handlePrint = useCallback(async () => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    openPrintWindow(html, title || 'Document');
  }, [title]);

  const handleExportDoc = useCallback(async () => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    // Simple Word-compatible HTML (opens in Word). For real DOCX, we can add html-docx-js later.
    const blob = new Blob([`\uFEFF${html}`], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (title ? `${title}.doc` : 'document.doc');
    a.click();
    URL.revokeObjectURL(url);
  }, [title]);

  const handleExportTextPdf = useCallback(async (page: 'a4' | 'letter') => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    await exportHtmlToPdfText(html, { filename: (title ? `${title}.pdf` : 'document.pdf'), pageSize: page });
  }, [title]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  const handleUndo = useCallback(async () => {
    if (!editorRef.current || !canUndo) return;
    setHistoryIndex(prevIdx => {
      const targetIndex = prevIdx - 1;
      const target = history[targetIndex];
      if (target) {
        applyingRef.current = true;
        (editorRef.current as any).render(target).then(() => {
          applyingRef.current = false;
        });
        return targetIndex;
      }
      return prevIdx;
    });
  }, [canUndo, history]);

  const handleRedo = useCallback(async () => {
    if (!editorRef.current || !canRedo) return;
    setHistoryIndex(prevIdx => {
      const targetIndex = prevIdx + 1;
      const target = history[targetIndex];
      if (target) {
        applyingRef.current = true;
        (editorRef.current as any).render(target).then(() => {
          applyingRef.current = false;
        });
        return targetIndex;
      }
      return prevIdx;
    });
  }, [canRedo, history]);

  return (
    <div className="">
      <div className="mx-auto max-w-3xl bg-white rounded-none overflow-hidden">
        <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-2 p-2">
            <div className="text-sm font-medium truncate pl-1">{title || 'Editor'}</div>
            <div className="ml-auto" />
            {lastSavedAt && (
              <div className="text-[11px] text-muted-foreground pr-2" title={new Date(lastSavedAt).toLocaleString()}>
                Saved • {new Date(lastSavedAt).toLocaleTimeString()}
              </div>
            )}
            <Button size="sm" variant="outline" onClick={handleUndo} disabled={!canUndo}>Undo</Button>
            <Button size="sm" variant="outline" onClick={handleRedo} disabled={!canRedo}>Redo</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">Export</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleExportPdf('a4')}>PDF (A4)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportPdf('letter')}>PDF (Letter)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportTextPdf('a4')}>PDF (Multi-page, text A4)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportHtml}>HTML (.html)</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportDoc}>Word (.doc)</DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>Print (System PDF)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-6 md:p-10">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-h1:mt-0 prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 prose-p:my-3 prose-ul:my-3 prose-ol:my-3">
            <div id={holderId} />
          </div>
        </div>
      </div>
    </div>
  );
}
;

export default BlocksEditor;
