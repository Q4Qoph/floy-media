'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLogin } from '@/lib/hooks';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const [email, setEmail] = useState('admin@floymedia.com');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await loginMutation.mutateAsync({ email, password });
    adminAuth.setToken(result.token);
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage FloyMedia content.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white rounded-lg py-3 font-semibold"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
          {loginMutation.isError ? <p className="text-sm text-red-600">Login failed. Check credentials.</p> : null}
        </form>
      </div>
    </div>
  );
}
