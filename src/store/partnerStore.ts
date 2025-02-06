import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Partner = Database['public']['Tables']['partners']['Row'];
type PartnerInsert = Database['public']['Tables']['partners']['Insert'];

interface PartnerState {
  partners: Partner[];
  loading: boolean;
  error: string | null;
  fetchPartners: () => Promise<void>;
  createPartner: (partner: PartnerInsert) => Promise<void>;
  updatePartner: (id: string, partner: Partial<Partner>) => Promise<void>;
}

export const usePartnerStore = create<PartnerState>((set) => ({
  partners: [],
  loading: false,
  error: null,
  fetchPartners: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('company_name');
      
      if (error) throw error;
      set({ partners: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch partners' });
    } finally {
      set({ loading: false });
    }
  },
  createPartner: async (partner) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('partners')
        .insert([partner]);
      
      if (error) throw error;
      
      // Refresh partners list
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*')
        .order('company_name');
      
      if (fetchError) throw fetchError;
      set({ partners: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create partner' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updatePartner: async (id, partner) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('partners')
        .update(partner)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh partners list
      const { data, error: fetchError } = await supabase
        .from('partners')
        .select('*')
        .order('company_name');
      
      if (fetchError) throw fetchError;
      set({ partners: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update partner' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));