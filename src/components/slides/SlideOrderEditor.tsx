import React, { useState, useCallback } from 'react';
import { GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SlideInfo {
  id: string;
  name: string;
  visible: boolean;
}

interface SlideOrderEditorProps {
  open: boolean;
  onClose: () => void;
  slides: { id: string; name: string }[];
  slideOrder: string[];
  hiddenSlides: Set<string>;
  onReorder: (newOrder: string[]) => void;
  onToggleVisibility: (slideId: string) => void;
}

export function SlideOrderEditor({
  open,
  onClose,
  slides,
  slideOrder,
  hiddenSlides,
  onReorder,
  onToggleVisibility,
}: SlideOrderEditorProps) {
  if (!open) return null;

  const orderedSlides = slideOrder
    .map(id => slides.find(s => s.id === id))
    .filter(Boolean) as { id: string; name: string }[];

  const moveSlide = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= orderedSlides.length) return;
    const newOrder = [...slideOrder];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    onReorder(newOrder);
  };

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 w-96 max-h-[80vh] bg-background border rounded-xl shadow-2xl z-[60] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-medium text-sm">Slidejen järjestys</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="overflow-y-auto max-h-[calc(80vh-56px)] p-2">
        {orderedSlides.map((slide, index) => {
          const isHidden = hiddenSlides.has(slide.id);
          return (
            <div
              key={slide.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 ${
                isHidden ? 'opacity-50 bg-muted' : 'bg-background hover:bg-muted'
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-medium text-muted-foreground w-6">{index + 1}</span>
              <span className="text-sm flex-1 truncate">{slide.name}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveSlide(index, -1)}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => moveSlide(index, 1)}
                  disabled={index === orderedSlides.length - 1}
                >
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onToggleVisibility(slide.id)}
                >
                  {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Hook to manage slide order and visibility per deck
const ORDER_PREFIX = 'slide-order-';
const HIDDEN_PREFIX = 'slide-hidden-';

export function useSlideOrder(deckOverridesKey: string, defaultSlideIds: string[]) {
  const orderKey = `${ORDER_PREFIX}${deckOverridesKey}`;
  const hiddenKey = `${HIDDEN_PREFIX}${deckOverridesKey}`;

  const [slideOrder, setSlideOrder] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(orderKey);
      const saved = raw ? JSON.parse(raw) : null;
      // Ensure all slides are present
      if (saved && Array.isArray(saved)) {
        const missing = defaultSlideIds.filter(id => !saved.includes(id));
        return [...saved, ...missing];
      }
      return defaultSlideIds;
    } catch {
      return defaultSlideIds;
    }
  });

  const [hiddenSlides, setHiddenSlides] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(hiddenKey);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const reorder = useCallback((newOrder: string[]) => {
    setSlideOrder(newOrder);
    localStorage.setItem(orderKey, JSON.stringify(newOrder));
  }, [orderKey]);

  const toggleVisibility = useCallback((slideId: string) => {
    setHiddenSlides(prev => {
      const next = new Set(prev);
      if (next.has(slideId)) next.delete(slideId);
      else next.add(slideId);
      localStorage.setItem(hiddenKey, JSON.stringify([...next]));
      return next;
    });
  }, [hiddenKey]);

  return { slideOrder, hiddenSlides, reorder, toggleVisibility };
}
