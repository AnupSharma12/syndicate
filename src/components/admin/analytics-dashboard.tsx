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
import { ArrowLeft, TrendingUp, Users, UserCheck, FileText, BarChart3 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query } from 'firebase/firestore';
import type { Event, Registration, Team } from '@/lib/data';

interface AnalyticsDashboardProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'analytics';

export function AnalyticsDashboard({ setView }: AnalyticsDashboardProps) {
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events } = useCollection<Event>(eventsRef);

  const registrationsQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'registrations')) : null),
    [firestore]
  );
  const { data: registrations } = useCollection<Registration>(registrationsQuery);

  const teamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'teams') : null),
    [firestore]
  );
  const { data: teams } = useCollection<Team>(teamsRef);

  const usersRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users } = useCollection(usersRef);

  const totalEvents = events?.length ?? 0;
  const totalRegistrations = registrations?.length ?? 0;
  const totalTeams = teams?.length ?? 0;
  const totalUsers = users?.length ?? 0;
  const approvedRegistrations = registrations?.filter((r: any) => r.status === 'approved').length ?? 0;
  const approvalRate = totalRegistrations > 0 ? Math.round((approvedRegistrations / totalRegistrations) * 100) : 0;

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                Analytics & Insights
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Track key metrics and performance indicators
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Events</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalEvents}</div>
                <p className="text-xs text-muted-foreground mt-1">Active tournaments</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{approvedRegistrations}</div>
                <p className="text-xs text-muted-foreground mt-1">Approval rate: {approvalRate}%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Teams</CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalTeams}</div>
                <p className="text-xs text-muted-foreground mt-1">In competition</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle>Registration Status</CardTitle>
                <CardDescription>Breakdown of application statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Approved</span>
                      <span className="font-semibold">{approvedRegistrations}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${approvalRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Pending</span>
                      <span className="font-semibold">{totalRegistrations - approvedRegistrations}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${100 - approvalRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Platform overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Avg Team Size</span>
                    <span className="font-bold">
                      {totalTeams > 0 ? (totalUsers / Math.max(totalTeams, 1)).toFixed(1) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Total Applications</span>
                    <span className="font-bold">{totalRegistrations}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Pending Reviews</span>
                    <span className="font-bold">{totalRegistrations - approvedRegistrations}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-bold">{approvalRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Options */}
          <Card className="bg-card border-border/60 mt-8">
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download analytics reports</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export as CSV
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Generate PDF Report
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Trends
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
