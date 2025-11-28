'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminRouteGuard } from '@/components/admin/admin-route-guard';
import { UserManagement } from '@/components/admin/user-management';
import { TournamentManagement } from '@/components/admin/tournament-management';
import { useState } from 'react';

type AdminView = 'dashboard' | 'users' | 'tournaments';

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('dashboard');

  return (
    <AdminRouteGuard>
      {view === 'dashboard' && <AdminDashboard setView={setView} />}
      {view === 'users' && <UserManagement setView={setView} />}
      {view === 'tournaments' && <TournamentManagement setView={setView} />}
    </AdminRouteGuard>
  );
}
