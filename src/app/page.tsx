'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VaultItem from '@/components/vault/VaultItem';
import VaultForm from '@/components/vault/VaultForm';
import PasswordGenerator from '@/components/vault/PasswordGenerator';
import SearchBar from '@/components/vault/SearchBar';
import MasterPasswordSetup from '@/components/auth/MasterPasswordSetup';
import { useMasterPassword } from '@/context/MasterPasswordContext';
import type { VaultItem as VaultItemType } from '@/types/vault';

export default function VaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { masterPassword } = useMasterPassword();
  const [items, setItems] = useState<VaultItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch vault items when session is available
  useEffect(() => {
    if (session && masterPassword) {
      fetchVaultItems();
    }
  }, [session, masterPassword]);

  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

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

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleItemAdded = () => {
    setShowForm(false);
    fetchVaultItems(); // Refresh the list
  };

  const handleItemDeleted = () => {
    fetchVaultItems(); // Refresh the list
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  // Show master password setup if not set
  if (!masterPassword) {
    return <MasterPasswordSetup />;
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
            Welcome, {session.user?.name || session.user?.email}
          </p>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {showGenerator ? 'Hide Generator' : 'Generate Password'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add New Item
            </button>
          </div>
        </div>

        {/* Password Generator */}
        {showGenerator && (
          <div className="mb-6">
            <PasswordGenerator onPasswordGenerated={fetchVaultItems} />
          </div>
        )}

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