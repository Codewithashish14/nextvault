'use client';

import { VaultItem } from '@/types/vault';
import VaultItemComponent from './VaultItem';

interface VaultListProps {
  items: VaultItem[];
  onItemUpdated: () => void;
  onItemDeleted: () => void;
}

export default function VaultList({ items, onItemUpdated, onItemDeleted }: VaultListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items in vault</h3>
        <p className="text-gray-500 text-sm">Get started by adding your first password item.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Vault Items ({items.length})
        </h2>
      </div>
      
      {items.map((item) => (
        <VaultItemComponent
          key={item._id}
          item={item}
          onUpdate={onItemUpdated}
          onDelete={onItemDeleted}
        />
      ))}
    </div>
  );
}