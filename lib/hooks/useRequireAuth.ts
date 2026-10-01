'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

/**
 * 路由守衛 Hook
 * 確保使用者已登入，未登入時自動導向登入頁
 * @returns 當前使用者 email
 */
export function useRequireAuth() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      router.push('/login');
    }
  }, [isAuthenticated, currentUser, router]);

  return currentUser;
}
