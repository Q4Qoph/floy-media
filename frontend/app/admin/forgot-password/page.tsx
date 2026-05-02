'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminForgotPassword } from '@/lib/hooks';

export default function AdminForgotPasswordPage() {
  const mutation = useAdminForgotPassword();
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync(email);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset password</h1>
            <p className="text-sm text-gray-600">
              Enter your admin email. If it is registered, we will send a link to set a new password.
            </p>
          </div>

          {done ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              If that email is registered, check your inbox for the reset link. You can close this tab or return to
              login.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#045be2] focus:border-transparent outline-none bg-gray-50"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#045be2] hover:bg-[#034dc2] text-white rounded-lg py-3 font-semibold transition disabled:opacity-50"
              >
                {mutation.isPending ? 'Sending…' : 'Send reset link'}
              </button>
              {mutation.isError && (
                <p className="text-sm text-red-600">Something went wrong. Try again later.</p>
              )}
            </form>
          )}

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
