export class EncryptionService {
  private async deriveKey(masterPassword: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(masterPassword),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptVaultItem(data: {
    username: string;
    password: string;
    url: string;
    notes: string;
  }, masterPassword: string): Promise<{ encryptedData: string; iv: string; salt: string }> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(masterPassword, salt);
    
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encodedData
    );
    
    const encryptedData = Buffer.from(encryptedBuffer).toString('base64');
    
    return {
      encryptedData,
      iv: Buffer.from(iv).toString('base64'),
      salt: Buffer.from(salt).toString('base64')
    };
  }

  async decryptVaultItem(
    encryptedData: string, 
    masterPassword: string, 
    iv: string, 
    salt: string
  ): Promise<{ username: string; password: string; url: string; notes: string }> {
    const key = await this.deriveKey(masterPassword, Buffer.from(salt, 'base64'));
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: Buffer.from(iv, 'base64') },
      key,
      Buffer.from(encryptedData, 'base64')
    );
    
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString);
  }

  // Test if master password is correct by trying to decrypt a test value
  async verifyMasterPassword(
    testEncryptedData: string,
    testIv: string,
    testSalt: string,
    masterPassword: string
  ): Promise<boolean> {
    try {
      await this.decryptVaultItem(testEncryptedData, masterPassword, testIv, testSalt);
      return true;
    } catch {
      return false;
    }
  }
}