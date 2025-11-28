'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Youtube, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import { useFirestore, useDoc, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Event, Registration } from '@/lib/data';

export default function RegisterEventPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const eventId = params.id as string;

  const [teamName, setTeamName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  const eventRef = useMemoFirebase(
    () => (firestore && eventId ? doc(firestore, 'events', eventId) : null),
    [firestore, eventId]
  );
  const { data: event, isLoading: eventLoading } = useDoc<Event>(eventRef);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not submit registration. Please try again.',
      });
      return;
    }

    const registrationData: Omit<Registration, 'id'> = {
      userId: user.uid,
      eventId: event.id,
      registrationDate: new Date().toISOString(),
      teamName,
      whatsAppNumber,
      // NOTE: File upload fields are placeholders.
      // A full implementation requires a service like Firebase Storage.
      teamLogoUrl: '', 
      paymentProofUrl: '',
      youtubeProofUrls: [],
    };

    const registrationsColRef = collection(firestore, 'users', user.uid, 'registrations');
    addDocumentNonBlocking(registrationsColRef, registrationData);
    
    toast({
      title: 'Registration Submitted!',
      description: `Your team has been registered for the ${event.name}.`,
    });
    router.push('/');
  };

  if (eventLoading || isUserLoading) {
    return <Loader />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    router.push('/login');
    return <Loader />;
  }
  
  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <p className="text-muted-foreground">This event may have been moved or deleted.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">Go back to events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-4xl px-4">
           <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tournaments
            </Button>
          <Card className="bg-card border-border/60">
            <CardHeader>
              <CardTitle className="font-headline text-3xl md:text-4xl">
                Register for: {event.name}
              </CardTitle>
              <CardDescription>
                Complete the form below to compete. 
                This is a <span className="font-semibold text-primary">{event.fee > 0 ? 'paid' : 'free-to-enter'}</span> event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" placeholder="e.g., The Dragons" required value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input id="whatsapp" type="tel" placeholder="+977..." required value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
                    </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="teamLogo">Team Logo</Label>
                  <Input id="teamLogo" type="file" required className="pt-2" />
                </div>
                
                {event.fee > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Payment Details</h4>
                      <Alert>
                        <AlertTitle>Application Fee: रु{event.fee}</AlertTitle>
                        <AlertDescription>
                          Scan the QR code to complete the payment.
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-center p-4 bg-muted rounded-md">
                        <Image
                          src="https://picsum.photos/seed/qr/200/200"
                          alt="Payment QR Code"
                          width={200}
                          height={200}
                          data-ai-hint="QR code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentProof">
                          Screenshot of Payment Proof
                        </Label>
                        <Input id="paymentProof" type="file" required className="pt-2" />
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-lg font-medium">
                    Requirement: YouTube Subscription
                  </h4>
                  <Alert>
                    <Youtube className="h-4 w-4" />
                    <AlertTitle>Subscribe on YouTube</AlertTitle>
                    <AlertDescription>
                      Please subscribe to our channel and upload 4 screenshots
                      as proof.
                      <Button variant="link" asChild className="p-0 h-auto ml-1">
                        <Link
                          href="https://www.youtube.com/@syndicateesp1"
                          target="_blank"
                        >
                          Visit Channel
                        </Link>
                      </Button>
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeProof">Upload 4 Screenshots</Label>
                    <Input
                      id="youtubeProof"
                      type="file"
                      required
                      multiple
                      className="pt-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-bold text-lg py-6"
                >
                  {event.fee > 0 ? 'Submit Application' : 'Register Team'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
