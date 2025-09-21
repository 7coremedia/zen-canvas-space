import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type EditorJS from '@editorjs/editorjs';
import { Button } from '@/components/ui/button';
import { exportHtmlToPdf } from '@/lib/pdf/export';
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
}

const BlocksEditor: React.FC<BlocksEditorProps> = ({ initialData, onChange, onExportPdf, title }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderId = useMemo(() => `editorjs-${Math.random().toString(36).slice(2)}`, []);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState<BlocksData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

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
          const data = (await instance.save()) as BlocksData;
          // Update external listener
          onChange?.(data);
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
        (editorRef.current as any).destroy();
        editorRef.current = null;
      }
    };
  }, [holderId, initialData, onChange]);

  const handleExport = useCallback(async () => {
    if (!editorRef.current) return;
    const data = (await (editorRef.current as any).save()) as BlocksData;
    const html = blocksToHtml(data);
    if (onExportPdf) onExportPdf(html);
    else exportHtmlToPdf(html, (title ? `${title}.pdf` : 'document.pdf'));
  }, [title, onExportPdf]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex >= 0 && historyIndex < history.length - 1;

  const handleUndo = useCallback(async () => {
    if (!editorRef.current || !canUndo) return;
    const targetIndex = historyIndex - 1;
    const target = history[targetIndex];
    if (target) {
      await (editorRef.current as any).render(target);
      setHistoryIndex(targetIndex);
    }
  }, [canUndo, historyIndex, history]);

  const handleRedo = useCallback(async () => {
    if (!editorRef.current || !canRedo) return;
    const targetIndex = historyIndex + 1;
    const target = history[targetIndex];
    if (target) {
      await (editorRef.current as any).render(target);
      setHistoryIndex(targetIndex);
    }
  }, [canRedo, historyIndex, history]);

  return (
    <div className="bg-muted/40 p-4 rounded-lg">
      <div className="mx-auto max-w-3xl bg-white rounded-xl border overflow-hidden">
        <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center gap-2 p-2">
            <div className="text-sm font-medium truncate pl-1">{title || 'Editor'}</div>
            <div className="ml-auto" />
            <Button size="sm" variant="outline" onClick={handleUndo} disabled={!canUndo}>Undo</Button>
            <Button size="sm" variant="outline" onClick={handleRedo} disabled={!canRedo}>Redo</Button>
            <Button size="sm" onClick={handleExport}>Export PDF</Button>
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
};

export default BlocksEditor;
