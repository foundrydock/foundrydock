import { useState, useCallback, useEffect } from 'react';

export interface DeckInfo {
  id: string;
  name: string;
  sourceTemplate: string; // 'demo'
  createdAt: string;
  updatedAt: string;
}

const DECKS_STORAGE_KEY = 'slideforge-decks';
const ACTIVE_DECK_KEY = 'slideforge-active-deck';
const OVERRIDES_PREFIX = 'slide-translation-overrides-';

function generateId() {
  return `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadDecks(): DeckInfo[] {
  try {
    const raw = localStorage.getItem(DECKS_STORAGE_KEY);
    const decks = raw ? JSON.parse(raw) : [];
    // Always ensure the default deck exists
    if (!decks.find((d: DeckInfo) => d.id === 'default')) {
      decks.unshift({
        id: 'default',
        name: 'Demo Deck',
        sourceTemplate: 'demo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return decks;
  } catch {
    return [{
      id: 'default',
      name: 'Demo Deck',
      sourceTemplate: 'demo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
  }
}

function saveDecks(decks: DeckInfo[]) {
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks));
}

export function useDeckManager() {
  const [decks, setDecks] = useState<DeckInfo[]>(loadDecks);
  const [activeDeckId, setActiveDeckId] = useState<string>(() => {
    return localStorage.getItem(ACTIVE_DECK_KEY) || 'default';
  });

  useEffect(() => { saveDecks(decks); }, [decks]);
  useEffect(() => { localStorage.setItem(ACTIVE_DECK_KEY, activeDeckId); }, [activeDeckId]);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  const cloneDeck = useCallback((sourceDeckId: string, newName: string) => {
    const source = decks.find(d => d.id === sourceDeckId);
    if (!source) return null;

    const newId = generateId();
    const now = new Date().toISOString();
    const newDeck: DeckInfo = {
      id: newId,
      name: newName,
      sourceTemplate: source.sourceTemplate,
      createdAt: now,
      updatedAt: now,
    };

    // Copy translation overrides
    const sourceKey = sourceDeckId === 'default' 
      ? 'slide-translation-overrides' 
      : `${OVERRIDES_PREFIX}${sourceDeckId}`;
    const sourceOverrides = localStorage.getItem(sourceKey);
    if (sourceOverrides) {
      localStorage.setItem(`${OVERRIDES_PREFIX}${newId}`, sourceOverrides);
    }

    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newId);
    return newDeck;
  }, [decks]);

  const createDeck = useCallback((name: string, template: string) => {
    const newId = generateId();
    const now = new Date().toISOString();
    const newDeck: DeckInfo = {
      id: newId,
      name,
      sourceTemplate: template,
      createdAt: now,
      updatedAt: now,
    };
    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newId);
    return newDeck;
  }, []);

  const renameDeck = useCallback((deckId: string, newName: string) => {
    setDecks(prev => prev.map(d => 
      d.id === deckId ? { ...d, name: newName, updatedAt: new Date().toISOString() } : d
    ));
  }, []);

  const deleteDeck = useCallback((deckId: string) => {
    if (deckId === 'default') return; // Can't delete default
    localStorage.removeItem(`${OVERRIDES_PREFIX}${deckId}`);
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (activeDeckId === deckId) setActiveDeckId('default');
  }, [activeDeckId]);

  const getOverridesKey = useCallback((deckId: string) => {
    return deckId === 'default' ? 'slide-translation-overrides' : `${OVERRIDES_PREFIX}${deckId}`;
  }, []);

  return {
    decks,
    activeDeck,
    activeDeckId,
    setActiveDeckId,
    cloneDeck,
    createDeck,
    renameDeck,
    deleteDeck,
    getOverridesKey,
  };
}
