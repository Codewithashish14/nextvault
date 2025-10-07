'use client';

import { useState, useContext } from 'react';
import { VaultItem as VaultItemType } from '@/types/vault';
import { copyToClipboard } from '@/utils/clipboard';
import { EncryptionService } from '@/lib/encryption';
import { MasterPasswordContext } from '@/context/MasterPasswordContext';

interface VaultItemProps {
  item: VaultItemType;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function VaultItem({ item, onUpdate, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [decryptedData, setDecryptedData] = useState<{
    username: string;
    password: string;
    url: string;
    notes: string;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { masterPassword } = useContext(MasterPasswordContext);

  const decryptItem = async () => {
    if (!masterPassword || decryptedData) return;
    
    setIsDecrypting(true);
    try {
      const encryptionService = new EncryptionService();
      const data = await encryptionService.decryptVaultItem(
        item.encryptedData,
        masterPassword,
        item.iv,
        item.salt
      );
      setDecryptedData(data);
    } catch (error) {
      console.error('Failed to decrypt item:', error);
      alert('Failed to decrypt item. Check your master password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!decryptedData?.password) {
      await decryptItem();
      return;
    }

    const success = await copyToClipboard(decryptedData.password);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShowPassword = () => {
    if (!decryptedData) {
      decryptItem().then(() => setShowPassword(true));
    } else {
      setShowPassword(!showPassword);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Get the correct ID - handle both ObjectId and string
      let itemId: string;
      
      console.log('=== DELETE DEBUG ===');
      console.log('Original item._id:', item._id);
      console.log('Type of item._id:', typeof item._id);
      
      if (item._id && typeof item._id === 'object') {
        // It's an ObjectId
        itemId = item._id.toString();
      } else if (item._id) {
        // It's already a string
        itemId = item._id as string;
      } else {
        throw new Error('Item ID is missing');
      }
      
      console.log('Final itemId to delete:', itemId);
      console.log('Full item object:', item);
      
      const response = await fetch(`/api/vault/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Delete successful:', result);
        onDelete(); // Refresh the vault list
      } else {
        const errorData = await response.json();
        console.error('Delete failed - full error:', errorData);
        alert(`Failed to delete item: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error during delete:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate">{item.title}</h3>
          
          {/* Username */}
          {decryptedData?.username && (
            <div className="flex items-start sm:items-center text-sm text-gray-600 mb-2">
              <span className="text-gray-500 w-12 sm:w-16 shrink-0 mt-0.5 sm:mt-0">User:</span>
              <span className="font-mono truncate text-xs sm:text-sm">{decryptedData.username}</span>
            </div>
          )}
          
          {/* Password */}
          <div className="flex items-start sm:items-center text-sm text-gray-600 mb-2">
            <span className="text-gray-500 w-12 sm:w-16 shrink-0 mt-0.5 sm:mt-0">Pass:</span>
            <div className="flex items-center flex-1 min-w-0">
              <span className="font-mono text-xs sm:text-sm truncate">
                {decryptedData ? (showPassword ? decryptedData.password : '•'.repeat(8)) : '🔒 Encrypted'}
              </span>
              <button
                onClick={handleShowPassword}
                disabled={isDecrypting}
                className="ml-2 text-gray-400 hover:text-gray-600 text-xs shrink-0 disabled:opacity-50"
              >
                {isDecrypting ? '...' : (decryptedData ? (showPassword ? 'Hide' : 'Show') : 'Decrypt')}
              </button>
            </div>
          </div>

          {/* URL */}
          {decryptedData?.url && (
            <div className="flex items-start sm:items-center text-sm text-gray-600 mb-2">
              <span className="text-gray-500 w-12 sm:w-16 shrink-0 mt-0.5 sm:mt-0">URL:</span>
              <a 
                href={decryptedData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 truncate text-xs sm:text-sm flex-1 min-w-0"
              >
                {decryptedData.url}
              </a>
            </div>
          )}

          {/* Notes */}
          {decryptedData?.notes && (
            <div className="text-sm text-gray-600 mt-2">
              <span className="text-gray-500 text-xs sm:text-sm">Notes: </span>
              <span className="text-xs sm:text-sm">{decryptedData.notes}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start mt-2 sm:mt-0">
          <button
            onClick={handleCopyPassword}
            disabled={isDecrypting}
            className="px-3 py-2 sm:py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors font-medium flex-1 sm:flex-none text-center disabled:opacity-50"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 sm:py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors font-medium flex-1 sm:flex-none text-center disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}