
'use client';
import { useState } from 'react';
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
import { ArrowLeft, Loader2, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '../ui/badge';
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Registration, Team } from '@/lib/data';
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container max-w-7xl px-4 py-12 md:py-16">
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
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage teams for the leaderboard.
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
                  ) : (
                    teams?.map((team) => (
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
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
