/**
 * 驗證工具函式
 */

/**
 * 驗證 email 格式
 * @param email - 要驗證的 email
 * @returns 是否為有效的 email
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  // 簡單的 email 正則表達式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * 驗證 email 並返回錯誤訊息
 * @param email - 要驗證的 email
 * @returns 錯誤訊息，無錯誤時返回 null
 */
export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return 'Email 不能為空';
  }
  
  if (!isValidEmail(email)) {
    return '請輸入有效的 Email 格式';
  }
  
  return null;
}

/**
 * 標準化 email（轉小寫並去除空白）
 * @param email - 要標準化的 email
 * @returns 標準化後的 email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
