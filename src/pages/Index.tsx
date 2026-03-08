import React, { useState, useEffect, useCallback } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { PresenterView } from '@/components/slides/PresenterView';
import { PresenterNotesPanel } from '@/components/slides/PresenterNotesPanel';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/i18n/LanguageContext';
import { useDeckManager } from '@/hooks/useDeckManager';
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
  const { setOverridesKey } = useLanguage();
  const deckManager = useDeckManager();
  const { activeDeck, activeDeckId } = deckManager;

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

  // Sync overrides key with active deck
  useEffect(() => {
    setOverridesKey(deckManager.getOverridesKey(activeDeckId));
  }, [activeDeckId, deckManager, setOverridesKey]);

  // Reset slide index on deck switch
  useEffect(() => {
    setActiveSlideIndex(0);
  }, [activeDeckId]);

  useEffect(() => {
    if (isMobile) setShowSidebar(false);
  }, [isMobile]);

  const slides = React.useMemo<SlideData[]>(() => {
    const templateSlides = templateMap[activeDeck.sourceTemplate] || mittamuotoSlides;
    return templateSlides.map((s) => ({
      id: `slide-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
      component: s.component,
      name: s.name,
      isWIP: false,
      description: undefined,
    }));
  }, [activeDeck.sourceTemplate]);

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
        />

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
