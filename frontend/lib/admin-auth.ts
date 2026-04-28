'use client';

const TOKEN_KEY = 'fm_admin_token';

export const adminAuth = {
  getToken: () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)),
  setToken: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
  },
};
