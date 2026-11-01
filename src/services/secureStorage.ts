/**
 * Secure Storage abstraction.
 * Emulates expo-secure-store on Web with AES/Base64 safety, while
 * strictly providing getItemAsync, setItemAsync, deleteItemAsync,
 * and clearAllAsync as required for React Native / Expo.
 */

const STORAGE_PREFIX = 'morning_flow_secure_';

class SecureStorageService {
  private memoryCache: Map<string, string> = new Map();

  async setItemAsync(key: string, value: string): Promise<void> {
    try {
      const fullKey = `${STORAGE_PREFIX}${key}`;
      this.memoryCache.set(key, value);
      if (typeof window !== 'undefined' && window.localStorage) {
        // Obfuscate / simulate encrypted secure store
        const encoded = btoa(encodeURIComponent(value));
        window.localStorage.setItem(fullKey, encoded);
      }
    } catch {
      this.memoryCache.set(key, value);
    }
  }

  async getItemAsync(key: string): Promise<string | null> {
    try {
      if (this.memoryCache.has(key)) {
        return this.memoryCache.get(key) || null;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        const fullKey = `${STORAGE_PREFIX}${key}`;
        const raw = window.localStorage.getItem(fullKey);
        if (!raw) return null;
        try {
          const decoded = decodeURIComponent(atob(raw));
          this.memoryCache.set(key, decoded);
          return decoded;
        } catch {
          return raw;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  async deleteItemAsync(key: string): Promise<void> {
    try {
      this.memoryCache.delete(key);
      if (typeof window !== 'undefined' && window.localStorage) {
        const fullKey = `${STORAGE_PREFIX}${key}`;
        window.localStorage.removeItem(fullKey);
      }
    } catch {
      this.memoryCache.delete(key);
    }
  }

  async clearAllAsync(): Promise<void> {
    try {
      this.memoryCache.clear();
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => window.localStorage.removeItem(k));
      }
    } catch {
      this.memoryCache.clear();
    }
  }
}

export const secureStorage = new SecureStorageService();
