'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { UserService } from '@/lib/services/user.service';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@/types';

const SAMPLE_USER: User = {
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'VendingFan太郎',
  profileImage: '/placeholder-profile.jpg',
  bio: '自動販売機マニアです。日本中の珍しい自販機を探しています。',
  favorites: ['1', '2', '3'],
  submittedMachines: ['4', '5'],
  role: 'user',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const userData = await UserService.getUser(user.uid);
          if (userData) {
            setProfileData(userData);
            setEditData({
              displayName: userData.displayName,
              bio: userData.bio || '',
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserData();
  }, [user]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !profileData) return;

    try {
      setLoading(true);
      await UserService.updateUser(user.uid, {
        ...profileData,
        displayName: editData.displayName,
        bio: editData.bio,
      });
      setProfileData({
        ...profileData,
        displayName: editData.displayName,
        bio: editData.bio,
      });
      setIsEditing(false);
      setMessage({ type: 'success', text: 'プロフィールを更新しました' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `エラー: ${error instanceof Error ? error.message : '更新に失敗しました'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-4xl font-bold mb-8">プロフィール</h1>

        {message && (
          <div className={message.type === 'success' ? 'success' : 'error'}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="loading" style={{ fontSize: '2rem' }}>読み込み中...</p>
          </div>
        ) : profileData ? (
          <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
            {/* Sidebar */}
            <div>
              <div className="card">
                <div className="card-body text-center">
                  <img
                    src={profileData.profileImage || '/placeholder-profile.jpg'}
                    alt={profileData.displayName}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h2 className="text-2xl font-bold mb-2">{profileData.displayName}</h2>
                  <p className="text-gray-600 mb-4 text-sm break-all">{profileData.email}</p>
                  <p className="text-gray-700 text-sm mb-4">{profileData.bio}</p>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isEditing ? 'キャンセル' : 'プロフィール編集'}
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div>
              {isEditing ? (
                <div className="card">
                  <div className="card-body">
                    <h3 className="text-xl font-bold mb-4">プロフィール編集</h3>
                    <div className="form-group">
                      <label className="form-label">表示名</label>
                      <input
                        type="text"
                        name="displayName"
                        className="form-input"
                        value={editData.displayName}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">自己紹介</label>
                      <textarea
                        name="bio"
                        className="form-textarea"
                        value={editData.bio}
                        onChange={handleEditChange}
                        placeholder="自己紹介を入力"
                      />
                    </div>
                    <button
                      onClick={handleSaveProfile}
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? '保存中...' : '変更を保存'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Statistics */}
                  <div className="grid grid-2 mb-8">
                    <div className="card">
                      <div className="card-body text-center">
                        <p className="text-gray-600 mb-2">投稿した機械</p>
                        <p className="text-4xl font-bold text-blue-600">
                          {profileData.submittedMachines.length}
                        </p>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-body text-center">
                        <p className="text-gray-600 mb-2">お気に入り</p>
                        <p className="text-4xl font-bold text-red-600">
                          {profileData.favorites.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submitted Machines */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4">投稿した機械</h3>
                    {profileData.submittedMachines.length > 0 ? (
                      <div className="grid grid-2">
                        {profileData.submittedMachines.map((id) => (
                          <Link key={id} href={`/machines/${id}`}>
                            <div className="card cursor-pointer hover:shadow-lg transition-shadow">
                              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-500">
                                画像
                              </div>
                              <div className="card-body">
                                <p className="font-bold">機械 #{id}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">投稿した機械はまだありません。</p>
                    )}
                  </div>

                  {/* Favorites */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4">お気に入り</h3>
                    {profileData.favorites.length > 0 ? (
                      <div className="grid grid-2">
                        {profileData.favorites.map((id) => (
                          <Link key={id} href={`/machines/${id}`}>
                            <div className="card cursor-pointer hover:shadow-lg transition-shadow">
                              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-500">
                                画像
                              </div>
                              <div className="card-body">
                                <p className="font-bold">機械 #{id}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">お気に入りの機械はまだありません。</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="error">ユーザー情報を読み込めませんでした。</div>
        )}
      </div>
    </ProtectedRoute>
  );
}
