import { cn } from '@/lib/utils';
import { Grid3X3, FileText, MoreVertical, Play, Monitor, Moon, Sun, Printer, Pencil, PencilOff } from 'lucide-react';
import { getAccessRole } from '@/components/PasswordGate';
import { useLanguage, Language } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DeckSwitcher } from '@/components/layout/DeckSwitcher';
import type { DeckInfo } from '@/hooks/useDeckManager';

interface DeckManagerApi {
  decks: DeckInfo[];
  activeDeck: DeckInfo;
  activeDeckId: string;
  setActiveDeckId: (id: string) => void;
  cloneDeck: (sourceId: string, name: string) => DeckInfo | null;
  createDeck: (name: string, template: string) => DeckInfo;
  renameDeck: (id: string, name: string) => void;
  deleteDeck: (id: string) => void;
}

interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onStartPresentation?: () => void;
  onStartPresenterView?: () => void;
  onPrintPDF?: () => void;
  className?: string;
  deckManager?: DeckManagerApi;
}

export function Toolbar({
  showGrid,
  onToggleGrid,
  showNotes,
  onToggleNotes,
  isDarkMode,
  onToggleDarkMode,
  onStartPresentation,
  onStartPresenterView,
  onPrintPDF,
  className,
  deckManager,
}: ToolbarProps) {
  return (
    <div className={cn('h-12 border-b bg-background flex items-center', className)}>
      {/* Left section - Logo + Deck Switcher */}
      <div className="flex items-center px-4 gap-3">
        <span className="text-sm font-medium tracking-tight text-foreground">SlideForge</span>
        {deckManager && (
          <DeckSwitcher
            decks={deckManager.decks}
            activeDeck={deckManager.activeDeck}
            onSelectDeck={deckManager.setActiveDeckId}
            onCloneDeck={deckManager.cloneDeck}
            onCreateDeck={deckManager.createDeck}
            onRenameDeck={deckManager.renameDeck}
            onDeleteDeck={deckManager.deleteDeck}
          />
        )}
      </div>

      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center justify-end flex-shrink-0 px-4 gap-1">
        <EditModeToggle />
        <LanguageSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[70]">
            <DropdownMenuItem onClick={onToggleGrid}>
              <Grid3X3 className="h-4 w-4 mr-2" />
              {showGrid ? 'Piilota ruudukko' : 'Näytä ruudukko'}
              <span className="ml-auto text-xs text-muted-foreground">⇧G</span>
            </DropdownMenuItem>
            {onToggleNotes && (
              <DropdownMenuItem onClick={onToggleNotes}>
                <FileText className="h-4 w-4 mr-2" />
                {showNotes ? 'Piilota muistiinpanot' : 'Näytä muistiinpanot'}
                <span className="ml-auto text-xs text-muted-foreground">⇧N</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onStartPresentation && (
              <DropdownMenuItem onClick={onStartPresentation}>
                <Play className="h-4 w-4 mr-2" />
                Esitä
                <span className="ml-auto text-xs text-muted-foreground">⇧P</span>
              </DropdownMenuItem>
            )}
            {onStartPresenterView && (
              <DropdownMenuItem onClick={onStartPresenterView}>
                <Monitor className="h-4 w-4 mr-2" />
                Esittäjänäkymä
                <span className="ml-auto text-xs text-muted-foreground">⇧V</span>
              </DropdownMenuItem>
            )}
            {onPrintPDF && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onPrintPDF}>
                  <Printer className="h-4 w-4 mr-2" />
                  Tulosta PDF
                </DropdownMenuItem>
              </>
            )}
            {onToggleDarkMode && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Vaalea tila' : 'Tumma tila'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function EditModeToggle() {
  const { editMode, setEditMode } = useLanguage();
  return (
    <Button
      variant={editMode ? 'default' : 'ghost'}
      size="icon"
      onClick={() => setEditMode(!editMode)}
      title={editMode ? 'Lopeta muokkaus' : 'Muokkaa tekstejä'}
      className={cn(editMode && 'bg-slide-accent text-white hover:bg-slide-accent/90')}
    >
      {editMode ? <PencilOff className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
    </Button>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const languages: { code: Language; label: string }[] = [
    { code: 'fi', label: 'FI' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="flex items-center gap-0.5 bg-muted rounded-md p-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            'px-2 py-1 text-xs font-medium rounded transition-colors',
            language === lang.code
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
