'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VendingMachine } from '@/types';
import { VendingMachineService } from '@/lib/services/vending-machine.service';

const FEATURED_MACHINES = [
  {
    id: '1',
    name: '新鮮フルーツ自販機',
    type: 'beverage' as const,
    description: '各地で見つかった、珍しいフルーツジュース専門自販機',
    location: {
      latitude: 35.6762,
      longitude: 139.6503,
      address: '東京都渋谷区',
      prefecture: '東京都',
    },
    mainImage: '/placeholder-1.jpg',
    products: [],
    views: 1250,
    favorites: 340,
    imageGallery: [],
    tags: ['fruit', 'juice', 'healthy'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: 'user1',
    rating: 4.5,
  },
  {
    id: '2',
    name: '懐かしお菓子専門機',
    type: 'snack' as const,
    description: '昭和の懐かしいお菓子がずらりと並ぶ自販機',
    location: {
      latitude: 34.6937,
      longitude: 135.5023,
      address: '大阪府梅田',
      prefecture: '大阪府',
    },
    mainImage: '/placeholder-2.jpg',
    products: [],
    views: 980,
    favorites: 250,
    imageGallery: [],
    tags: ['snack', 'retro', 'candy'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: 'user2',
    rating: 4.8,
  },
  {
    id: '3',
    name: '健康食品専門機',
    type: 'combo' as const,
    description: 'プロテインやサラダなど、健康志向の商品が充実',
    location: {
      latitude: 35.0116,
      longitude: 135.7681,
      address: '京都府烏丸',
      prefecture: '京都府',
    },
    mainImage: '/placeholder-3.jpg',
    products: [],
    views: 650,
    favorites: 180,
    imageGallery: [],
    tags: ['health', 'protein', 'diet'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    createdBy: 'user3',
    rating: 4.3,
  },
];

export default function Home() {
  const [recentMachines, setRecentMachines] = useState<VendingMachine[]>(FEATURED_MACHINES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentMachines = async () => {
      setLoading(true);
      try {
        const machines = await VendingMachineService.searchVendingMachines({
          sortBy: 'recent',
          limit: 6,
        });
        if (machines.length > 0) {
          setRecentMachines(machines);
        }
      } catch (error) {
        console.error('Error fetching machines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMachines();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 rounded-lg mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🤖 VendingViewer へようこそ</h2>
          <p className="text-xl mb-6">世界中の自動販売機を写真で探検できるアプリ</p>
          <div className="flex gap-4 justify-center">
            <Link href="/machines" className="btn btn-primary">機械を探す</Link>
            <Link href="/submit" className="btn" style={{ backgroundColor: 'white', color: '#1e3a8a' }}>投稿する</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h3 className="text-3xl font-bold mb-8 text-center">特徴</h3>
        <div className="grid grid-2">
          <div className="card">
            <div className="card-body">
              <h4 className="text-xl font-bold mb-2">📸 写真で確認</h4>
              <p className="text-gray-700">各自動販売機の中身を写真で確認。商品の詳細情報も掲載。</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="text-xl font-bold mb-2">🗺️ 地域検索</h4>
              <p className="text-gray-700">都道府県ごとに機械を検索。あなたの街でどんな機械が？</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="text-xl font-bold mb-2">⭐ レビュー・評価</h4>
              <p className="text-gray-700">ユーザーレビューで、おすすめの機械をチェック。</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h4 className="text-xl font-bold mb-2">❤️ お気に入り登録</h4>
              <p className="text-gray-700">好きな機械をお気に入りに登録して、後から確認。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Machines */}
      <section>
        <h3 className="text-3xl font-bold mb-8">最近投稿された機械</h3>
        {loading ? (
          <div className="text-center py-8"><p className="loading">読み込み中...</p></div>
        ) : (
          <div className="grid grid-2">
            {recentMachines.map((machine) => (
              <Link key={machine.id} href={`/machines/${machine.id}`}>
                <div className="card cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={machine.mainImage || '/placeholder.jpg'}
                      alt={machine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="text-lg font-bold mb-2">{machine.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{machine.location.address}</p>
                    <div className="flex justify-between items-center">
                      <span className="badge badge-primary">{machine.type}</span>
                      <div className="flex gap-2 text-sm">
                        <span>👁️ {machine.views}</span>
                        <span>❤️ {machine.favorites}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
