'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VaultList from '@/components/vault/VaultList';
import VaultForm from '@/components/vault/VaultForm';
import PasswordGenerator from '@/components/vault/PasswordGenerator';
import SearchBar from '@/components/vault/SearchBar';
import MasterPasswordSetup from '@/components/auth/MasterPasswordSetup';
import { useMasterPassword } from '@/context/MasterPasswordContext';
import type { VaultItem } from '@/types/vault';

export default function VaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { masterPassword } = useMasterPassword(); //  Move inside component
  const [items, setItems] = useState<VaultItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch vault items when session is available
  useEffect(() => {
    if (session) {
      fetchVaultItems();
    }
  }, [session]);

  // Filter items based on search term
  useEffect(() => {
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const fetchVaultItems = async () => {
    try {
      const response = await fetch('/api/vault');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching vault items:', error);
    }
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Secure Vault</h1>
            <p className="text-gray-600 mt-1">
              Welcome, {session.user?.name || session.user?.email}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showGenerator ? 'Hide Generator' : 'Generate Password'}
            </button>
          </div>
        </div>

        {showGenerator && (
          <div className="mb-8">
            <PasswordGenerator onPasswordGenerated={fetchVaultItems} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <SearchBar onSearch={setSearchTerm} />
              <div className="mt-6">
                <VaultForm onItemAdded={fetchVaultItems} />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <VaultList 
                items={filteredItems} 
                onItemUpdated={fetchVaultItems}
                onItemDeleted={fetchVaultItems}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}