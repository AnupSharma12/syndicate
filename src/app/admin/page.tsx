'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminRouteGuard } from '@/components/admin/admin-route-guard';
import { UserManagement } from '@/components/admin/user-management';
import { TournamentManagement } from '@/components/admin/tournament-management';
import { ApplicationManagement } from '@/components/admin/application-management';
import { TeamManagement } from '@/components/admin/team-management';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import { SettingsPanel } from '@/components/admin/settings-panel';
import { AuditLogs } from '@/components/admin/audit-logs';
import { SystemHealth } from '@/components/admin/system-health';
import { useState } from 'react';

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'analytics' | 'settings' | 'audit' | 'health';

export default function AdminPage() {
  const [view, setView] = useState<AdminView>('dashboard');

  return (
    <AdminRouteGuard>
      {view === 'dashboard' && <AdminDashboard setView={setView} />}
      {view === 'users' && <UserManagement setView={setView} />}
      {view === 'tournaments' && <TournamentManagement setView={setView} />}
      {view === 'applications' && <ApplicationManagement setView={setView} />}
      {view === 'teams' && <TeamManagement setView={setView} />}
      {view === 'analytics' && <AnalyticsDashboard setView={setView} />}
      {view === 'settings' && <SettingsPanel setView={setView} />}
      {view === 'audit' && <AuditLogs setView={setView} />}
      {view === 'health' && <SystemHealth setView={setView} />}
    </AdminRouteGuard>
  );
}
