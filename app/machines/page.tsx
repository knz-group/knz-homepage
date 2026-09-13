'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { VendingMachine, SearchFilters, VendingMachineType } from '@/types';
import { VendingMachineService } from '@/lib/services/vending-machine.service';

const PREFECTURES = [
  '全国', '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

const MACHINE_TYPES: { value: VendingMachineType; label: string }[] = [
  { value: 'beverage', label: '飲料' },
  { value: 'snack', label: 'お菓子' },
  { value: 'combo', label: 'コンボ' },
  { value: 'specialty', label: '特種' },
];

export default function MachinesPage() {
  const [machines, setMachines] = useState<VendingMachine[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'recent',
    limit: 12,
  });

  useEffect(() => {
    fetchMachines();
  }, [filters]);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const results = await VendingMachineService.searchVendingMachines(filters);
      setMachines(results);
    } catch (error) {
      console.error('Error fetching machines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset pagination
    }));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">自動販売機一覧</h1>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar - Filters */}
        <aside className="card">
          <div className="card-body">
            <h3 className="text-lg font-bold mb-4">フィルター</h3>

            {/* Prefecture Filter */}
            <div className="form-group">
              <label className="form-label">都道府県</label>
              <select
                className="form-select"
                value={filters.prefecture || ''}
                onChange={(e) => handleFilterChange('prefecture', e.target.value || undefined)}
              >
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref === '全国' ? '' : pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="form-group">
              <label className="form-label">機械種別</label>
              <select
                className="form-select"
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
              >
                <option value="">すべて</option>
                {MACHINE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="form-group">
              <label className="form-label">並べ順</label>
              <select
                className="form-select"
                value={filters.sortBy || 'recent'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
              >
                <option value="recent">最新順</option>
                <option value="popular">人気順</option>
                <option value="rating">評価順</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className="text-center py-12">
              <p className="loading" style={{ fontSize: '2rem' }}>読み込み中...</p>
            </div>
          ) : machines.length > 0 ? (
            <div className="grid grid-2">
              {machines.map((machine) => (
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
                      <h3 className="text-lg font-bold mb-2">{machine.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{machine.location.address}</p>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {machine.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="badge badge-primary text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>⭐ {machine.rating.toFixed(1)}</span>
                        <div className="flex gap-2">
                          <span>👁️ {machine.views}</span>
                          <span>❤️ {machine.favorites}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">条件に合う機械が見つかりません。</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
