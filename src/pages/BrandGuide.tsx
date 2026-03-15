import { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/auth/CompanyContext';
import { Tables } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Save, Palette, Type, Image as ImageIcon, Globe, Link2, FileText, Info } from 'lucide-react';
import ShareDialog from '@/components/library/ShareDialog';

type BrandSettings = Tables<'brand_settings'>;

interface GuidelinesContent {
  logo_light_notes?: string;
  logo_dark_path_notes?: string;
  logo_usage_rules?: string;
  color_descriptions?: Record<string, string>;
}

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

  const guidelines: GuidelinesContent = (settings?.guidelines_content as GuidelinesContent) ?? {};

  function update(field: Partial<BrandSettings>) {
    setLocalSettings(prev => ({ ...prev, ...field }));
  }

  function updateGuidelines(field: Partial<GuidelinesContent>) {
    const current = ((localSettings?.guidelines_content ?? brand?.guidelines_content ?? {}) as GuidelinesContent);
    update({ guidelines_content: { ...current, ...field } });
  }

  function updateColorDescription(color: string, desc: string) {
    const current = ((localSettings?.guidelines_content ?? brand?.guidelines_content ?? {}) as GuidelinesContent);
    update({
      guidelines_content: {
        ...current,
        color_descriptions: { ...(current.color_descriptions ?? {}), [color]: desc },
      },
    });
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
    const { error: uploadError } = await supabase.storage.from('assets').upload(path, file, { contentType: file.type });
    if (uploadError) { 
      console.error('Logo upload error:', uploadError);
      toast.error(`Logo-lataus epäonnistui: ${uploadError.message}`); 
      setUploadingLogo(null); 
      return; 
    }

    const field = variant === 'light' ? { logo_light_path: path } : { logo_dark_path: path };
    update(field);

    const currentSettings = { ...brand, ...localSettings } as BrandSettings;
    const { error: saveError } = await supabase
      .from('brand_settings')
      .upsert({ ...currentSettings, ...field, company_id: activeCompany.id, updated_at: new Date().toISOString() });
    if (saveError) { console.error('Logo save error:', saveError); toast.error(`Logon tallennus epäonnistui: ${saveError.message}`); }
    else {
      qc.invalidateQueries({ queryKey: ['brand', activeCompany.id] });
      toast.success(`Logo (${variant === 'light' ? 'vaalea' : 'tumma'} tausta) ladattu`);
    }
    setUploadingLogo(null);
  }

  if (isLoading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin" />
    </div>
  );

  const colorFields = [
    { key: 'primary_color', label: 'Pääväri' },
    { key: 'secondary_color', label: 'Toissijainen' },
    { key: 'accent_color', label: 'Korostusväri' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
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
          {/* Logo käyttöohjeet */}
          <div className="mb-6">
            <Label className="text-neutral-400 text-xs mb-2 block">Logon käyttöohjeet ja rajoitukset</Label>
            {isCompanyAdmin ? (
              <textarea
                value={guidelines.logo_usage_rules ?? ''}
                onChange={e => updateGuidelines({ logo_usage_rules: e.target.value })}
                placeholder="Esim: Logoa ei saa venyttää tai muokata värejä. Säilytä aina vähintään X px tyhjä tila logon ympärillä..."
                rows={3}
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none resize-none placeholder:text-neutral-600 focus:border-neutral-500"
              />
            ) : guidelines.logo_usage_rules ? (
              <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-neutral-300 text-sm whitespace-pre-wrap">
                {guidelines.logo_usage_rules}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Vaalea logo */}
            <div className="space-y-3">
              <Label className="text-neutral-400 text-xs block">Vaalean taustan logo</Label>
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
                    className="w-full border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 gap-2"
                  >
                    <Upload size={13} />{uploadingLogo === 'light' ? 'Ladataan...' : 'Lataa logo'}
                  </Button>
                </>
              )}
              <div>
                <Label className="text-neutral-500 text-xs mb-1.5 block">Kuvaus / käyttötarkoitus</Label>
                {isCompanyAdmin ? (
                  <textarea
                    value={guidelines.logo_light_notes ?? ''}
                    onChange={e => updateGuidelines({ logo_light_notes: e.target.value })}
                    placeholder="Esim: Käytä valkoisilla ja vaaleilla taustoilla, printtimateriaaleissa..."
                    rows={2}
                    className="w-full bg-neutral-800/60 border border-neutral-700/60 text-neutral-300 text-xs rounded-lg px-3 py-2 outline-none resize-none placeholder:text-neutral-600 focus:border-neutral-500"
                  />
                ) : guidelines.logo_light_notes ? (
                  <p className="text-neutral-400 text-xs leading-relaxed">{guidelines.logo_light_notes}</p>
                ) : null}
              </div>
            </div>

            {/* Tumma logo */}
            <div className="space-y-3">
              <Label className="text-neutral-400 text-xs block">Tumman taustan logo</Label>
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
                    className="w-full border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 gap-2"
                  >
                    <Upload size={13} />{uploadingLogo === 'dark' ? 'Ladataan...' : 'Lataa logo'}
                  </Button>
                </>
              )}
              <div>
                <Label className="text-neutral-500 text-xs mb-1.5 block">Kuvaus / käyttötarkoitus</Label>
                {isCompanyAdmin ? (
                  <textarea
                    value={guidelines.logo_dark_path_notes ?? ''}
                    onChange={e => updateGuidelines({ logo_dark_path_notes: e.target.value })}
                    placeholder="Esim: Käytä tummilla taustoilla, digitaalisissa kanavissa, sosiaalisessa mediassa..."
                    rows={2}
                    className="w-full bg-neutral-800/60 border border-neutral-700/60 text-neutral-300 text-xs rounded-lg px-3 py-2 outline-none resize-none placeholder:text-neutral-600 focus:border-neutral-500"
                  />
                ) : guidelines.logo_dark_path_notes ? (
                  <p className="text-neutral-400 text-xs leading-relaxed">{guidelines.logo_dark_path_notes}</p>
                ) : null}
              </div>
            </div>
          </div>
        </Section>

        {/* Värit */}
        <Section title="Värit" icon={Palette}>
          <div className="grid grid-cols-3 gap-4">
            {colorFields.map(({ key, label }) => {
              const colorValue = (settings as any)?.[key] ?? '#000000';
              const colorDesc = guidelines.color_descriptions?.[key] ?? '';
              return (
                <div key={key} className="space-y-2">
                  <Label className="text-neutral-400 text-xs block">{label}</Label>
                  <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5">
                    <div
                      className="w-8 h-8 rounded-md shrink-0 border border-neutral-600"
                      style={{ backgroundColor: colorValue }}
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="color"
                        value={colorValue}
                        onChange={e => update({ [key]: e.target.value } as any)}
                        disabled={!isCompanyAdmin}
                        className="opacity-0 absolute"
                        id={`color-${key}`}
                      />
                      <label htmlFor={`color-${key}`} className="cursor-pointer">
                        <div className="text-white text-sm font-mono">{colorValue}</div>
                      </label>
                    </div>
                    {isCompanyAdmin && (
                      <label htmlFor={`color-${key}`} className="cursor-pointer">
                        <Palette size={14} className="text-neutral-500 hover:text-white transition-colors" />
                      </label>
                    )}
                  </div>
                  <div className="h-6 rounded-md w-full" style={{ backgroundColor: colorValue }} />
                  {isCompanyAdmin ? (
                    <input
                      type="text"
                      value={colorDesc}
                      onChange={e => updateColorDescription(key, e.target.value)}
                      placeholder="Käyttötarkoitus, esim. CTA-painikkeet..."
                      className="w-full bg-neutral-800/60 border border-neutral-700/60 text-neutral-300 text-xs rounded-lg px-3 py-2 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
                    />
                  ) : colorDesc ? (
                    <p className="text-neutral-500 text-xs">{colorDesc}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Typografia */}
        <Section title="Typografia" icon={Type}>
          <div className="grid grid-cols-2 gap-6">
            {[
              { key: 'font_heading', label: 'Otsikkofontti', preview: 'Aa Bb Cc — Otsikko' },
              { key: 'font_body', label: 'Leipätekstifontti', preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
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
                  className="bg-neutral-800/50 rounded-lg px-4 py-4 text-white"
                  style={{ fontFamily: (settings as any)?.[key] ?? 'Inter' }}
                >
                  <div className="text-2xl font-bold mb-1" style={{ fontFamily: key === 'font_heading' ? ((settings as any)?.[key] ?? 'Inter') : undefined }}>
                    {key === 'font_heading' ? preview : 'Otsikko'}
                  </div>
                  {key === 'font_body' && <div className="text-sm text-neutral-300">{preview}</div>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Yleistiedot */}
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

        {/* Muistiinpanot / vapaa sisältö */}
        <Section title="Lisäohjeet ja muistiinpanot" icon={FileText}>
          <div className="space-y-2">
            <p className="text-neutral-500 text-xs">Vapaa tekstikenttä brändiohjeille, äänensävylle, kuvallisille periaatteille jne.</p>
            {isCompanyAdmin ? (
              <textarea
                value={(guidelines as any).extra_notes ?? ''}
                onChange={e => updateGuidelines({ ...(guidelines as any), extra_notes: e.target.value })}
                placeholder="Esim: Brändin äänensävy on asiantunteva mutta lähestyttävä. Vältä liian teknistä kieltä..."
                rows={5}
                className="w-full bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 outline-none resize-y placeholder:text-neutral-600 focus:border-neutral-500"
              />
            ) : (guidelines as any).extra_notes ? (
              <div className="bg-neutral-800/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-neutral-300 text-sm whitespace-pre-wrap">
                {(guidelines as any).extra_notes}
              </div>
            ) : (
              <p className="text-neutral-600 text-sm italic">Ei lisäohjeita.</p>
            )}
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

function LogoPreview({ path, label, dark = false }: { path: string | null | undefined; label: string; dark?: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!path) { setUrl(null); return; }
    supabase.storage.from('assets').createSignedUrl(path, 3600).then(({ data }) => {
      if (data?.signedUrl) setUrl(data.signedUrl);
    });
  }, [path]);
  return (
    <div className={`aspect-video rounded-xl flex items-center justify-center overflow-hidden ${dark ? 'bg-neutral-950 border border-neutral-800' : 'bg-neutral-100'}`}>
      {url ? (
        <img src={url} alt={label} className="max-w-full max-h-full object-contain p-4" />
      ) : (
        <div className="text-center">
          <ImageIcon size={24} className={dark ? 'text-neutral-700 mx-auto mb-1' : 'text-neutral-400 mx-auto mb-1'} />
          <span className={dark ? 'text-neutral-600 text-xs' : 'text-neutral-400 text-xs'}>{label}</span>
        </div>
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
