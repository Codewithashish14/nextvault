export interface VaultItem {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EncryptedVaultItem {
  _id?: string;
  title: string;
  encryptedData: string;
  iv: string;
  salt: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
}