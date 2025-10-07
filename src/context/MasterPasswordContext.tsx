'use client';

import { createContext, useState, ReactNode, useContext } from 'react';

interface MasterPasswordContextType {
  masterPassword: string;
  setMasterPassword: (password: string) => void;
  clearMasterPassword: () => void;
}

export const MasterPasswordContext = createContext<MasterPasswordContextType>({
  masterPassword: '',
  setMasterPassword: () => {},
  clearMasterPassword: () => {},
});

export const useMasterPassword = () => useContext(MasterPasswordContext);

interface MasterPasswordProviderProps {
  children: ReactNode;
}

export function MasterPasswordProvider({ children }: MasterPasswordProviderProps) {
  const [masterPassword, setMasterPassword] = useState('');

  const clearMasterPassword = () => {
    setMasterPassword('');
  };

  return (
    <MasterPasswordContext.Provider value={{ masterPassword, setMasterPassword, clearMasterPassword }}>
      {children}
    </MasterPasswordContext.Provider>
  );
}