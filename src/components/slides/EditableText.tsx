import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface EditableTextProps {
  k: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children?: never;
}

export function T({ k, as: Tag = 'span', className }: EditableTextProps) {
  const { t, editMode, updateTranslation } = useLanguage();
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const text = t(k);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    setEditing(true);
  }, [editMode]);

  const commitEdit = useCallback(() => {
    if (ref.current) {
      const newText = ref.current.textContent?.trim() || '';
      if (newText && newText !== text) {
        updateTranslation(k, newText);
      }
    }
    setEditing(false);
  }, [k, text, updateTranslation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commitEdit();
    }
    if (e.key === 'Escape') {
      if (ref.current) ref.current.textContent = text;
      setEditing(false);
    }
  }, [commitEdit, text]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  // Reset editing when edit mode turns off
  useEffect(() => {
    if (!editMode) setEditing(false);
  }, [editMode]);

  const editableProps = editMode ? {
    onClick: handleClick,
    style: {
      cursor: 'pointer',
      outline: editing ? '2px solid hsl(var(--slide-accent))' : undefined,
      outlineOffset: '2px',
      borderRadius: '4px',
      background: editing ? 'hsl(var(--slide-accent) / 0.08)' : undefined,
      boxShadow: !editing ? 'inset 0 0 0 1px hsl(var(--slide-accent) / 0.2)' : undefined,
      minWidth: '20px',
    } as React.CSSProperties,
  } : {};

  return React.createElement(Tag, {
    ref,
    className,
    contentEditable: editing,
    suppressContentEditableWarning: true,
    onBlur: editing ? commitEdit : undefined,
    onKeyDown: editing ? handleKeyDown : undefined,
    ...editableProps,
  }, text);
}
