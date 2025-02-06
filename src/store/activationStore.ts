import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Activation = Database['public']['Tables']['activations']['Row'];
type ActivationInsert = Database['public']['Tables']['activations']['Insert'];
type ExternalLink = Database['public']['Tables']['external_links']['Row'];

interface ActivationState {
  activations: (Activation & { external_link?: ExternalLink | null })[];
  loading: boolean;
  error: string | null;
  fetchActivations: (userId: string) => Promise<void>;
  createActivation: (activation: ActivationInsert & { external_link?: { title: string; url: string; image_url?: string } }) => Promise<void>;
  updateActivation: (id: string, activation: Partial<Activation> & { external_link?: { title: string; url: string; image_url?: string } }) => Promise<void>;
  deleteActivation: (id: string) => Promise<void>;
}

export const useActivationStore = create<ActivationState>((set, get) => ({
  activations: [],
  loading: false,
  error: null,
  fetchActivations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('activations')
        .select(`
          *,
          external_link:external_links(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ activations: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch activations' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  createActivation: async (activation) => {
    set({ loading: true, error: null });
    try {
      let external_link_id = null;

      // Create external link if provided
      if (activation.external_link?.title && activation.external_link?.url) {
        const { data: linkData, error: linkError } = await supabase
          .from('external_links')
          .insert({
            title: activation.external_link.title,
            url: activation.external_link.url,
            image_url: activation.external_link.image_url || null
          })
          .select()
          .single();

        if (linkError) throw linkError;
        external_link_id = linkData.id;
      }

      // Create activation with external link reference
      const { data: newActivation, error } = await supabase
        .from('activations')
        .insert({
          title: activation.title,
          description: activation.description,
          trigger_image_url: activation.trigger_image_url,
          video_url: activation.video_url,
          user_id: activation.user_id,
          external_link_id
        })
        .select(`
          *,
          external_link:external_links(*)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      const activations = get().activations;
      set({ activations: [newActivation, ...activations] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create activation' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateActivation: async (id, activation) => {
    set({ loading: true, error: null });
    try {
      // Get the current activation
      const currentActivation = get().activations.find(a => a.id === id);
      if (!currentActivation) throw new Error('Activation not found');

      let external_link_id = currentActivation.external_link_id;

      // Handle external link
      if (activation.external_link) {
        if (external_link_id) {
          // Update existing external link
          const { error: linkError } = await supabase
            .from('external_links')
            .update({
              title: activation.external_link.title,
              url: activation.external_link.url,
              image_url: activation.external_link.image_url || null
            })
            .eq('id', external_link_id);

          if (linkError) throw linkError;
        } else if (activation.external_link.title && activation.external_link.url) {
          // Create new external link
          const { data: linkData, error: linkError } = await supabase
            .from('external_links')
            .insert({
              title: activation.external_link.title,
              url: activation.external_link.url,
              image_url: activation.external_link.image_url || null
            })
            .select()
            .single();

          if (linkError) throw linkError;
          external_link_id = linkData.id;
        }
      }

      // Update activation
      const { data: updatedActivation, error } = await supabase
        .from('activations')
        .update({
          title: activation.title,
          description: activation.description,
          trigger_image_url: activation.trigger_image_url,
          video_url: activation.video_url,
          external_link_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          external_link:external_links(*)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      const activations = get().activations.map(a => 
        a.id === id ? updatedActivation : a
      );
      set({ activations });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update activation' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  deleteActivation: async (id) => {
    set({ loading: true, error: null });
    try {
      const activation = get().activations.find(a => a.id === id);
      if (!activation) throw new Error('Activation not found');

      // Delete the activation (external link will be cascade deleted)
      const { error } = await supabase
        .from('activations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const activations = get().activations.filter(a => a.id !== id);
      set({ activations });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete activation' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));