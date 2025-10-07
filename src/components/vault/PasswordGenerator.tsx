'use client';

import { useState, useEffect } from 'react';
import { PasswordOptions } from '@/utils/passwordGenerator';
import { copyToClipboard } from '@/utils/clipboard';

const defaultOptions: PasswordOptions = {
  length: 16,
  includeNumbers: true,
  includeLetters: true,
  includeSymbols: true,
  excludeLookAlikes: true,
};

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions);
  const [password, setPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generateNewPassword = async () => {
    try {
      const response = await fetch('/api/password/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });

      if (response.ok) {
        const data = await response.json();
        setPassword(data.password);
        onPasswordGenerated?.(data.password);
      }
    } catch (error) {
      console.error('Failed to generate password:', error);
    }
  };

  const handleCopy = async () => {
    if (password) {
      const success = await copyToClipboard(password);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    generateNewPassword();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Generator</h3>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
            placeholder="Generated password will appear here"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={generateNewPassword}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Length: {options.length}
          </label>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Checkbox Options */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Numbers</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeLetters}
              onChange={(e) => handleOptionChange('includeLetters', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Letters</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Symbols</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.excludeLookAlikes}
              onChange={(e) => handleOptionChange('excludeLookAlikes', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Exclude Look-alikes</span>
          </label>
        </div>
      </div>
    </div>
  );
}