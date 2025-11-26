'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { AdminRouteGuard } from '@/components/admin/admin-route-guard';

export default function AdminPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  );
}
