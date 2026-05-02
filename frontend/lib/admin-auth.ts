'use client';

const TOKEN_KEY = 'fm_admin_token';
const ROLE_KEY = 'fm_admin_role';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export const adminAuth = {
  getToken: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  getRole: (): AdminRole | null =>
    typeof window === 'undefined' ? null : (localStorage.getItem(ROLE_KEY) as AdminRole | null),
  setSession: (token: string, role: AdminRole) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};

export const canManageAdminUsers = (role: AdminRole | null) => role === 'SUPER_ADMIN' || role === 'ADMIN';
