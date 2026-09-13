'use client';

import { AuthProvider } from '@/lib/auth-context';
import { NavBar } from '@/components/navbar';
import type { Metadata } from 'next';
import './globals.css';

const metadata: Metadata = {
  title: '自動販売機コンテンツ閲覧アプリ',
  description: '様々な自動販売機の中身を写真で確認できるアプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
              {children}
            </main>
            <footer className="bg-gray-800 text-white text-center py-6 mt-12">
              <p>&copy; 2026 VendingViewer. All rights reserved.</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
