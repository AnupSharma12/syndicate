
'use client';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, PlusCircle, Edit, Trash2, UserPlus, CheckCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '../ui/badge';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, collectionGroup, doc, query, where } from 'firebase/firestore';
import type { Registration, Team, Event } from '@/lib/data';
import { TeamForm } from './team-form';
import { AddTeamDialog } from './add-team-dialog';

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams';

interface TeamManagementProps {
  setView: (view: AdminView) => void;
}

export function TeamManagement({ setView }: TeamManagementProps) {
  const firestore = useFirestore();
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Registration | null>(null);

  const teamsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'teams') : null),
    [firestore]
  );
  const { data: teams, isLoading } = useCollection<Team>(teamsRef);

  // Fetch all registrations
  const allRegistrationsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collectionGroup(firestore, 'registrations'))
        : null,
    [firestore]
  );
  const { data: allRegistrations, isLoading: registrationsLoading } =
    useCollection<Registration>(allRegistrationsQuery);

  // Filter registrations by status
  const pendingRegistrations = useMemo(() => {
    if (!allRegistrations) return [];
    return allRegistrations.filter(reg => !reg.isTeamCreated);
  }, [allRegistrations]);

  const createdFromRegistrations = useMemo(() => {
    if (!allRegistrations) return [];
    return allRegistrations.filter(reg => reg.isTeamCreated === true);
  }, [allRegistrations]);

  // Fetch events for event names
  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading: eventsLoading } = useCollection<Event>(eventsRef);

  const eventsById = useMemo(() => {
    if (!events) return {};
    return events.reduce((acc, event) => {
      acc[event.id] = event;
      return acc;
    }, {} as Record<string, Event>);
  }, [events]);

  const handleAdd = () => {
    setIsAddTeamDialogOpen(true);
  };

  const handleAddManually = () => {
    setSelectedTeam(null);
    setSelectedApplication(null);
    setIsAddTeamDialogOpen(false);
    setIsFormOpen(true);
  };

  const handleSelectApplication = (application: Registration) => {
    setSelectedTeam(null);
    setSelectedApplication(application);
    setIsAddTeamDialogOpen(false);
    setIsFormOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setSelectedApplication(null);
    setIsFormOpen(true);
  };

  const handleDelete = (teamId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this team? This will remove them from the leaderboard.')) {
      const teamDocRef = doc(firestore, 'teams', teamId);
      deleteDocumentNonBlocking(teamDocRef);
    }
  };
  
  const getRankVariant = (rank: Team['rank']) => {
    switch (rank) {
      case 'Champion':
        return 'default';
      case 'Elite':
        return 'destructive';
      case 'Pro':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => setView('dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </div>
          <Tabs defaultValue="teams" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="teams">
                Official Teams ({teams?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Registrations ({pendingRegistrations?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value="created">
                Registered Teams ({createdFromRegistrations?.length ?? 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Official Teams</CardTitle>
                  <CardDescription>
                    Teams added to the leaderboard.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Captain</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Wins</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : teams && teams.length > 0 ? (
                        teams.map((team) => (
                          <TableRow key={team.id}>
                            <TableCell className="font-medium">{team.name}</TableCell>
                            <TableCell>{team.captainName}</TableCell>
                            <TableCell>
                               <Badge variant={getRankVariant(team.rank)}>{team.rank}</Badge>
                            </TableCell>
                            <TableCell>{team.wins}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(team)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(team.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No official teams yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Registrations</CardTitle>
                  <CardDescription>
                    Teams that have registered for tournaments but haven&apos;t been added as official teams yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Team Leader</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrationsLoading || eventsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : pendingRegistrations && pendingRegistrations.length > 0 ? (
                        pendingRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.teamName}</TableCell>
                            <TableCell>{registration.teamLeaderFullName}</TableCell>
                            <TableCell>{eventsById[registration.eventId]?.name ?? 'Unknown Event'}</TableCell>
                            <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleSelectApplication(registration)}
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add to Teams
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No pending registrations.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="created">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Teams (Added)</CardTitle>
                  <CardDescription>
                    Teams that registered and have been added as official teams.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Team Leader</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrationsLoading || eventsLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                          </TableCell>
                        </TableRow>
                      ) : createdFromRegistrations && createdFromRegistrations.length > 0 ? (
                        createdFromRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.teamName}</TableCell>
                            <TableCell>{registration.teamLeaderFullName}</TableCell>
                            <TableCell>{eventsById[registration.eventId]?.name ?? 'Unknown Event'}</TableCell>
                            <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Added
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No teams have been added from registrations yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <AddTeamDialog
        isOpen={isAddTeamDialogOpen}
        setIsOpen={setIsAddTeamDialogOpen}
        onSelectApplication={handleSelectApplication}
        onAddManually={handleAddManually}
      />
      <TeamForm 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        team={selectedTeam}
        application={selectedApplication}
      />
    </div>
  );
}
