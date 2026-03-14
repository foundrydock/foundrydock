import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Image as TipTapImage } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Json } from '@/integrations/supabase/types';
import {
  Bold, Italic, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Heading3, Undo, Redo,
  Table as TableIcon, Image as ImageIcon, Minus, Quote, Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  content: Json;
  onChange?: (content: Json) => void;
  readOnly?: boolean;
  brandColors?: { primary: string; accent: string };
}

export default function RichEditor({ content, onChange, readOnly = false, brandColors }: RichEditorProps) {
  // Use ref to always have latest onChange callback available to TipTap
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      TipTapImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: 'Aloita kirjoittaminen...' }),
    ],
    content: (content && typeof content === 'object' && (content as any).type === 'doc')
      ? content as object
      : { type: 'doc', content: [{ type: 'paragraph' }] },
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChangeRef.current?.(editor.getJSON() as Json);
    },
  });

  // Päivitä editoitavuus kun readOnly-prop muuttuu (esim. yritys latautuu jälkijunassa)
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto py-10 px-12">
          <style>{`
            .ProseMirror { outline: none; min-height: 600px; }
            .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 0.75rem; line-height: 1.2; }
            .ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
            .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; }
            .ProseMirror p { margin: 0.5rem 0; line-height: 1.7; }
            .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; }
            .ProseMirror li { margin: 0.25rem 0; }
            .ProseMirror blockquote { border-left: 3px solid #404040; padding-left: 1rem; color: #9ca3af; margin: 1rem 0; }
            .ProseMirror hr { border: none; border-top: 1px solid #404040; margin: 1.5rem 0; }
            .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            .ProseMirror td, .ProseMirror th { border: 1px solid #404040; padding: 0.5rem 0.75rem; }
            .ProseMirror th { background: #1a1a1a; font-weight: 600; }
            .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5rem 0; }
            .ProseMirror .is-editor-empty:first-child::before { content: attr(data-placeholder); color: #4b5563; pointer-events: none; float: left; height: 0; }
            @media print {
              .editor-toolbar { display: none !important; }
              .ProseMirror { min-height: unset !important; }
            }
          `}</style>
          <EditorContent editor={editor} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function insertImage() {
    const url = window.prompt('Kuvan URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div className="editor-toolbar flex flex-wrap items-center gap-0.5 px-4 py-2 border-b border-neutral-800 bg-neutral-900 sticky top-0 z-10">
      {/* History */}
      <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Kumoa">
        <Undo size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Tee uudelleen">
        <Redo size={14} />
      </ToolBtn>

      <Divider />

      {/* Headings */}
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Otsikko 1">
        <Heading1 size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Otsikko 2">
        <Heading2 size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Otsikko 3">
        <Heading3 size={14} />
      </ToolBtn>

      <Divider />

      {/* Formatting */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Lihavointi">
        <Bold size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Kursiivi">
        <Italic size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Yliviivaus">
        <Strikethrough size={14} />
      </ToolBtn>

      <Divider />

      {/* Alignment */}
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Vasen">
        <AlignLeft size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Keskitys">
        <AlignCenter size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Oikea">
        <AlignRight size={14} />
      </ToolBtn>

      <Divider />

      {/* Lists */}
      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
        <List size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numeroitu lista">
        <ListOrdered size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Lainaus">
        <Quote size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Vaakaviiva">
        <Minus size={14} />
      </ToolBtn>

      <Divider />

      {/* Insert */}
      <ToolBtn onClick={insertTable} title="Lisää taulukko">
        <TableIcon size={14} />
      </ToolBtn>
      <ToolBtn onClick={insertImage} title="Lisää kuva URL:lla">
        <ImageIcon size={14} />
      </ToolBtn>

      <Divider />

      {/* Print/PDF */}
      <ToolBtn onClick={() => window.print()} title="Tulosta / Tallenna PDF">
        <Printer size={14} />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  onClick, active, disabled, title, children
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded text-sm transition-colors',
        active ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-neutral-700 mx-1" />;
}
