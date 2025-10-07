// src/store/vault-store.ts
import { create } from 'zustand';
import { VaultItem } from '@/types/vault';

interface VaultState {
  items: VaultItem[];
  setItems: (items: VaultItem[]) => void;
  addItem: (item: VaultItem) => void;
  updateItem: (id: string, item: VaultItem) => void;
  removeItem: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) => (item._id === id ? updatedItem : item)),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    })),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));