'use client';
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
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collectionGroup, doc, query } from 'firebase/firestore';
import type { Registration, Event } from '@/lib/data';


type AdminView = 'dashboard' | 'applications';

interface ApplicationManagementProps {
  setView: (view: AdminView) => void;
}

function RegistrationRow({ registration }: { registration: Registration }) {
  const firestore = useFirestore();
  const eventRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'events', registration.eventId) : null),
    [firestore, registration.eventId]
  );
  const { data: event } = useDoc<Event>(eventRef);

  return (
    <TableRow key={registration.id}>
      <TableCell className="font-medium">{registration.teamName}</TableCell>
      <TableCell>{event?.name ?? 'Loading...'}</TableCell>
      <TableCell>{registration.whatsAppNumber}</TableCell>
      <TableCell>
        {new Date(registration.registrationDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        {/* Placeholder for actions */}
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ApplicationManagement({ setView }: ApplicationManagementProps) {
  const firestore = useFirestore();

  const registrationsQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'registrations')) : null),
    [firestore]
  );
  const { data: registrations, isLoading } = useCollection<Registration>(registrationsQuery);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="container max-w-7xl px-4 py-12 md:py-16">
          <Button
            variant="ghost"
            onClick={() => setView('dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>
                View and manage all event applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>WhatsApp Number</TableHead>
                    <TableHead>Date</TableHead>
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
                  ) : registrations && registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <RegistrationRow key={reg.id} registration={reg} />
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
