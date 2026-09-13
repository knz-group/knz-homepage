import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">🤖 VendingViewer</h1>
              <ul className="flex gap-6">
                <li><a href="/" className="text-gray-700 hover:text-blue-600">ホーム</a></li>
                <li><a href="/machines" className="text-gray-700 hover:text-blue-600">一覧</a></li>
                <li><a href="/submit" className="text-gray-700 hover:text-blue-600">投稿</a></li>
                <li><a href="/profile" className="text-gray-700 hover:text-blue-600">プロフィール</a></li>
              </ul>
            </nav>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-800 text-white text-center py-6 mt-12">
            <p>&copy; 2026 VendingViewer. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
