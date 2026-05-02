'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLogin } from '@/lib/hooks';
import { adminAuth } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await loginMutation.mutateAsync({ email, password });
    adminAuth.setSession(result.token, result.admin.role);
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
            <p className="text-sm text-gray-600">Sign in to manage FloyMedia content and settings.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@floymedia.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/admin/forgot-password" className="text-xs font-medium text-[#045be2] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none transition bg-gray-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white rounded-lg py-3 font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </button>

            {loginMutation.isError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Login failed</p>
                <p className="text-xs text-red-600 mt-1">Please check your credentials and try again.</p>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-xs text-gray-500">
          FloyMedia Admin Dashboard • {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
