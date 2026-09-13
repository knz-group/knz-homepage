'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      // バリデーション
      if (!formData.displayName || !formData.email || !formData.password) {
        throw new Error('すべてのフィールドを入力してください');
      }

      if (formData.password.length < 6) {
        throw new Error('パスワードは6文字以上である必要があります');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('パスワードが一致しません');
      }

      await signUp(formData.email, formData.password, formData.displayName);
      router.push('/machines');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-6 text-center">アカウント登録</h1>

          {displayError && <div className="error">{displayError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">表示名</label>
              <input
                type="text"
                name="displayName"
                className="form-input"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="山田太郎"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">メールアドレス</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">パスワード</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">パスワード確認</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            すでにアカウントをお持ちですか？{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              ログインする
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
