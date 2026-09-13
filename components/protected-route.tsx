'use client';

import { useAuth } from '@/lib/auth-context';
import { ReactNode } from 'react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="loading" style={{ fontSize: '2rem' }}>読み込み中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card max-w-md mx-auto mt-8">
        <div className="card-body text-center">
          <h2 className="text-2xl font-bold mb-4">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">このページを表示するには、ログインしてください。</p>
          <div className="flex gap-4">
            <Link href="/auth/login" className="btn btn-primary flex-1">
              ログイン
            </Link>
            <Link href="/auth/signup" className="btn btn-secondary flex-1">
              登録
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
