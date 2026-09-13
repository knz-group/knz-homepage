'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VendingMachine } from '@/types';
import { VendingMachineService } from '@/lib/services/vending-machine.service';

const SAMPLE_MACHINE: VendingMachine = {
  id: '1',
  name: '新鮮フルーツ自販機',
  type: 'beverage',
  description: '各地で見つかった、珍しいフルーツジュース専門自販機。新鮮なフルーツを使用した100%ジュースが充実。',
  location: {
    latitude: 35.6762,
    longitude: 139.6503,
    address: '東京都渋谷区神宮前1-1-1',
    prefecture: '東京都',
  },
  mainImage: '/placeholder-1.jpg',
  products: [
    {
      id: 'p1',
      name: 'オレンジジュース100%',
      category: 'ジュース',
      price: 200,
      position: 'A-1',
      description: '新鮮なオレンジを使用',
    },
    {
      id: 'p2',
      name: 'アップルジュース',
      category: 'ジュース',
      price: 200,
      position: 'A-2',
    },
    {
      id: 'p3',
      name: 'ぶどうジュース',
      category: 'ジュース',
      price: 250,
      position: 'B-1',
    },
  ],
  manufacturer: 'FruitMachine Co.',
  installDate: '2024-01-15',
  views: 1250,
  favorites: 340,
  imageGallery: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
  tags: ['fruit', 'juice', 'healthy'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  createdBy: 'user1',
  rating: 4.5,
};

export default function MachineDetailPage() {
  const params = useParams();
  const machineId = params.id as string;
  const [machine, setMachine] = useState<VendingMachine | null>(SAMPLE_MACHINE);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMachine = async () => {
      setLoading(true);
      try {
        const machineData = await VendingMachineService.getVendingMachine(machineId);
        if (machineData) {
          setMachine(machineData);
        }
      } catch (error) {
        console.error('Error fetching machine:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [machineId]);

  if (loading) {
    return <div className="text-center py-12"><p className="loading" style={{ fontSize: '2rem' }}>読み込み中...</p></div>;
  }

  if (!machine) {
    return <div className="error">機械が見つかりません。</div>;
  }

  const images = machine.imageGallery.length > 0 ? machine.imageGallery : [machine.mainImage];
  const currentImage = images[selectedImage];

  return (
    <div>
      <div className="mb-6">
        <a href="/machines" className="text-blue-600 hover:underline">← 一覧に戻る</a>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Image Section */}
        <div>
          <div className="card mb-4">
            <img
              src={currentImage}
              alt={machine.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="image-gallery">
              {images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Gallery ${idx}`}
                  className={`image-thumbnail cursor-pointer border-2 ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{machine.name}</h1>
                  <div className="flex gap-2 mb-3">
                    <span className="badge badge-primary">{machine.type}</span>
                    <span className="badge badge-success">{machine.location.prefecture}</span>
                  </div>
                </div>
                <button
                  className="btn" 
                  style={{ backgroundColor: isFavorite ? '#ef4444' : '#ccc' }}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? '❤️ お気に入り済み' : '🤍 お気に入り'}
                </button>
              </div>
              <p className="text-gray-700 mb-4">{machine.description}</p>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <p className="text-sm text-gray-600">📍 住所</p>
                  <p className="font-semibold">{machine.location.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">🏭 製造者</p>
                  <p className="font-semibold">{machine.manufacturer || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">📅 設置日</p>
                  <p className="font-semibold">{machine.installDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">⭐ 評価</p>
                  <p className="font-semibold">{machine.rating.toFixed(1)} / 5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="card">
              <div className="card-body text-center">
                <p className="text-gray-600 mb-2">閲覧数</p>
                <p className="text-2xl font-bold">👁️ {machine.views}</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <p className="text-gray-600 mb-2">お気に入り</p>
                <p className="text-2xl font-bold">❤️ {machine.favorites}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">商品一覧</h2>
        <div className="grid grid-2">
          {machine.products.map((product) => (
            <div key={product.id} className="card">
              <div className="card-body">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">¥{product.price}</span>
                  <span className="badge badge-primary">{product.position}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
