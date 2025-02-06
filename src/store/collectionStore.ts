import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Collection = Database['public']['Tables']['collections']['Row'];
type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
type ExternalLink = Database['public']['Tables']['external_links']['Row'];

interface CollectionState {
  collections: (Collection & { external_link?: ExternalLink | null })[];
  loading: boolean;
  error: string | null;
  fetchCollections: (userId: string) => Promise<void>;
  createCollection: (collection: CollectionInsert & { external_link?: { title: string; url: string; image_url?: string } }) => Promise<void>;
  updateCollection: (id: string, collection: Partial<Collection> & { external_link?: { title: string; url: string; image_url?: string } }) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  loading: false,
  error: null,
  fetchCollections: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          external_link:external_links(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      set({ collections: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch collections' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  createCollection: async (collection) => {
    set({ loading: true, error: null });
    try {
      let external_link_id = null;

      // Create external link if provided
      if (collection.external_link?.title && collection.external_link?.url) {
        const { data: linkData, error: linkError } = await supabase
          .from('external_links')
          .insert({
            title: collection.external_link.title,
            url: collection.external_link.url,
            image_url: collection.external_link.image_url || null
          })
          .select()
          .single();

        if (linkError) throw linkError;
        external_link_id = linkData.id;
      }

      // Create collection with external link reference
      const { data: newCollection, error } = await supabase
        .from('collections')
        .insert({
          title: collection.title,
          description: collection.description,
          cover_image_url: collection.cover_image_url,
          category: collection.category,
          user_id: collection.user_id,
          activation_ids: collection.activation_ids || [],
          external_link_id
        })
        .select(`
          *,
          external_link:external_links(*)
        `)
        .single();
      
      if (error) throw error;
      
      // Update local state
      const collections = get().collections;
      set({ collections: [newCollection, ...collections] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create collection' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateCollection: async (id, collection) => {
    set({ loading: true, error: null });
    try {
      // Get the current collection
      const currentCollection = get().collections.find(c => c.id === id);
      if (!currentCollection) throw new Error('Collection not found');

      let external_link_id = currentCollection.external_link_id;

      // Handle external link
      if (collection.external_link) {
        if (external_link_id) {
          // Update existing external link
          const { error: linkError } = await supabase
            .from('external_links')
            .update({
              title: collection.external_link.title,
              url: collection.external_link.url,
              image_url: collection.external_link.image_url || null
            })
            .eq('id', external_link_id);

          if (linkError) throw linkError;
        } else if (collection.external_link.title && collection.external_link.url) {
          // Create new external link
          const { data: linkData, error: linkError } = await supabase
            .from('external_links')
            .insert({
              title: collection.external_link.title,
              url: collection.external_link.url,
              image_url: collection.external_link.image_url || null
            })
            .select()
            .single();

          if (linkError) throw linkError;
          external_link_id = linkData.id;
        }
      }

      // Update collection
      const { data: updatedCollection, error } = await supabase
        .from('collections')
        .update({
          title: collection.title,
          description: collection.description,
          cover_image_url: collection.cover_image_url,
          category: collection.category,
          activation_ids: collection.activation_ids || [],
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
      const collections = get().collections.map(c => 
        c.id === id ? updatedCollection : c
      );
      set({ collections });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update collection' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  deleteCollection: async (id) => {
    set({ loading: true, error: null });
    try {
      const collection = get().collections.find(c => c.id === id);
      if (!collection) throw new Error('Collection not found');

      // Delete the collection (external link will be cascade deleted)
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      const collections = get().collections.filter(c => c.id !== id);
      set({ collections });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to delete collection' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));