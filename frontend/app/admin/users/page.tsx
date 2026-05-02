'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { adminAuth, canManageAdminUsers } from '@/lib/admin-auth';
import { adminApi, type AdminInvitePayload, type AdminRoleDto, type AdminUserRow } from '@/lib/api';
import {
  useAdminDeleteUser,
  useAdminInviteUser,
  useAdminUpdateUser,
  useAdminUsers,
} from '@/lib/hooks';

const ROLE_OPTIONS: { value: AdminRoleDto; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'VIEWER', label: 'Viewer (read-only)' },
];

function errMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message;
  }
  return 'Request failed';
}

export default function AdminUsersPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const token = useMemo(() => adminAuth.getToken(), []);
  const [myRole, setMyRole] = useState<AdminRoleDto | null>(null);
  const [roleReady, setRoleReady] = useState(false);

  useEffect(() => {
    const t = adminAuth.getToken();
    if (!t) {
      setRoleReady(true);
      return;
    }
    const cached = adminAuth.getRole();
    if (cached) {
      setMyRole(cached);
      setRoleReady(true);
      return;
    }
    adminApi
      .profile(t)
      .then((p) => {
        adminAuth.setSession(t, p.role);
        setMyRole(p.role);
      })
      .catch(() => {})
      .finally(() => setRoleReady(true));
  }, []);

  const { data: users, isLoading, error } = useAdminUsers(canManageAdminUsers(myRole) ? token : null);
  const inviteMutation = useAdminInviteUser(token);
  const updateMutation = useAdminUpdateUser(token);
  const deleteMutation = useAdminDeleteUser(token);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite] = useState<AdminInvitePayload>({
    email: '',
    fullName: '',
    role: 'EDITOR',
  });
  const [inviteErr, setInviteErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, { role: AdminRoleDto; fullName: string }>>({});
  const [rowErr, setRowErr] = useState<string | null>(null);

  if (!roleReady) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">Loading…</div>
    );
  }

  if (!canManageAdminUsers(myRole)) {
    return (
      <div className="max-w-lg rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">You do not have access to user management.</p>
        <button
          type="button"
          className="mt-4 text-sm font-semibold text-[#045be2] hover:underline"
          onClick={() => router.push('/admin/dashboard')}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const startEdit = (u: AdminUserRow) => {
    setEditing((prev) => ({
      ...prev,
      [u.id]: { role: u.role, fullName: u.fullName ?? '' },
    }));
  };

  const saveEdit = async (id: string) => {
    setRowErr(null);
    const patch = editing[id];
    if (!patch) return;
    try {
      await updateMutation.mutateAsync({
        id,
        payload: { role: patch.role, fullName: patch.fullName || null },
      });
      setEditing(({ [id]: _removed, ...rest }) => rest);
      await qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (e) {
      setRowErr(errMessage(e));
    }
  };

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteErr(null);
    try {
      await inviteMutation.mutateAsync({
        email: invite.email.trim(),
        fullName: invite.fullName?.trim() || undefined,
        role: invite.role,
      });
      setInviteOpen(false);
      setInvite({ email: '', fullName: '', role: 'EDITOR' });
      await qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (e) {
      setInviteErr(errMessage(e));
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this admin user? This cannot be undone.')) return;
    setRowErr(null);
    try {
      await deleteMutation.mutateAsync(id);
      await qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (e) {
      setRowErr(errMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin users</h1>
          <p className="text-sm text-gray-600 mt-1">
            Invite users by email; they receive a link to set their password. Roles control access across the admin
            portal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="rounded-lg bg-[#045be2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#034dc2]"
        >
          Invite user
        </button>
      </div>

      {rowErr && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{rowErr}</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load users.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {users?.map((u) => {
              const edit = editing[u.id];
              const isSuperRow = u.role === 'SUPER_ADMIN';
              const canEditRow = myRole === 'SUPER_ADMIN' || (myRole === 'ADMIN' && !isSuperRow);
              const showDelete = myRole === 'SUPER_ADMIN';

              return (
                <tr key={u.id} className="text-gray-900">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    {edit ? (
                      <input
                        className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                        value={edit.fullName}
                        onChange={(e) =>
                          setEditing((prev) => ({ ...prev, [u.id]: { ...prev[u.id]!, fullName: e.target.value } }))
                        }
                      />
                    ) : (
                      u.fullName || '—'
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {edit ? (
                      <select
                        className="rounded border border-gray-200 px-2 py-1 text-sm"
                        value={edit.role}
                        onChange={(e) =>
                          setEditing((prev) => ({
                            ...prev,
                            [u.id]: { ...prev[u.id]!, role: e.target.value as AdminRoleDto },
                          }))
                        }
                      >
                        {ROLE_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="capitalize">{u.role.replace('_', ' ').toLowerCase()}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {canEditRow &&
                      (edit ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-xs font-semibold text-[#045be2]"
                            onClick={() => saveEdit(u.id)}
                            disabled={updateMutation.isPending}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="text-xs text-gray-600"
                            onClick={() => setEditing(({ [u.id]: _r, ...rest }) => rest)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-xs font-semibold text-[#045be2]"
                          onClick={() => startEdit(u)}
                        >
                          Edit
                        </button>
                      ))}
                    {showDelete && (
                      <button
                        type="button"
                        className="ml-3 text-xs font-semibold text-red-600"
                        onClick={() => onDelete(u.id)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">Invite admin</h2>
            <p className="mt-1 text-sm text-gray-600">We will email them a link to set their password.</p>
            <form onSubmit={onInvite} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Email</label>
                <input
                  required
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={invite.email}
                  onChange={(e) => setInvite((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Display name (optional)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={invite.fullName}
                  onChange={(e) => setInvite((p) => ({ ...p, fullName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Role</label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={invite.role}
                  onChange={(e) => setInvite((p) => ({ ...p, role: e.target.value as AdminRoleDto }))}
                >
                  {ROLE_OPTIONS.filter((o) => myRole === 'SUPER_ADMIN' || o.value !== 'SUPER_ADMIN').map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              {inviteErr && <p className="text-sm text-red-600">{inviteErr}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setInviteOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="rounded-lg bg-[#045be2] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Send invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
