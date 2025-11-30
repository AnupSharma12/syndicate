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
import { Youtube, ArrowLeft, Loader2 } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import { useFirestore, useDoc, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import type { Event, Registration } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const IMGBB_API_KEY = '828e7300541739226abfc621193150d3';

export default function RegisterEventPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const eventId = params.id as string;

  const [teamName, setTeamName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [youtubeProof, setYoutubeProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventRef = useMemoFirebase(
    () => (firestore && eventId ? doc(firestore, 'events', eventId) : null),
    [firestore, eventId]
  );
  const { data: event, isLoading: eventLoading } = useDoc<Event>(eventRef);
  
  const qrCodeImage = PlaceHolderImages.find((p) => p.id === 'qr-code');

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
        description: 'Could not upload one of the images. Please try again.',
      });
      return null;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event || !user || !firestore || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Upload images in parallel
      const [teamLogoUrl, paymentProofUrl, youtubeProofUrl] = await Promise.all([
        uploadImage(teamLogo),
        uploadImage(paymentProof),
        uploadImage(youtubeProof),
      ]);

      // Check if required uploads were successful
      if (!teamLogoUrl || (event.fee > 0 && !paymentProofUrl)) {
        toast({
            variant: "destructive",
            title: "Upload Error",
            description: "Required image uploads failed. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      const registrationData: Omit<Registration, 'id'> = {
        userId: user.uid,
        eventId: event.id,
        registrationDate: new Date().toISOString(),
        teamName,
        whatsAppNumber,
        teamLogoUrl: teamLogoUrl,
        paymentProofUrl: paymentProofUrl ?? '', // Use empty string if null
        youtubeProofUrl: youtubeProofUrl ?? '', // Use empty string if null
      };

      const registrationsColRef = collection(firestore, 'users', user.uid, 'registrations');
      
      addDocumentNonBlocking(registrationsColRef, registrationData);
      
      toast({
        title: 'Registration Submitted!',
        description: `Your team has been registered for the ${event.name}.`,
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
                  <Input 
                    id="teamLogo" 
                    type="file" 
                    required 
                    className="pt-2"
                    accept="image/*"
                    onChange={(e) => setTeamLogo(e.target.files ? e.target.files[0] : null)}
                    />
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
