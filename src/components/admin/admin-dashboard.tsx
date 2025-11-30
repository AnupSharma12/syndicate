'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Swords, ShieldCheck, Loader2, FileText } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup } from 'firebase/firestore';
import type { Event, Registration } from '@/lib/data';

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications';

interface AdminDashboardProps {
  setView: (view: AdminView) => void;
}

export function AdminDashboard({ setView }: AdminDashboardProps) {
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading: eventsLoading } = useCollection<Event>(eventsRef);

  const registrationsRef = useMemoFirebase(
    () => (firestore ? collectionGroup(firestore, 'registrations') : null),
    [firestore]
  );
  const { data: registrations, isLoading: registrationsLoading } = useCollection<Registration>(registrationsRef);

  const totalEvents = events?.length ?? 0;
  const totalRegistrations = registrations?.length ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container max-w-7xl px-4 py-12 md:py-16">
          <div className="mb-10">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Welcome, staff member. Manage your application from here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-card border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Tournaments
                </CardTitle>
                <Swords className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">{totalEvents}</div>
                )}
                 <p className="text-xs text-muted-foreground">Total tournaments</p>
              </CardContent>
              <CardContent>
                 <Button onClick={() => setView('tournaments')}>View Tournaments</Button>
              </CardContent>
            </Card>
             <Card className="bg-card border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  View Applications
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {registrationsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                )}
                 <p className="text-xs text-muted-foreground">Total applications</p>
              </CardContent>
              <CardContent>
                 <Button onClick={() => setView('applications')}>View Applications</Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  User Management
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage Roles</div>
                <p className="text-xs text-muted-foreground">
                  Grant or revoke staff access
                </p>
              </CardContent>
               <CardContent>
                 <Button onClick={() => setView('users')}>Manage Users</Button>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">Online</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
               <CardContent>
                 <Button variant="outline">View Status</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
