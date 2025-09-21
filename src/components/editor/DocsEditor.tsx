import React, { useEffect } from 'react';
import { EditorContent, useEditor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Button } from '@/components/ui/button';

interface DocsEditorProps {
  initialContent: string;
  onExport: (contentHtml: string) => void;
}

export const DocsEditor: React.FC<DocsEditorProps> = ({ initialContent, onExport }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent]);

  if (!editor) return null;

  const exportPdf = () => {
    const html = editor.getHTML();
    onExport(html);
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      {/* Top bar with only Export */}
      <div className="flex items-center justify-end gap-2 border-b p-2 bg-gray-50">
        <Button size="sm" onClick={exportPdf}>Export PDF</Button>
      </div>

      {/* Floating bubble menu for formatting */}
      <BubbleMenu editor={editor} tippyOptions={{ duration: 150 }}>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full border bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-lg">
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('bold') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
          >
            B
          </button>
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('italic') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
          >
            I
          </button>
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('underline') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
          >
            U
          </button>
          <span className="mx-1 h-4 w-px bg-muted" />
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('heading', { level: 1 }) ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }}
          >
            H1
          </button>
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }}
          >
            H2
          </button>
          <span className="mx-1 h-4 w-px bg-muted" />
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('bulletList') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
          >
            •
          </button>
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('orderedList') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }}
          >
            1.
          </button>
          <span className="mx-1 h-4 w-px bg-muted" />
          <button
            className={`px-2 py-1 rounded-full text-sm ${editor.isActive('link') ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-muted'}`}
            onMouseDown={(e) => {
              e.preventDefault();
              const prev = editor.getAttributes('link')?.href as string | undefined;
              const url = window.prompt('Enter URL', prev || '') || '';
              if (url) editor.chain().focus().setLink({ href: url }).run();
              else editor.chain().focus().unsetLink().run();
            }}
          >
            Link
          </button>
        </div>
      </BubbleMenu>

      {/* Editor content */}
      <div className="p-6 md:p-8">
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-h1:mt-0 prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 prose-p:my-3 prose-ul:my-3 prose-ol:my-3">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
;

export default DocsEditor;
