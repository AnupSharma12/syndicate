'use client';
import { useState, useMemo } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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
  const { data: users, isLoading: usersLoading } = useCollection<User>(usersRef);

  const staffRolesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'roles_staff') : null),
    [firestore]
  );
  const { data: staffRoles, isLoading: rolesLoading } =
    useCollection(staffRolesRef);

  const handleRoleChange = async (user: User, isStaff: boolean) => {
    if (!firestore) return;

    setIsProcessing((prev) => ({ ...prev, [user.id]: true }));

    const staffRoleRef = doc(firestore, 'roles_staff', user.id);
    const userDocRef = doc(firestore, 'users', user.id);

    try {
      if (isStaff) {
        // Grant staff role
        await setDoc(staffRoleRef, {
          email: user.email,
          username: user.username,
        });
        await setDoc(userDocRef, { staff: true }, { merge: true });
        toast({
          title: 'Success',
          description: `${user.username} is now a staff member.`,
        });
      } else {
        // Revoke staff role
        await deleteDoc(staffRoleRef);
        await setDoc(userDocRef, { staff: false }, { merge: true });
        toast({
          title: 'Success',
          description: `Staff role revoked for ${user.username}.`,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: error.message,
      });
    } finally {
      setIsProcessing((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  const staffMap = useMemo(() => {
    return staffRoles?.reduce((acc, role) => {
      acc[role.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [staffRoles]);

  const isLoading = usersLoading || rolesLoading;

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
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Grant or revoke staff privileges for users.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                                checked={staffMap?.[user.id] || false}
                                onCheckedChange={(checked) =>
                                    handleRoleChange(user, checked)
                                }
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
