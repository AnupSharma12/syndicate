'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  collection,
  doc,
} from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

type AdminView = 'dashboard' | 'users';

interface UserManagementProps {
  setView: (view: AdminView) => void;
}

type User = {
  id: string;
  username: string;
  email: string;
  staff: boolean;
};

export function UserManagement({ setView }: UserManagementProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const usersRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: users, isLoading: usersLoading, error: usersError } = useCollection<User>(usersRef);

  // Log for debugging
  useEffect(() => {
    if (usersError) {
      console.error('Error fetching users:', usersError);
    }
    console.log('Users data:', users);
    console.log('Users loading:', usersLoading);
  }, [usersError, users, usersLoading]);

  const handleRoleChange = async (user: User, isStaff: boolean) => {
    if (!firestore) return;

    setIsProcessing((prev) => ({ ...prev, [user.id]: true }));

    const staffRoleRef = doc(firestore, 'roles_staff', user.id);
    const userDocRef = doc(firestore, 'users', user.id);

    try {
      if (isStaff) {
        // Grant staff role
        setDocumentNonBlocking(staffRoleRef, {
          email: user.email,
          username: user.username,
        }, { merge: true });
        setDocumentNonBlocking(userDocRef, { staff: true }, { merge: true });
        toast({
          title: 'Success',
          description: `${user.username} is now a staff member.`,
        });
      } else {
        // Revoke staff role
        deleteDocumentNonBlocking(staffRoleRef);
        setDocumentNonBlocking(userDocRef, { staff: false }, { merge: true });
        toast({
          title: 'Success',
          description: `Staff role revoked for ${user.username}.`,
        });
      }
    } catch (error) {
      console.error("Error updating roles: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update role. Please check console for details.',
      });
    } finally {
        // Use a timeout to give Firestore time to propagate changes before re-enabling switch
        setTimeout(() => {
            setIsProcessing((prev) => ({ ...prev, [user.id]: false }));
        }, 1500);
    }
  };

  const isLoading = usersLoading;

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
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Grant or revoke staff privileges for users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersError && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">
                  <p className="font-semibold">Error loading users:</p>
                  <p>{usersError.message}</p>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && (!users || users.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No users found. Users will appear here once they register.
                      </TableCell>
                    </TableRow>
                  )}
                  {users &&
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                             {isProcessing[user.id] ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Switch
                                id={`staff-switch-${user.id}`}
                                checked={user.staff || false}
                                onCheckedChange={(checked) =>
                                    handleRoleChange(user, checked)
                                }
                                disabled={user.email === 'anup34343@gmail.com'}
                                aria-label={`Toggle staff role for ${user.username}`}
                                />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
