'use client';
import { useMemo, useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Loader2, Eye, Trash2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
  useDoc,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, collectionGroup, doc, query } from 'firebase/firestore';
import type { Registration, Event } from '@/lib/data';
import { ApplicationDetailDialog } from './application-detail-dialog';

type AdminView = 'dashboard' | 'applications';

interface ApplicationManagementProps {
  setView: (view: AdminView) => void;
}

function RegistrationRow({
  registration,
  event,
  onSelect,
  onDelete,
}: {
  registration: Registration;
  event: Event | undefined;
  onSelect: (registration: Registration) => void;
  onDelete: (registrationId: string, userId: string) => void;
}) {
  return (
    <TableRow key={registration.id}>
      <TableCell className="font-medium">{registration.teamName}</TableCell>
      <TableCell>{event?.name ?? 'Loading...'}</TableCell>
      <TableCell>{registration.whatsAppNumber}</TableCell>
      <TableCell>
        {new Date(registration.registrationDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelect(registration)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                application for {registration.teamName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  onDelete(registration.id, registration.userId)
                }
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}

function ApplicationTable({
  applications,
  eventsById,
  onSelect,
  onDelete,
  isLoading,
  emptyMessage,
}: {
  applications: Registration[];
  eventsById: Record<string, Event>;
  onSelect: (reg: Registration) => void;
  onDelete: (regId: string, userId: string) => void;
  isLoading: boolean;
  emptyMessage: string;
}) {
  return (
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
        ) : applications.length > 0 ? (
          applications.map((reg) => (
            <RegistrationRow
              key={reg.id}
              registration={reg}
              event={eventsById[reg.eventId]}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function ApplicationManagement({ setView }: ApplicationManagementProps) {
  const firestore = useFirestore();
  const [selectedRegistration, setSelectedRegistration] =
    useState<Registration | null>(null);

  const registrationsQuery = useMemoFirebase(
    () => (firestore ? query(collectionGroup(firestore, 'registrations')) : null),
    [firestore]
  );
  const { data: registrations, isLoading: registrationsLoading } =
    useCollection<Registration>(registrationsQuery);

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading: eventsLoading } =
    useCollection<Event>(eventsRef);

  const eventsById = useMemo(() => {
    if (!events) return {};
    return events.reduce(
      (acc, event) => {
        acc[event.id] = event;
        return acc;
      },
      {} as Record<string, Event>
    );
  }, [events]);

  const { paidApplications, freeApplications } = useMemo(() => {
    if (!registrations || !events) {
      return { paidApplications: [], freeApplications: [] };
    }
    const paid = registrations.filter(
      (reg) => eventsById[reg.eventId] && eventsById[reg.eventId].fee > 0
    );
    const free = registrations.filter(
      (reg) => !eventsById[reg.eventId] || eventsById[reg.eventId].fee === 0
    );
    return { paidApplications: paid, freeApplications: free };
  }, [registrations, events, eventsById]);

  const handleDelete = (registrationId: string, userId: string) => {
    if (!firestore) return;
    const regDocRef = doc(
      firestore,
      'users',
      userId,
      'registrations',
      registrationId
    );
    deleteDocumentNonBlocking(regDocRef);
  };

  const isLoading = registrationsLoading || eventsLoading;

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
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
              <Tabs defaultValue="paid">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paid">Paid Applications</TabsTrigger>
                  <TabsTrigger value="free">Free Applications</TabsTrigger>
                </TabsList>
                <TabsContent value="paid">
                  <ApplicationTable
                    applications={paidApplications}
                    eventsById={eventsById}
                    onSelect={setSelectedRegistration}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                    emptyMessage="No paid applications found."
                  />
                </TabsContent>
                <TabsContent value="free">
                  <ApplicationTable
                    applications={freeApplications}
                    eventsById={eventsById}
                    onSelect={setSelectedRegistration}
                    onDelete={handleDelete}
                    isLoading={isLoading}
                    emptyMessage="No free applications found."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <ApplicationDetailDialog
        registration={selectedRegistration}
        isOpen={!!selectedRegistration}
        setIsOpen={(isOpen) => {
          if (!isOpen) {
            setSelectedRegistration(null);
          }
        }}
      />
    </div>
  );
}
