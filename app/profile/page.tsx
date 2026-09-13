'use client';

import { useState } from 'react';
import Link from 'next/link';

const SAMPLE_USER = {
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'VendingFan太郎',
  profileImage: '/placeholder-profile.jpg',
  bio: '自動販売機マニアです。日本中の珍しい自販機を探しています。',
  favorites: ['1', '2', '3'],
  submittedMachines: ['4', '5'],
  role: 'user' as const,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(SAMPLE_USER);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">プロフィール</h1>

      <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <div className="card">
            <div className="card-body text-center">
              <img
                src={user.profileImage}
                alt={user.displayName}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold mb-2">{user.displayName}</h2>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <p className="text-gray-700 text-sm mb-4">{user.bio}</p>
              <button
                onClick={handleEditToggle}
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
                    className="form-input"
                    defaultValue={user.displayName}
                    placeholder="表示名を入力"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">自己紹介</label>
                  <textarea
                    className="form-textarea"
                    defaultValue={user.bio}
                    placeholder="自己紹介を入力"
                  />
                </div>
                <button className="btn btn-primary">変更を保存</button>
              </div>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-2 mb-8">
                <div className="card">
                  <div className="card-body text-center">
                    <p className="text-gray-600 mb-2">投稿した機械</p>
                    <p className="text-4xl font-bold text-blue-600">{user.submittedMachines.length}</p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body text-center">
                    <p className="text-gray-600 mb-2">お気に入り</p>
                    <p className="text-4xl font-bold text-red-600">{user.favorites.length}</p>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">投稿した機械</h3>
                {user.submittedMachines.length > 0 ? (
                  <div className="grid grid-2">
                    {user.submittedMachines.map((id) => (
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

              <div>
                <h3 className="text-2xl font-bold mb-4">お気に入り</h3>
                {user.favorites.length > 0 ? (
                  <div className="grid grid-2">
                    {user.favorites.map((id) => (
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
    </div>
  );
}
