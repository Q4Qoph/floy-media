'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAdminResetPassword } from '@/lib/hooks';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const mutation = useAdminResetPassword();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    await mutation.mutateAsync({ token, password });
    router.replace('/admin/login');
  };

  if (!token) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Missing reset token. Open the link from your email, or request a new reset from{' '}
        <Link href="/admin/forgot-password" className="font-medium underline">
          forgot password
        </Link>
        .
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none bg-gray-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
        <input
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none bg-gray-50"
        />
      </div>
      {password && confirm && password !== confirm && (
        <p className="text-sm text-red-600">Passwords do not match.</p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending || password !== confirm || password.length < 6}
        className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white rounded-lg py-3 font-semibold transition disabled:opacity-50"
      >
        {mutation.isPending ? 'Saving…' : 'Save password'}
      </button>
      {mutation.isError && (
        <p className="text-sm text-red-600">This link may be invalid or expired. Request a new one from login.</p>
      )}
    </form>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose a new password</h1>
            <p className="text-sm text-gray-600">Use at least 6 characters.</p>
          </div>
          <Suspense fallback={<p className="text-sm text-gray-500">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
          <p className="mt-6 text-center text-sm">
            <Link href="/admin/login" className="text-[#045be2] font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
