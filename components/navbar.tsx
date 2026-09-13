'use client';

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { useState } from 'react';

export function NavBar() {
  const { user, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🤖 VendingViewer
        </Link>

        <ul className="flex gap-6 items-center">
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              ホーム
            </Link>
          </li>
          <li>
            <Link href="/machines" className="text-gray-700 hover:text-blue-600">
              一覧
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/submit" className="text-gray-700 hover:text-blue-600">
                投稿
              </Link>
            </li>
          )}
          {loading ? (
            <li className="loading">...</li>
          ) : user ? (
            <>
              <li>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  👤 {user.email}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="btn btn-secondary"
                >
                  ログアウト
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/login" className="btn btn-primary">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="btn btn-secondary">
                  登録
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
