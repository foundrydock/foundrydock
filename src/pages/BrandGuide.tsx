import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/auth/CompanyContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Save, Palette, Type, Image as ImageIcon, Globe, Link2 } from 'lucide-react';
import ShareDialog from '@/components/library/ShareDialog';

type BrandSettings = Tables<'brand_settings'>;

const FONTS = ['Inter', 'Helvetica Neue', 'Arial', 'Georgia', 'Times New Roman', 'Roboto', 'Lato', 'Montserrat', 'Playfair Display'];

export default function BrandGuide() {
  const { activeCompany, isCompanyAdmin } = useCompany();
  const qc = useQueryClient();
  const logoLightRef = useRef<HTMLInputElement>(null);
  const logoDarkRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState<'light' | 'dark' | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<Partial<BrandSettings> | null>(null);

  const { data: brand, isLoading } = useQuery({
    queryKey: ['brand', activeCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('company_id', activeCompany!.id)
        .single();
      if (data) setLocalSettings(data);
      return data as BrandSettings;
    },
    enabled: !!activeCompany?.id,
  });

  const settings = { ...brand, ...localSettings } as BrandSettings;

  function update(field: Partial<BrandSettings>) {
    setLocalSettings(prev => ({ ...prev, ...field }));
  }

  async function save() {
    if (!activeCompany || !settings) return;
    setSaving(true);
    const { error } = await supabase
      .from('brand_settings')
      .upsert({ ...settings, company_id: activeCompany.id, updated_at: new Date().toISOString() });
    if (error) toast.error('Tallennus epäonnistui');
    else { toast.success('Brand-asetukset tallennettu'); qc.invalidateQueries({ queryKey: ['brand', activeCompany.id] }); }
    setSaving(false);
  }

  async function uploadLogo(file: File, variant: 'light' | 'dark') {
    if (!activeCompany) return;
    setUploadingLogo(variant);
    const ext = file.name.split('.').pop();
    const path = `${activeCompany.id}/brand/logo-${variant}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('assets').upload(path, file, { contentType: file.type, upsert: true });
    if (uploadError) { toast.error('Logo-lataus epäonnistui'); setUploadingLogo(null); return; }

    const field = variant === 'light' ? { logo_light_path: path } : { logo_dark_path: path };
    update(field);

    // Persist immediately to Supabase so it survives page refresh
    const currentSettings = { ...brand, ...localSettings } as BrandSettings;
    const { error: saveError } = await supabase
      .from('brand_settings')
      .upsert({ ...currentSettings, ...field, company_id: activeCompany.id, updated_at: new Date().toISOString() });
    if (saveError) toast.error('Logon tallennus epäonnistui');
    else {
      qc.invalidateQueries({ queryKey: ['brand', activeCompany.id] });
      toast.success(`Logo (${variant === 'light' ? 'vaalea' : 'tumma'} tausta) ladattu`);
    }
    setUploadingLogo(null);
  }

  function LogoPreview({ path, label, dark = false }: { path: string | null | undefined; label: string; dark?: boolean }) {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
      if (!path) { setUrl(null); return; }
      supabase.storage.from('assets').createSignedUrl(path, 3600).then(({ data }) => {
        if (data?.signedUrl) setUrl(data.signedUrl);
      });
    }, [path]);
    return (
      <div className={`aspect-video rounded-xl flex items-center justify-center overflow-hidden ${dark ? 'bg-neutral-950 border border-neutral-800' : 'bg-neutral-800'}`}>
        {url ? (
          <img src={url} alt={label} className="max-w-full max-h-full object-contain p-4" />
        ) : (
          <div className="text-center">
            <ImageIcon size={24} className="text-neutral-700 mx-auto mb-1" />
            <span className="text-neutral-600 text-xs">{label}</span>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Brand Guidelines</h1>
          <p className="text-neutral-500 text-sm mt-1">{activeCompany?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShareOpen(true)}
            className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 gap-2"
          >
            <Link2 size={15} />Jaa
          </Button>
          {isCompanyAdmin && (
            <Button onClick={save} disabled={saving} className="bg-white text-black hover:bg-neutral-100 gap-2">
              <Save size={15} />{saving ? 'Tallennetaan...' : 'Tallenna'}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Logot */}
        <Section title="Logot" icon={ImageIcon}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-neutral-400 text-xs mb-2 block">Vaalean taustan logo</Label>
              <LogoPreview path={settings?.logo_light_path} label="Vaalea tausta" />
              {isCompanyAdmin && (
                <>
                  <input ref={logoLightRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0], 'light')} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => logoLightRef.current?.click()}
                    disabled={uploadingLogo === 'light'}
                    className="mt-2 w-full border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 gap-2"
                  >
                    <Upload size={13} />{uploadingLogo === 'light' ? 'Ladataan...' : 'Lataa logo'}
                  </Button>
                </>
              )}
            </div>
            <div>
              <Label className="text-neutral-400 text-xs mb-2 block">Tumman taustan logo</Label>
              <LogoPreview path={settings?.logo_dark_path} label="Tumma tausta" dark={true} />
              {isCompanyAdmin && (
                <>
                  <input ref={logoDarkRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && uploadLogo(e.target.files[0], 'dark')} />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => logoDarkRef.current?.click()}
                    disabled={uploadingLogo === 'dark'}
                    className="mt-2 w-full border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 gap-2"
                  >
                    <Upload size={13} />{uploadingLogo === 'dark' ? 'Ladataan...' : 'Lataa logo'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Section>

        {/* Värit */}
        <Section title="Värit" icon={Palette}>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 'primary_color', label: 'Pääväri' },
              { key: 'secondary_color', label: 'Toissijainen' },
              { key: 'accent_color', label: 'Korostusväri' },
            ].map(({ key, label }) => (
              <div key={key}>
                <Label className="text-neutral-400 text-xs mb-2 block">{label}</Label>
                <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5">
                  <div
                    className="w-8 h-8 rounded-md shrink-0 border border-neutral-600"
                    style={{ backgroundColor: (settings as any)?.[key] ?? '#000' }}
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="color"
                      value={(settings as any)?.[key] ?? '#000000'}
                      onChange={e => update({ [key]: e.target.value } as any)}
                      disabled={!isCompanyAdmin}
                      className="opacity-0 absolute"
                      id={`color-${key}`}
                    />
                    <label htmlFor={`color-${key}`} className="cursor-pointer">
                      <div className="text-white text-sm font-mono">{(settings as any)?.[key] ?? '#000000'}</div>
                    </label>
                  </div>
                  {isCompanyAdmin && (
                    <label htmlFor={`color-${key}`} className="cursor-pointer">
                      <Palette size={14} className="text-neutral-500 hover:text-white transition-colors" />
                    </label>
                  )}
                </div>
                {/* Color swatch display */}
                <div
                  className="h-8 rounded-lg mt-2 w-full"
                  style={{ backgroundColor: (settings as any)?.[key] ?? '#000' }}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Typografia */}
        <Section title="Typografia" icon={Type}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'font_heading', label: 'Otsikkofont', preview: 'Aa Bb Cc' },
              { key: 'font_body', label: 'Leipätekstifontti', preview: 'Lorem ipsum dolor sit amet' },
            ].map(({ key, label, preview }) => (
              <div key={key}>
                <Label className="text-neutral-400 text-xs mb-2 block">{label}</Label>
                {isCompanyAdmin ? (
                  <select
                    value={(settings as any)?.[key] ?? 'Inter'}
                    onChange={e => update({ [key]: e.target.value } as any)}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none mb-2"
                  >
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                ) : (
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm mb-2">
                    {(settings as any)?.[key] ?? 'Inter'}
                  </div>
                )}
                <div
                  className="bg-neutral-800/50 rounded-lg px-4 py-4 text-white text-lg"
                  style={{ fontFamily: (settings as any)?.[key] ?? 'Inter' }}
                >
                  {preview}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Tiedot */}
        <Section title="Yleistiedot" icon={Globe}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-neutral-400 text-xs">Tagline</Label>
              <Input
                value={settings?.tagline ?? ''}
                onChange={e => update({ tagline: e.target.value })}
                disabled={!isCompanyAdmin}
                placeholder="Yrityksen iskulause"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-neutral-400 text-xs">Verkkosivusto</Label>
              <Input
                value={settings?.website ?? ''}
                onChange={e => update({ website: e.target.value })}
                disabled={!isCompanyAdmin}
                placeholder="https://..."
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600"
              />
            </div>
          </div>
        </Section>
      </div>

      {activeCompany && (
        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          target={{ type: 'folder', id: activeCompany.id, name: `${activeCompany.name} — Brand Guidelines` }}
        />
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-neutral-400" />
        <h2 className="text-white font-medium text-sm">{title}</h2>
      </div>
      <div className="bg-neutral-800/20 border border-neutral-800 rounded-xl p-5">
        {children}
      </div>
    </div>
  );
}
