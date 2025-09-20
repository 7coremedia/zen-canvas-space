import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
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
    <div className="border rounded-md shadow-sm bg-white">
      <div className="flex flex-wrap gap-2 border-b p-2 bg-gray-50">
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBold().run()}>B</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleItalic().run()}>I</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Button>
        <Button size="sm" variant="outline" onClick={() => {
          const url = window.prompt('Enter URL') || '';
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>Link</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>+ Table</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col</Button>
        <Button size="sm" variant="outline" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</Button>
        <Button size="sm" variant="destructive" onClick={() => editor.chain().focus().deleteTable().run()}>Del Table</Button>
        <div className="ml-auto" />
        <Button size="sm" onClick={exportPdf}>Export PDF</Button>
      </div>
      <div className="p-4 prose prose-neutral dark:prose-invert max-w-none prose-h1:mt-0 prose-h1:mb-3 prose-h2:mt-6 prose-h2:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
        <EditorContent 
          editor={editor} 
        />
      </div>
    </div>
  );
};

export default DocsEditor;
