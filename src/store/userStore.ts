import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: (partnerId: string) => Promise<void>;
  createUser: (user: UserInsert) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async (partnerId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('partner_id', partnerId)
        .order('first_name');
      
      if (error) throw error;
      set({ users: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to fetch users' });
    } finally {
      set({ loading: false });
    }
  },
  createUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('users')
        .insert([user]);
      
      if (error) throw error;
      
      // Refresh users list
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('partner_id', user.partner_id)
        .order('first_name');
      
      if (fetchError) throw fetchError;
      set({ users: data || [] });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create user' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (id, user) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refresh users list for the partner
      const { data: updatedUser } = await supabase
        .from('users')
        .select('partner_id')
        .eq('id', id)
        .single();
      
      if (updatedUser) {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('partner_id', updatedUser.partner_id)
          .order('first_name');
        
        if (fetchError) throw fetchError;
        set({ users: data || [] });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to update user' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));