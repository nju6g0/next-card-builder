/**
 * 工具函式集合
 */

/**
 * 生成 placeholder 圖片 URL
 * @param width - 寬度
 * @param height - 高度
 * @param text - 顯示文字
 * @param bgColor - 背景顏色（hex，不含 #）
 * @param textColor - 文字顏色（hex，不含 #）
 */
export function generatePlaceholder(
  width: number,
  height: number,
  text?: string,
  bgColor: string = 'cccccc',
  textColor: string = '333333'
): string {
  const displayText = text || `${width}x${height}`;
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(displayText)}`;
}

/**
 * 格式化日期時間
 * @param dateString - ISO 8601 日期字串
 * @param format - 格式類型
 */
export function formatDate(dateString: string, format: 'full' | 'date' | 'time' | 'relative' = 'full'): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '無效日期';
  }

  switch (format) {
    case 'full':
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    
    case 'date':
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    
    case 'time':
      return date.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
      });
    
    case 'relative':
      return getRelativeTime(date);
    
    default:
      return date.toLocaleString('zh-TW');
  }
}

/**
 * 獲取相對時間（例如：3 分鐘前、2 小時前）
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return '剛剛';
  } else if (diffMin < 60) {
    return `${diffMin} 分鐘前`;
  } else if (diffHour < 24) {
    return `${diffHour} 小時前`;
  } else if (diffDay < 30) {
    return `${diffDay} 天前`;
  } else {
    return formatDate(date.toISOString(), 'date');
  }
}

/**
 * 截斷文字並加入省略號
 * @param text - 原始文字
 * @param maxLength - 最大長度
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * 分類名稱轉換為顯示名稱
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 延遲執行（用於 debounce 等）
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce 函式
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 複製文字到剪貼簿
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 生成隨機顏色
 */
export function randomColor(): string {
  const colors = [
    '#6366f1', // primary
    '#8b5cf6', // secondary
    '#ec4899', // accent
    '#10b981', // success
    '#f59e0b', // warning
    '#3b82f6', // info
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 檢查是否為有效的 URL
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
