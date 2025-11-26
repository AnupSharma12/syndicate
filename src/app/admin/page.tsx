'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminRouteGuard } from '@/components/admin/admin-route-guard';
import { UserManagement } from '@/components/admin/user-management';
import { useState } from 'react';

type AdminView = 'dashboard' | 'users';

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('dashboard');

  return (
    <AdminRouteGuard>
      {view === 'dashboard' && <AdminDashboard setView={setView} />}
      {view === 'users' && <UserManagement setView={setView} />}
    </AdminRouteGuard>
  );
}
