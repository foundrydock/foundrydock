import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
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
  Table as TableIcon, Image as ImageIcon, Minus, Quote, Printer,
  Code, Code2, Baseline, LayoutTemplate
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BrandData {
  primary?:     string | null;
  secondary?:   string | null;
  accent?:      string | null;
  logoUrl?:     string | null;
  companyName?: string;
  tagline?:     string | null;
}

interface RichEditorProps {
  content: Json;
  onChange?: (content: Json) => void;
  readOnly?: boolean;
  brandData?: BrandData;
}

const EDITOR_FONTS = ['Inter', 'Helvetica Neue', 'Arial', 'Georgia', 'Times New Roman', 'Roboto', 'Lato', 'Montserrat'];

const STANDARD_COLORS = [
  '#111111', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f9fafb',
  '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#2563eb',
  '#7c3aed', '#db2777',
];

export default function RichEditor({ content, onChange, readOnly = false, brandData }: RichEditorProps) {
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      FontFamily,
      TipTapImage.configure({ allowBase64: true }),
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

  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {!readOnly && <EditorToolbar editor={editor} brandData={brandData} />}
      {/* Page canvas — light gray outer bg, white A4-like page */}
      <div className="flex-1 overflow-auto bg-[#e8e8e8] print:bg-white print:overflow-visible">
        <div className="max-w-[800px] mx-auto py-10 px-6 print:p-0 print:max-w-none">
          <style>{`
            /* ── A4 page card ─────────────────────────────── */
            .doc-page {
              background: #fff;
              color: #111;
              box-shadow: 0 2px 16px rgba(0,0,0,0.18);
              border-radius: 2px;
              padding: 60px 72px;
              min-height: 1040px;
            }
            /* ── Typography ───────────────────────────────── */
            .ProseMirror { outline: none; min-height: 600px; color: #111; }
            .ProseMirror h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 0.75rem; line-height: 1.2; color: #111; }
            .ProseMirror h2 { font-size: 1.4rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #1a1a1a; }
            .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.4rem; color: #1a1a1a; }
            .ProseMirror p { margin: 0.5rem 0; line-height: 1.75; color: #222; }
            .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; margin: 0.5rem 0; color: #222; }
            .ProseMirror li { margin: 0.25rem 0; }
            .ProseMirror blockquote { border-left: 3px solid #d1d5db; padding-left: 1rem; color: #6b7280; margin: 1rem 0; font-style: italic; }
            .ProseMirror hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
            /* ── Tables ───────────────────────────────────── */
            .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            .ProseMirror td, .ProseMirror th { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; color: #222; }
            .ProseMirror th { background: #f3f4f6; font-weight: 600; color: #111; }
            /* ── Media ────────────────────────────────────── */
            .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 0.5rem 0; }
            .ProseMirror img.doc-footer-logo { max-height: 56px; width: auto; border-radius: 0; display: block; margin: 0.5rem auto; }
            /* ── Code ─────────────────────────────────────── */
            .ProseMirror code { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 0.25rem; padding: 0.1em 0.35em; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.875em; color: #374151; }
            .ProseMirror pre { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; overflow-x: auto; }
            .ProseMirror pre code { background: none; border: none; padding: 0; font-size: 0.875rem; line-height: 1.6; color: #374151; }
            /* ── Placeholder ──────────────────────────────── */
            .ProseMirror .is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; float: left; height: 0; }
            /* ── Print ────────────────────────────────────── */
            @page {
              size: A4;
              margin: 2cm 2.5cm;
            }
            @media print {
              .editor-toolbar { display: none !important; }
              .doc-page {
                box-shadow: none !important;
                padding: 0 !important;
                min-height: unset !important;
                border-radius: 0 !important;
              }
              .ProseMirror { min-height: unset !important; }
              /* Estä sivunvaihto otsikoiden sisällä tai juuri ennen kappaletta */
              .ProseMirror h1,
              .ProseMirror h2,
              .ProseMirror h3 {
                page-break-after: avoid;
                break-after: avoid;
              }
              /* Älä leikkaa taulukkoja tai kuvia sivunvaihdolla */
              .ProseMirror table,
              .ProseMirror figure,
              .ProseMirror img,
              .ProseMirror blockquote {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              /* Orpokontrolli */
              .ProseMirror p {
                orphans: 3;
                widows: 3;
              }
            }
          `}</style>
          <div className="doc-page print:p-0">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Toolbar ────────────────────────────────────────────────────────────────

function EditorToolbar({ editor, brandData }: { editor: ReturnType<typeof useEditor>; brandData?: BrandData }) {
  if (!editor) return null;

  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function insertImage() {
    const url = window.prompt('Kuvan URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  function insertFooter() {
    if (!editor) return;
    const primary = brandData?.primary ?? '#404040';

    const parts: string[] = [];

    // Decorative line with brand primary color
    parts.push(`<p style="border-top: 2px solid ${primary}; margin: 2rem 0 1.25rem;"></p>`);

    // Logo if available
    if (brandData?.logoUrl) {
      parts.push(
        `<p style="text-align: center; margin: 0.5rem 0;">` +
        `<img src="${brandData.logoUrl}" alt="${brandData.companyName ?? 'Logo'}" class="doc-footer-logo" style="max-height:56px;display:inline-block;" />` +
        `</p>`
      );
    }

    // Company name
    if (brandData?.companyName) {
      parts.push(
        `<p style="text-align: center; font-weight: bold; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.8rem; margin: 0.25rem 0;">` +
        `${brandData.companyName}</p>`
      );
    }

    // Tagline
    if (brandData?.tagline) {
      parts.push(
        `<p style="text-align: center; color: #888; font-size: 0.75rem; font-style: italic; margin: 0;">` +
        `${brandData.tagline}</p>`
      );
    }

    editor.chain().focus().insertContent(parts.join('')).run();
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

      {/* Font family */}
      <select
        value={editor.getAttributes('textStyle').fontFamily ?? ''}
        onChange={e => {
          if (e.target.value) editor.chain().focus().setFontFamily(e.target.value).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        title="Fontti"
        className="text-xs bg-neutral-800 border border-neutral-700 text-neutral-300 rounded px-2 py-1 h-7 outline-none hover:border-neutral-500 max-w-[110px]"
      >
        <option value="">Oletusfontti</option>
        {EDITOR_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

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

      {/* Text color swatch picker */}
      <ColorSwatchPicker editor={editor} brandData={brandData} />

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

      {/* Code */}
      <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Koodi (inline)">
        <Code size={14} />
      </ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Koodilohko">
        <Code2 size={14} />
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

      {/* Footer */}
      <ToolBtn onClick={insertFooter} title="Lisää alatunniste (logo + koristeviva)">
        <LayoutTemplate size={14} />
      </ToolBtn>

      <Divider />

      {/* Print */}
      <ToolBtn onClick={() => window.print()} title="Tulosta / Tallenna PDF">
        <Printer size={14} />
      </ToolBtn>
    </div>
  );
}

// ─── Color Swatch Picker ─────────────────────────────────────────────────────

function ColorSwatchPicker({ editor, brandData }: { editor: ReturnType<typeof useEditor>; brandData?: BrandData }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  if (!editor) return null;

  const currentColor = editor.getAttributes('textStyle').color ?? '#111111';

  const brandSwatches = [
    { color: brandData?.primary,   label: 'Pääväri' },
    { color: brandData?.secondary, label: 'Toissijainen' },
    { color: brandData?.accent,    label: 'Korostus' },
  ].filter((s): s is { color: string; label: string } => !!s.color);

  function pick(color: string) {
    editor?.chain().focus().setColor(color).run();
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <ToolBtn onClick={() => setOpen(v => !v)} active={open} title="Tekstin väri">
        <div className="flex flex-col items-center gap-0.5">
          <Baseline size={13} />
          <div className="w-3.5 h-1 rounded-sm" style={{ backgroundColor: currentColor }} />
        </div>
      </ToolBtn>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-neutral-900 border border-neutral-700 rounded-xl p-3 shadow-2xl z-50 w-[196px]">
          {brandSwatches.length > 0 && (
            <>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Brändivärit</p>
              <div className="flex gap-2 mb-3">
                {brandSwatches.map(({ color, label }) => (
                  <button
                    key={color}
                    title={label}
                    onClick={() => pick(color)}
                    className="group relative w-8 h-8 rounded-lg border-2 border-neutral-600 hover:border-white transition-colors shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-neutral-500 group-hover:text-neutral-300 whitespace-nowrap hidden group-hover:block">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Perusvärit</p>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {STANDARD_COLORS.map(color => (
              <button
                key={color}
                title={color}
                onClick={() => pick(color)}
                className={cn(
                  'w-6 h-6 rounded-md transition-transform hover:scale-110',
                  color === '#ffffff' ? 'border border-neutral-500' : ''
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <button
            onClick={() => { editor?.chain().focus().unsetColor().run(); setOpen(false); }}
            className="w-full text-[10px] text-neutral-500 hover:text-white transition-colors py-1 border-t border-neutral-800 mt-1"
          >
            Poista värimääritys
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

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
