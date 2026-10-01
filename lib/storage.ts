/**
 * LocalStorage 工具函式
 * 提供多使用者資料隔離功能，以 email 為 key 前綴區分不同使用者
 */

/**
 * 生成使用者專屬的 storage key
 * @param email - 使用者 email
 * @param key - 資料 key
 * @returns 完整的 storage key
 */
export function getUserKey(email: string, key: string): string {
  return `user:${email}:${key}`;
}

/**
 * 獲取使用者專屬資料
 * @param email - 使用者 email
 * @param key - 資料 key
 * @returns 解析後的資料，不存在時返回 null
 */
export function getUserData<T>(email: string, key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storageKey = getUserKey(email, key);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * 設定使用者專屬資料
 * @param email - 使用者 email
 * @param key - 資料 key
 * @param data - 要儲存的資料
 */
export function setUserData<T>(email: string, key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = getUserKey(email, key);
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

/**
 * 刪除使用者專屬資料
 * @param email - 使用者 email
 * @param key - 資料 key
 */
export function removeUserData(email: string, key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = getUserKey(email, key);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

/**
 * 獲取全域資料（不區分使用者）
 * @param key - 資料 key
 * @returns 解析後的資料，不存在時返回 null
 */
export function getGlobalData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading global data from localStorage:', error);
    return null;
  }
}

/**
 * 設定全域資料（不區分使用者）
 * @param key - 資料 key
 * @param data - 要儲存的資料
 */
export function setGlobalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing global data to localStorage:', error);
  }
}

/**
 * 刪除全域資料
 * @param key - 資料 key
 */
export function removeGlobalData(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing global data from localStorage:', error);
  }
}

/**
 * 清除所有使用者資料（保留當前使用者 email）
 * @param email - 當前使用者 email
 */
export function clearUserData(email: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const keysToRemove: string[] = [];
    const prefix = `user:${email}:`;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error);
  }
}
