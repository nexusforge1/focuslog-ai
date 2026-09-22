const API_KEY_STORAGE_KEY = 'focuslog_user_gemini_api_key';

export const apiKeyService = {
  getKey(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },
  
  setKey(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  },
  
  clearKey(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};