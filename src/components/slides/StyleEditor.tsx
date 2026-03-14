import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Palette, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StyleOverrides {
  slideAccent: string;
  slideAccentLight: string;
  slidePrimary: string;
}

const DEFAULT_STYLES: StyleOverrides = {
  slideAccent: '',
  slideAccentLight: '',
  slidePrimary: '',
};

const PRESET_THEMES = [
  { name: 'Mustavalkoinen', accent: '0 0% 15%', accentLight: '0 0% 45%', primary: '0 0% 8%' },
  { name: 'Sininen', accent: '207 90% 54%', accentLight: '207 70% 60%', primary: '215 100% 20%' },
  { name: 'Vihreä', accent: '145 63% 42%', accentLight: '145 50% 55%', primary: '145 60% 15%' },
  { name: 'Oranssi', accent: '24 95% 53%', accentLight: '24 80% 65%', primary: '24 80% 20%' },
  { name: 'Violetti', accent: '270 60% 50%', accentLight: '270 50% 65%', primary: '270 60% 15%' },
];

function getStyleStorageKey(overridesKey: string) {
  return `style-overrides-${overridesKey}`;
}

function loadStyles(overridesKey: string): StyleOverrides {
  try {
    const raw = localStorage.getItem(getStyleStorageKey(overridesKey));
    return raw ? { ...DEFAULT_STYLES, ...JSON.parse(raw) } : DEFAULT_STYLES;
  } catch {
    return DEFAULT_STYLES;
  }
}

function saveStyles(overridesKey: string, styles: StyleOverrides) {
  localStorage.setItem(getStyleStorageKey(overridesKey), JSON.stringify(styles));
}

function applyStyles(styles: StyleOverrides) {
  const root = document.documentElement;
  if (styles.slideAccent) root.style.setProperty('--slide-accent', styles.slideAccent);
  else root.style.removeProperty('--slide-accent');
  if (styles.slideAccentLight) root.style.setProperty('--slide-accent-light', styles.slideAccentLight);
  else root.style.removeProperty('--slide-accent-light');
  if (styles.slidePrimary) root.style.setProperty('--slide-primary', styles.slidePrimary);
  else root.style.removeProperty('--slide-primary');
}

export function useStyleOverrides() {
  const { overridesKey } = useLanguage();

  useEffect(() => {
    const styles = loadStyles(overridesKey);
    applyStyles(styles);
  }, [overridesKey]);
}

interface StyleEditorProps {
  open: boolean;
  onClose: () => void;
}

export function StyleEditor({ open, onClose }: StyleEditorProps) {
  const { overridesKey } = useLanguage();
  const [styles, setStyles] = useState<StyleOverrides>(() => loadStyles(overridesKey));

  useEffect(() => {
    setStyles(loadStyles(overridesKey));
  }, [overridesKey]);

  const updateStyle = useCallback((key: keyof StyleOverrides, value: string) => {
    setStyles(prev => {
      const next = { ...prev, [key]: value };
      saveStyles(overridesKey, next);
      applyStyles(next);
      return next;
    });
  }, [overridesKey]);

  const applyPreset = useCallback((preset: typeof PRESET_THEMES[0]) => {
    const next: StyleOverrides = {
      slideAccent: preset.accent,
      slideAccentLight: preset.accentLight,
      slidePrimary: preset.primary,
    };
    setStyles(next);
    saveStyles(overridesKey, next);
    applyStyles(next);
  }, [overridesKey]);

  const resetStyles = useCallback(() => {
    setStyles(DEFAULT_STYLES);
    saveStyles(overridesKey, DEFAULT_STYLES);
    applyStyles(DEFAULT_STYLES);
  }, [overridesKey]);

  if (!open) return null;

  return (
    <div className="fixed top-12 right-4 w-72 bg-background border rounded-xl shadow-2xl z-[60] overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <span className="font-medium text-sm">Tyylit</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-5">
        {/* Preset themes */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teemat</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs hover:bg-muted transition-colors"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: `hsl(${preset.accent})` }}
                />
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom colors */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mukautetut värit</span>
          <ColorInput
            label="Korostusväri"
            hslValue={styles.slideAccent}
            onChange={(v) => updateStyle('slideAccent', v)}
          />
          <ColorInput
            label="Korostus (vaalea)"
            hslValue={styles.slideAccentLight}
            onChange={(v) => updateStyle('slideAccentLight', v)}
          />
          <ColorInput
            label="Pääväri"
            hslValue={styles.slidePrimary}
            onChange={(v) => updateStyle('slidePrimary', v)}
          />
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={resetStyles}>
          <RotateCcw className="w-3 h-3 mr-2" />
          Palauta oletukset
        </Button>
      </div>
    </div>
  );
}

function hslToHex(hsl: string): string {
  if (!hsl) return '#000000';
  const parts = hsl.trim().split(/\s+/);
  if (parts.length < 3) return '#000000';
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const a2 = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function ColorInput({ label, hslValue, onChange }: { label: string; hslValue: string; onChange: (v: string) => void }) {
  const hexValue = hslToHex(hslValue || '0 0% 50%');

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-foreground">{label}</span>
      <input
        type="color"
        value={hexValue}
        onChange={(e) => onChange(hexToHsl(e.target.value))}
        className="w-8 h-8 rounded border cursor-pointer"
      />
    </div>
  );
}
