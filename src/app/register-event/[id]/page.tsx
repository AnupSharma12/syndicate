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
import { Youtube, ArrowLeft, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import { useFirestore, useDoc, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Event, Registration, SquadMember } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const IMGBB_API_KEY = '828e7300541739226abfc621193150d3';

export default function RegisterEventPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const eventId = params.id as string;

  // Form state
  const [teamName, setTeamName] = useState('');
  const [teamLeaderFullName, setTeamLeaderFullName] = useState('');
  const [teamLeaderGameId, setTeamLeaderGameId] = useState('');
  const [teamLeaderEmail, setTeamLeaderEmail] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [squadMembers, setSquadMembers] = useState<SquadMember[]>([{ name: '', gameId: '' }]);

  // File state
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [youtubeProof, setYoutubeProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventRef = useMemoFirebase(
    () => (firestore && eventId ? doc(firestore, 'events', eventId) : null),
    [firestore, eventId]
  );
  const { data: event, isLoading: eventLoading } = useDoc<Event>(eventRef);

  useEffect(() => {
    if (user?.email) {
      setTeamLeaderEmail(user.email);
    }
  }, [user]);
  
  const qrCodeImage = PlaceHolderImages.find((p) => p.id === 'qr-code');

  const handleSquadMemberChange = (index: number, field: keyof SquadMember, value: string) => {
    const newSquadMembers = [...squadMembers];
    newSquadMembers[index][field] = value;
    setSquadMembers(newSquadMembers);
  };

  const addSquadMember = () => {
    setSquadMembers([...squadMembers, { name: '', gameId: '' }]);
  };

  const removeSquadMember = (index: number) => {
    if (squadMembers.length <= 1 && index === 0) {
        setSquadMembers([{ name: '', gameId: '' }]); // Reset the first player instead of removing
        return;
    }
    const newSquadMembers = squadMembers.filter((_, i) => i !== index);
    setSquadMembers(newSquadMembers.length > 0 ? newSquadMembers : [{ name: '', gameId: '' }]);
  };

  const uploadImage = async (imageFile: File | null): Promise<string | null> => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error?.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Image Upload Failed',
        description: (error as Error).message || 'Could not upload an image.',
      });
      return null;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !user || !firestore || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const [teamLogoUrl, paymentProofUrl, youtubeProofUrl] = await Promise.all([
        uploadImage(teamLogo),
        uploadImage(paymentProof),
        uploadImage(youtubeProof),
      ]);

      if (!teamLogoUrl) {
        toast({ variant: "destructive", title: "Missing Logo", description: "Please upload a team logo." });
        setIsSubmitting(false);
        return;
      }
      if (event.fee > 0 && !paymentProofUrl) {
        toast({ variant: "destructive", title: "Missing Payment Proof", description: "Please upload proof of payment." });
        setIsSubmitting(false);
        return;
      }

      const registrationData: Omit<Registration, 'id'> = {
        userId: user.uid,
        eventId: event.id,
        registrationDate: new Date().toISOString(),
        teamName,
        teamLeaderFullName,
        teamLeaderGameId,
        teamLeaderEmail,
        whatsAppNumber,
        squadMembers: squadMembers.filter(m => m.name && m.gameId),
        teamLogoUrl,
        isTeamCreated: false,
      };
      
      if (paymentProofUrl) {
        registrationData.paymentProofUrl = paymentProofUrl;
      }
      if (youtubeProofUrl) {
          registrationData.youtubeProofUrl = youtubeProofUrl;
      }

      const registrationsColRef = collection(firestore, 'users', user.uid, 'registrations');
      addDocumentNonBlocking(registrationsColRef, registrationData);

      toast({
        title: 'Registration Submitted!',
        description: `Your team application for ${event.name} has been received.`,
      });
      router.push('/');

    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was a problem submitting your registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (eventLoading || isUserLoading) {
    return <Loader />;
  }

  if (!user) {
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

  const gameIdLabel = `${event.game} ID`;

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
              <form onSubmit={handleFormSubmit} className="space-y-8">
                
                {/* Team Information */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">Team Information</h3>
                    <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" placeholder="Enter your team name" required value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="teamLogo">Team Logo</Label>
                        <Input id="teamLogo" type="file" required className="pt-2" accept="image/*" onChange={(e) => setTeamLogo(e.target.files ? e.target.files[0] : null)} />
                    </div>
                </div>

                {/* Team Leader Details */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">Team Leader Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamLeaderFullName">Full Name</Label>
                            <Input id="teamLeaderFullName" placeholder="Leader's full name" required value={teamLeaderFullName} onChange={(e) => setTeamLeaderFullName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="teamLeaderGameId">{gameIdLabel}</Label>
                            <Input id="teamLeaderGameId" placeholder={`Your ${event.game} ID`} required value={teamLeaderGameId} onChange={(e) => setTeamLeaderGameId(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="teamLeaderEmail">Email</Label>
                            <Input id="teamLeaderEmail" type="email" placeholder="leader@example.com" required value={teamLeaderEmail} onChange={(e) => setTeamLeaderEmail(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="whatsAppNumber">Phone Number</Label>
                            <Input id="whatsAppNumber" type="tel" placeholder="+1234567890" required value={whatsAppNumber} onChange={(e) => setWhatsAppNumber(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Squad Members */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary">Squad Members</h3>
                    {squadMembers.map((member, index) => (
                        <div key={index} className="p-4 border rounded-md relative space-y-4">
                            <h4 className="font-medium">Player {index + 1}</h4>
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeSquadMember(index)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`player-name-${index}`}>Player {index + 1} Name</Label>
                                    <Input id={`player-name-${index}`} placeholder="Player in-game name" required={index === 0} value={member.name} onChange={(e) => handleSquadMemberChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`player-gameid-${index}`}>{gameIdLabel}</Label>
                                    <Input id={`player-gameid-${index}`} placeholder={`Player ${index + 1} ${event.game} ID`} required={index === 0} value={member.gameId} onChange={(e) => handleSquadMemberChange(index, 'gameId', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addSquadMember}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Player
                    </Button>
                </div>
                
                {event.fee > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">Payment Details</h4>
                      <Alert>
                        <AlertTitle>Application Fee: RS{event.fee}</AlertTitle>
                        <AlertDescription>
                          Scan the QR code to complete the payment.
                        </AlertDescription>
                      </Alert>
                      {qrCodeImage && (
                        <div className="flex justify-center p-4 bg-muted rounded-md">
                          <Image
                            src={qrCodeImage.imageUrl}
                            alt={qrCodeImage.description}
                            width={200}
                            height={200}
                            data-ai-hint={qrCodeImage.imageHint}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="paymentProof">
                          Screenshot of Payment Proof
                        </Label>
                        <Input 
                          id="paymentProof" 
                          type="file" 
                          required 
                          accept="image/*"
                          className="pt-2" 
                          onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                          />
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
                      Please subscribe to our channel and upload a screenshot
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
                    <Label htmlFor="youtubeProof">Upload Screenshot</Label>
                    <Input
                      id="youtubeProof"
                      type="file"
                      accept="image/*"
                      className="pt-2"
                      onChange={(e) => setYoutubeProof(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full font-bold text-lg py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : (event.fee > 0 ? 'Submit Application' : 'Register Free')}
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
