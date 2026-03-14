import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { PresenterView } from '@/components/slides/PresenterView';
import { PresenterNotesPanel } from '@/components/slides/PresenterNotesPanel';
import { StyleEditor, useStyleOverrides } from '@/components/slides/StyleEditor';
import { SlideOrderEditor, useSlideOrder } from '@/components/slides/SlideOrderEditor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/i18n/LanguageContext';
import { useDeckManager } from '@/hooks/useDeckManager';
import { useAuth } from '@/auth/AuthContext';
import { mittamuotoSlides } from '@/slides/mittamuoto';
import { showcaseSlides } from '@/slides/showcase';
import { demoSlides } from '@/slides/demo';

interface SlideData {
  id: string;
  component: React.ComponentType<any>;
  name: string;
  isWIP: boolean;
  description?: string;
}

const templateMap: Record<string, typeof mittamuotoSlides> = {
  mittamuoto: mittamuotoSlides,
  showcase: showcaseSlides,
  demo: demoSlides,
};

export default function Index() {
  const isMobile = useIsMobile();
  const { setOverridesKey, overridesKey } = useLanguage();
  const deckManager = useDeckManager();
  const { activeDeck, activeDeckId } = deckManager;
  const { isAdmin } = useAuth();
  const isEditor = isAdmin;
  const { deckId: urlDeckId } = useParams<{ deckId: string }>();

  // Lataa deck Supabasesta URL-parametrin perusteella
  const { data: supabaseDeck } = useQuery({
    queryKey: ['pitchdeck-edit', urlDeckId],
    queryFn: async () => {
      const { data } = await supabase
        .from('pitchdecks')
        .select('*')
        .eq('id', urlDeckId!)
        .single();
      return data;
    },
    enabled: !!urlDeckId,
  });

  // Supabase-tallennusfunktiot (debounced)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveToDB = useCallback((fields: Record<string, unknown>) => {
    if (!urlDeckId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      await supabase.from('pitchdecks').update(fields).eq('id', urlDeckId);
    }, 500);
  }, [urlDeckId]);

  const handleSaveSlideOrder = useCallback((order: string[], hidden: string[]) => {
    saveToDB({ slide_order: order, hidden_slides: hidden });
  }, [saveToDB]);

  const handleSaveStyleOverrides = useCallback((styles: unknown) => {
    saveToDB({ style_overrides: styles });
  }, [saveToDB]);

  useStyleOverrides(supabaseDeck?.style_overrides);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isPresenterView, setIsPresenterView] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [showSlideOrder, setShowSlideOrder] = useState(false);

  // Aseta overrides key Supabase-deckistä tai localStoragesta
  useEffect(() => {
    if (supabaseDeck?.overrides_key) {
      setOverridesKey(supabaseDeck.overrides_key);
    } else {
      setOverridesKey(deckManager.getOverridesKey(activeDeckId));
    }
  }, [supabaseDeck, activeDeckId, deckManager, setOverridesKey]);

  // Reset slide index on deck switch
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [urlDeckId, activeDeckId]);

  useEffect(() => {
    if (isMobile) setShowSidebar(false);
  }, [isMobile]);

  // All slides from template – Supabase-deck ylikirjoittaa localStoragen
  const activeTemplate = supabaseDeck?.template ?? activeDeck.sourceTemplate;
  const allSlides = React.useMemo<SlideData[]>(() => {
    const templateSlides = templateMap[activeTemplate] || mittamuotoSlides;
    return templateSlides.map((s) => ({
      id: `slide-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
      component: s.component,
      name: s.name,
      isWIP: false,
      description: undefined,
    }));
  }, [activeTemplate]);

  const defaultSlideIds = React.useMemo(() => allSlides.map(s => s.id), [allSlides]);

  const { slideOrder, hiddenSlides, reorder, toggleVisibility } = useSlideOrder(
    overridesKey,
    defaultSlideIds,
    supabaseDeck?.slide_order ?? undefined,
    supabaseDeck?.hidden_slides ?? undefined,
    urlDeckId ? handleSaveSlideOrder : undefined,
  );

  // Ordered and filtered slides
  const slides = React.useMemo<SlideData[]>(() => {
    const ordered = slideOrder
      .map(id => allSlides.find(s => s.id === id))
      .filter(Boolean) as SlideData[];
    // Add any slides not in order (new slides)
    const missing = allSlides.filter(s => !slideOrder.includes(s.id));
    return [...ordered, ...missing].filter(s => !hiddenSlides.has(s.id));
  }, [allSlides, slideOrder, hiddenSlides]);

  const currentSlideId = slides[activeSlideIndex]?.id ?? null;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else {
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      }
    }
  }, [slides.length]);

  const handlePrintPDF = useCallback(() => {
    window.print();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if ((e.target as HTMLElement)?.contentEditable === 'true') return;
      if (isPresentationMode || isPresenterView) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'G' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      } else if (e.key === 'N' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowNotes(prev => !prev);
      } else if (e.key === 'S' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      } else if (e.key === 'P' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode(true);
      } else if (e.key === 'V' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresenterView(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isPresentationMode, isPresenterView]);

  const ActiveSlideComponent = slides[activeSlideIndex]?.component || mittamuotoSlides[0].component;

  return (
    <>
      {/* Print-only: render all slides for PDF export */}
      <div className="print-slides">
        {slides.map((slide) => (
          <div key={slide.id} className="print-slide-page">
            <slide.component />
          </div>
        ))}
      </div>

      <div className="h-screen flex flex-col bg-background print:hidden">
        <Toolbar
          showGrid={showGrid}
          onToggleGrid={() => {
            const newShowGrid = !showGrid;
            setShowGrid(newShowGrid);
            if (newShowGrid) setShowSidebar(false);
          }}
          showNotes={showNotes}
          onToggleNotes={() => setShowNotes(!showNotes)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onStartPresentation={() => setIsPresentationMode(true)}
          onStartPresenterView={() => setIsPresenterView(true)}
          onPrintPDF={handlePrintPDF}
          deckManager={deckManager}
          onToggleStyleEditor={isEditor ? () => setShowStyleEditor(p => !p) : undefined}
          onToggleSlideOrder={isEditor ? () => setShowSlideOrder(p => !p) : undefined}
          showStyleEditor={showStyleEditor}
          showSlideOrder={showSlideOrder}
        />

        {/* Editor panels */}
        {isEditor && (
          <StyleEditor
            open={showStyleEditor}
            onClose={() => setShowStyleEditor(false)}
            supabaseStyles={supabaseDeck?.style_overrides}
            onSave={urlDeckId ? handleSaveStyleOverrides : undefined}
          />
        )}
        {isEditor && (
          <SlideOrderEditor
            open={showSlideOrder}
            onClose={() => setShowSlideOrder(false)}
            slides={allSlides.map(s => ({ id: s.id, name: s.name }))}
            slideOrder={slideOrder}
            hiddenSlides={hiddenSlides}
            onReorder={reorder}
            onToggleVisibility={toggleVisibility}
          />
        )}

        <div className="flex-1 flex overflow-hidden relative">
          {!isMobile && (
            <>
              <div 
                className="flex-shrink-0 overflow-hidden z-50 h-full"
                style={{ 
                  width: showSidebar ? sidebarWidth : 0,
                  transition: isResizing ? 'none' : 'width 200ms ease-out',
                }}
              >
                <div className="h-full" style={{ width: sidebarWidth }}>
                  <Sidebar
                    slides={slides.map((slide) => ({
                      id: slide.id,
                      content: <slide.component />,
                    }))}
                    activeSlideIndex={activeSlideIndex}
                    onSlideClick={setActiveSlideIndex}
                    width={sidebarWidth}
                    onWidthChange={setSidebarWidth}
                    onResizeStart={() => setIsResizing(true)}
                    onResizeEnd={() => setIsResizing(false)}
                    onSnapClose={() => setShowSidebar(false)}
                  />
                </div>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="absolute top-1.5 z-40 h-8 w-6 flex items-center justify-center bg-background border border-l-0 rounded-r-full shadow-sm hover:bg-muted"
                      style={{ 
                        left: showSidebar ? sidebarWidth - 5 : -4,
                        transition: isResizing ? 'none' : 'left 200ms ease-out, background-color 150ms'
                      }}
                    >
                      {showSidebar ? (
                        <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronsRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'} (⇧S)
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <div 
            className="flex-1 flex flex-col overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex-1 relative overflow-hidden">
              <SlideCanvas
                showGrid={false}
                zoom={zoom}
                onZoomChange={isMobile ? undefined : setZoom}
                currentSlide={activeSlideIndex + 1}
                totalSlides={slides.length}
                onPrevSlide={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
                onNextSlide={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
              >
                <ActiveSlideComponent />
              </SlideCanvas>

              {showGrid && (
                <SlideOverviewGrid
                  slides={slides}
                  activeSlideIndex={activeSlideIndex}
                  onSlideClick={setActiveSlideIndex}
                  onClose={() => setShowGrid(false)}
                />
              )}
            </div>

            {showNotes && !isMobile && (
              <PresenterNotesPanel
                slideId={currentSlideId}
                slideIndex={activeSlideIndex}
                onClose={() => setShowNotes(false)}
              />
            )}
          </div>
        </div>

        {isPresentationMode && (
          <PresentationMode
            slides={slides.map(slide => ({
              id: slide.id,
              component: slide.component,
              isWIP: slide.isWIP,
              description: slide.description,
            }))}
            activeIndex={activeSlideIndex}
            onIndexChange={setActiveSlideIndex}
            onExit={() => setIsPresentationMode(false)}
          />
        )}

        {isPresenterView && (
          <PresenterView
            slides={slides.map(slide => ({
              id: slide.id,
              component: slide.component,
              isWIP: slide.isWIP,
              description: slide.description,
            }))}
            activeIndex={activeSlideIndex}
            onIndexChange={setActiveSlideIndex}
            onExit={() => setIsPresenterView(false)}
          />
        )}
      </div>
    </>
  );
}
