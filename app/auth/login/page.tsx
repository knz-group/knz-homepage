'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      if (!formData.email || !formData.password) {
        throw new Error('メールアドレスとパスワードを入力してください');
      }

      await signIn(formData.email, formData.password);
      const redirectTo = searchParams.get('from') || '/machines';
      router.push(redirectTo);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="card">
        <div className="card-body">
          <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>

          {displayError && <div className="error">{displayError}</div>}

          <form onSubmit={handleSubmit}>
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

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600">
            アカウントをお持ちでないですか？{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              登録する
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
