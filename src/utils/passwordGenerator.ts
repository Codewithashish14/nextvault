export interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeLetters: boolean;
  includeSymbols: boolean;
  excludeLookAlikes: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const {
    length,
    includeNumbers,
    includeLetters,
    includeSymbols,
    excludeLookAlikes
  } = options;

  const numbers = '0123456789';
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const lookAlikes = '0OIl1';
  
  let characterPool = '';
  
  if (includeNumbers) characterPool += numbers;
  if (includeLetters) characterPool += letters;
  if (includeSymbols) characterPool += symbols;
  
  if (excludeLookAlikes && includeLetters) {
    characterPool = characterPool.split('').filter(char => 
      !lookAlikes.includes(char)
    ).join('');
  }
  
  if (characterPool.length === 0) {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  const poolLength = characterPool.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * poolLength);
    password += characterPool[randomIndex];
  }
  
  return password;
}