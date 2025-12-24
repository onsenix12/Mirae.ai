'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/utils/storage';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple validation
    if (!email || !password || !name) {
      setError('모든 필드를 입력해주세요.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    // Store user in localStorage
    const userData = {
      email,
      name,
      loggedInAt: new Date().toISOString(),
    };

    storage.set('user', userData);
    storage.set('isAuthenticated', 'true');
    
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">SCOPE+</h1>
        <p className="text-gray-600 text-center mb-8">
          새로운 여정을 시작하세요
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium mb-2">
              이메일
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              required
              minLength={6}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          이미 계정이 있나요?{' '}
          <a href="/login" className="text-purple-600 hover:underline">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}

