'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { VendingMachineType } from '@/types';
import { VendingMachineService } from '@/lib/services/vending-machine.service';
import { UserService } from '@/lib/services/user.service';

const MACHINE_TYPES: { value: VendingMachineType; label: string }[] = [
  { value: 'beverage', label: '飲料' },
  { value: 'snack', label: 'お菓子' },
  { value: 'combo', label: 'コンボ' },
  { value: 'specialty', label: '特種' },
];

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export default function SubmitPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'beverage' as VendingMachineType,
    description: '',
    address: '',
    prefecture: '東京都',
    latitude: '',
    longitude: '',
    manufacturer: '',
    installDate: '',
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const latitude = parseFloat(formData.latitude);
      const longitude = parseFloat(formData.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error('緯度経度が無効です');
      }

      const machineData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        location: {
          latitude,
          longitude,
          address: formData.address,
          prefecture: formData.prefecture,
        },
        products: [],
        manufacturer: formData.manufacturer || undefined,
        installDate: formData.installDate || undefined,
        imageGallery: [],
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
        createdBy: user.uid,
        rating: 0,
      };

      const machineId = await VendingMachineService.createVendingMachine(machineData);

      // ユーザーの投稿機械リストに追加
      const userRef = await UserService.getUser(user.uid);
      if (userRef) {
        await UserService.updateUser(user.uid, {
          ...userRef,
          submittedMachines: [...userRef.submittedMachines, machineId],
        });
      }

      setMessage({ type: 'success', text: '自動販売機を投稿しました！' });
      setFormData({
        name: '',
        type: 'beverage',
        description: '',
        address: '',
        prefecture: '東京都',
        latitude: '',
        longitude: '',
        manufacturer: '',
        installDate: '',
        tags: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `エラー: ${error instanceof Error ? error.message : '不明なエラーが発生しました'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-4xl font-bold mb-8">自動販売機を投稿</h1>

        <div className="max-w-2xl">
          {message && (
            <div className={message.type === 'success' ? 'success' : 'error'}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              {/* Basic Info */}
              <h3 className="text-xl font-bold mb-4">基本情報</h3>

              <div className="form-group">
                <label className="form-label">機械の名前 *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="例: 新鮮フルーツ自販機"
                />
              </div>

              <div className="form-group">
                <label className="form-label">機械タイプ *</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  {MACHINE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">説明 *</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="この自動販売機について説明してください"
                />
              </div>

              {/* Location Info */}
              <h3 className="text-xl font-bold mb-4 mt-8">場所情報</h3>

              <div className="form-group">
                <label className="form-label">都道府県 *</label>
                <select
                  name="prefecture"
                  className="form-select"
                  value={formData.prefecture}
                  onChange={handleInputChange}
                  required
                >
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">住所 *</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="例: 東京都渋谷区神宮前1-1-1"
                />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">緯度 *</label>
                  <input
                    type="number"
                    step="0.000001"
                    name="latitude"
                    className="form-input"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    placeholder="例: 35.6762"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">経度 *</label>
                  <input
                    type="number"
                    step="0.000001"
                    name="longitude"
                    className="form-input"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    placeholder="例: 139.6503"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <h3 className="text-xl font-bold mb-4 mt-8">追加情報（オプション）</h3>

              <div className="form-group">
                <label className="form-label">製造者</label>
                <input
                  type="text"
                  name="manufacturer"
                  className="form-input"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="例: FruitMachine Co."
                />
              </div>

              <div className="form-group">
                <label className="form-label">設置日</label>
                <input
                  type="date"
                  name="installDate"
                  className="form-input"
                  value={formData.installDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">タグ（カンマ区切り）</label>
                <input
                  type="text"
                  name="tags"
                  className="form-input"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="例: fruit, juice, healthy"
                />
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '0.75rem' }}
                >
                  {loading ? '投稿中...' : '投稿する'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
