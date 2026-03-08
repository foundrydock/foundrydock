import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Plus, Trash2, Pencil, Check, ChevronDown, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeckInfo } from '@/hooks/useDeckManager';

interface DeckSwitcherProps {
  decks: DeckInfo[];
  activeDeck: DeckInfo;
  onSelectDeck: (id: string) => void;
  onCloneDeck: (sourceId: string, name: string) => void;
  onCreateDeck: (name: string, template: string) => void;
  onRenameDeck: (id: string, name: string) => void;
  onDeleteDeck: (id: string) => void;
}

type ModalMode = 'clone' | 'create' | 'rename' | null;

const TEMPLATES = [
  { id: 'mittamuoto', label: 'Mittamuoto Pitch' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'demo', label: 'Demo' },
];

export function DeckSwitcher({
  decks,
  activeDeck,
  onSelectDeck,
  onCloneDeck,
  onCreateDeck,
  onRenameDeck,
  onDeleteDeck,
}: DeckSwitcherProps) {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [deckName, setDeckName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('mittamuoto');
  const [targetDeckId, setTargetDeckId] = useState('');

  const openClone = (deckId: string) => {
    const source = decks.find(d => d.id === deckId);
    setDeckName(`${source?.name || 'Deck'} (kopio)`);
    setTargetDeckId(deckId);
    setModalMode('clone');
  };

  const openRename = (deckId: string) => {
    const source = decks.find(d => d.id === deckId);
    setDeckName(source?.name || '');
    setTargetDeckId(deckId);
    setModalMode('rename');
  };

  const openCreate = () => {
    setDeckName('');
    setSelectedTemplate('mittamuoto');
    setModalMode('create');
  };

  const handleConfirm = () => {
    if (!deckName.trim()) return;
    if (modalMode === 'clone') {
      onCloneDeck(targetDeckId, deckName.trim());
    } else if (modalMode === 'create') {
      onCreateDeck(deckName.trim(), selectedTemplate);
    } else if (modalMode === 'rename') {
      onRenameDeck(targetDeckId, deckName.trim());
    }
    setModalMode(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 max-w-[200px]">
            <Layers className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs font-medium">{activeDeck.name}</span>
            <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 z-[70]">
          {decks.map(deck => (
            <DropdownMenuItem
              key={deck.id}
              className={cn('flex items-center justify-between group', deck.id === activeDeck.id && 'bg-accent')}
              onClick={() => onSelectDeck(deck.id)}
            >
              <span className="truncate flex-1">{deck.name}</span>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => { e.stopPropagation(); openRename(deck.id); }}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); openClone(deck.id); }}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Copy className="h-3 w-3" />
                </button>
                {deck.id !== 'default' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteDeck(deck.id); }}
                    className="p-1 hover:bg-destructive/20 rounded text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Uusi dekki
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={modalMode !== null} onOpenChange={(open) => !open && setModalMode(null)}>
        <DialogContent className="sm:max-w-[400px] z-[80]">
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'clone' && 'Kloonaa dekki'}
              {modalMode === 'create' && 'Uusi dekki'}
              {modalMode === 'rename' && 'Nimeä uudelleen'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="deck-name">Nimi</Label>
              <Input
                id="deck-name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                placeholder="Dekin nimi"
                autoFocus
              />
            </div>
            {modalMode === 'create' && (
              <div>
                <Label>Pohja</Label>
                <div className="flex gap-2 mt-1.5">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                        selectedTemplate === tpl.id
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background text-foreground border-input hover:bg-muted'
                      )}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalMode(null)}>Peruuta</Button>
            <Button onClick={handleConfirm} disabled={!deckName.trim()}>
              <Check className="h-4 w-4 mr-1" />
              {modalMode === 'clone' ? 'Kloonaa' : modalMode === 'rename' ? 'Tallenna' : 'Luo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
