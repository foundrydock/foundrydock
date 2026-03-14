import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from './AuthContext';

type Company = Tables<'companies'>;
type CompanyMember = Tables<'company_members'>;

interface CompanyContextType {
  companies: Company[];
  activeCompany: Company | null;
  activeCompanyId: string | null;
  memberRole: 'admin' | 'viewer' | null;
  isCompanyAdmin: boolean;
  setActiveCompanyId: (id: string) => void;
  loading: boolean;
  refetch: () => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

const STORAGE_KEY = 'mm_active_company';

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user, isAdmin: isGlobalAdmin } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [memberships, setMemberships] = useState<CompanyMember[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY)
  );
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!user) { setCompanies([]); setMemberships([]); setLoading(false); return; }
    setLoading(true);

    if (isGlobalAdmin) {
      // Global admins see all companies
      const { data, error } = await supabase.from('companies').select('*').order('name');
      console.debug('[CompanyContext] admin query – data:', data?.length, '| error:', error?.message);
      setCompanies(data ?? []);
    } else {
      // Others see only their companies via membership
      const { data: memberData, error: memErr } = await supabase
        .from('company_members')
        .select('*, companies(*)')
        .eq('user_id', user.id);
      console.debug('[CompanyContext] member query – data:', memberData?.length, '| error:', memErr?.message);
      const comps = (memberData ?? []).map((m: any) => m.companies).filter(Boolean);
      setCompanies(comps);
    }

    const { data: memData } = await supabase
      .from('company_members')
      .select('*')
      .eq('user_id', user.id);
    setMemberships(memData ?? []);

    setLoading(false);
  }

  useEffect(() => { load(); }, [user, isGlobalAdmin]);

  // Auto-select first company if none selected or saved one not available
  useEffect(() => {
    if (companies.length === 0) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && companies.find(c => c.id === saved)) return;
    setActiveCompanyIdState(companies[0].id);
    localStorage.setItem(STORAGE_KEY, companies[0].id);
  }, [companies]);

  function setActiveCompanyId(id: string) {
    setActiveCompanyIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  const activeCompany = companies.find(c => c.id === activeCompanyId) ?? companies[0] ?? null;
  const membership = memberships.find(m => m.company_id === activeCompany?.id);
  const memberRole = isGlobalAdmin ? 'admin' : (membership?.role ?? null);

  return (
    <CompanyContext.Provider value={{
      companies,
      activeCompany,
      activeCompanyId: activeCompany?.id ?? null,
      memberRole,
      isCompanyAdmin: memberRole === 'admin',
      setActiveCompanyId,
      loading,
      refetch: load,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
  return ctx;
}
