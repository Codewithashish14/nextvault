'use client';

import { useState, useEffect, useContext } from 'react';
import { MasterPasswordContext } from '@/context/MasterPasswordContext';
import VaultItem from '@/components/vault/VaultItem';
import VaultForm from '@/components/vault/VaultForm';
import SearchBar from '@/components/vault/SearchBar';
import { VaultItem as VaultItemType } from '@/types/vault';

export default function VaultPage() {
  const [items, setItems] = useState<VaultItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { masterPassword } = useContext(MasterPasswordContext);

  const fetchVaultItems = async () => {
    try {
      console.log('Fetching vault items...');
      const response = await fetch('/api/vault');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched items:', data);
      
      setItems(data.items || []);
      setFilteredItems(data.items || []);
    } catch (error) {
      console.error('Error fetching vault items:', error);
      alert('Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (masterPassword) {
      fetchVaultItems();
    }
  }, [masterPassword]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleItemAdded = () => {
    setShowForm(false);
    fetchVaultItems(); // Refresh the list
  };

  const handleItemDeleted = () => {
    fetchVaultItems(); // Refresh the list
  };

  if (!masterPassword) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Master Password Required
            </h1>
            <p className="text-gray-600">
              Please enter your master password to view your vault.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Secure Vault
          </h1>
          <p className="text-gray-600">
            Welcome! Manage your passwords securely.
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add New Item
          </button>
        </div>

        {/* Add Item Form */}
        {showForm && (
          <div className="mb-6">
            <VaultForm 
              onItemAdded={handleItemAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Vault Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Vault Items ({filteredItems.length})
            </h2>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading vault items...</div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  {items.length === 0 ? 'No items in your vault yet.' : 'No items match your search.'}
                </div>
                {items.length === 0 && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Item
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredItems.map((item) => (
                  <VaultItem
                    key={item._id?.toString() || Math.random()}
                    item={item}
                    onUpdate={fetchVaultItems}
                    onDelete={handleItemDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}