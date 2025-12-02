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
import type { Event } from '@/lib/data';
import { TournamentForm } from './tournament-form';

type AdminView = 'dashboard' | 'users' | 'tournaments';

interface TournamentManagementProps {
  setView: (view: AdminView) => void;
}

export function TournamentManagement({ setView }: TournamentManagementProps) {
  const firestore = useFirestore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Event>(eventsRef);

  const handleAdd = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (!firestore) return;
    if (confirm('Are you sure you want to delete this event?')) {
      const eventDocRef = doc(firestore, 'events', eventId);
      deleteDocumentNonBlocking(eventDocRef);
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
              Add Tournament
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Tournament Management</CardTitle>
              <CardDescription>
                Create, edit, and manage your esports tournaments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prize</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    events?.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.game}</TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            event.status === 'Open' ? 'default' : event.status === 'Live' ? 'destructive' : 'secondary'
                          }>{event.status}</Badge>
                        </TableCell>
                        <TableCell>रु{event.prize}</TableCell>
                         <TableCell>{event.registeredTeams}/{event.maxTeams}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-4 w-4" />
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
      <TournamentForm 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        event={selectedEvent}
      />
    </div>
  );
}
