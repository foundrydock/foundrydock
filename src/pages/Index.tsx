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
import { mittamuotoSlides } from '@/slides/mittamuoto';

interface SlideData {
  id: string;
  component: React.ComponentType<any>;
  name: string;
  isWIP: boolean;
  description?: string;
}

export default function Index() {
  const isMobile = useIsMobile();
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

  // Hide sidebar on mobile
  useEffect(() => {
    if (isMobile) setShowSidebar(false);
  }, [isMobile]);

  const slides = React.useMemo<SlideData[]>(() => 
    mittamuotoSlides.map((s) => ({
      id: `slide-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
      component: s.component,
      name: s.name,
      isWIP: false,
      description: undefined,
    })),
    []
  );

  const currentSlideId = slides[activeSlideIndex]?.id ?? null;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Touch swipe for mobile
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    
    // Only horizontal swipes (ignore vertical scroll)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) {
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else {
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      }
    }
  }, [slides.length]);

  // Print PDF handler
  const handlePrintPDF = useCallback(() => {
    window.print();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
        {slides.map((slide, i) => (
          <div key={slide.id} className="print-slide-page">
            <slide.component />
          </div>
        ))}
      </div>

      <div className="h-screen flex flex-col bg-background print:hidden">
        {/* Toolbar */}
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
        />

        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Sidebar - hidden on mobile */}
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

              {/* Sidebar Toggle */}
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

          {/* Main Canvas Area */}
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

            {/* Presenter Notes Panel - Bottom (hidden on mobile) */}
            {showNotes && !isMobile && (
              <PresenterNotesPanel
                slideId={currentSlideId}
                slideIndex={activeSlideIndex}
                onClose={() => setShowNotes(false)}
              />
            )}
          </div>
        </div>

        {/* Presentation Mode */}
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

        {/* Presenter View */}
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
