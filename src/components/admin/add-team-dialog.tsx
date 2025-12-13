
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Registration, Event } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, collectionGroup, query, where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';

interface AddTeamDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSelectApplication: (registration: Registration) => void;
  onAddManually: () => void;
}

export function AddTeamDialog({
  isOpen,
  setIsOpen,
  onSelectApplication,
  onAddManually,
}: AddTeamDialogProps) {
  const firestore = useFirestore();

  const registrationsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collectionGroup(firestore, 'registrations'))
        : null,
    [firestore]
  );
  const { data: allRegistrations, isLoading: registrationsLoading } =
    useCollection<Registration>(registrationsQuery);

  // Filter to only show registrations where team hasn't been created yet
  const applications = useMemo(() => {
    if (!allRegistrations) return [];
    return allRegistrations.filter(reg => !reg.isTeamCreated);
  }, [allRegistrations]);

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

  const isLoading = registrationsLoading || eventsLoading;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add a New Team</DialogTitle>
          <DialogDescription>
            Choose to add a team manually or from a pending application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center gap-4 mb-6">
            <Button onClick={onAddManually}>Add Manually</Button>
          </div>
          <h3 className="text-lg font-medium text-center mb-4">Or Add From a Pending Application</h3>
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : applications && applications.length > 0 ? (
                  applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.teamName}</TableCell>
                      <TableCell>{eventsById[app.eventId]?.name ?? 'N/A'}</TableCell>
                      <TableCell>{new Date(app.registrationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectApplication(app)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No pending applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
