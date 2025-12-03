'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminRouteGuard } from '@/components/admin/admin-route-guard';
import { UserManagement } from '@/components/admin/user-management';
import { TournamentManagement } from '@/components/admin/tournament-management';
import { ApplicationManagement } from '@/components/admin/application-management';
import { TeamManagement } from '@/components/admin/team-management';
import { useState } from 'react';

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams';

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('dashboard');

  return (
    <AdminRouteGuard>
      {view === 'dashboard' && <AdminDashboard setView={setView} />}
      {view === 'users' && <UserManagement setView={setView} />}
      {view === 'tournaments' && <TournamentManagement setView={setView} />}
      {view === 'applications' && <ApplicationManagement setView={setView} />}
      {view === 'teams' && <TeamManagement setView={setView} />}
    </AdminRouteGuard>
  );
}
