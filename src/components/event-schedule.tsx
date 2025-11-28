'use client';

import { useState } from 'react';
import type { Event } from '@/lib/data';
import { events } from '@/lib/data';
import { Calendar, Trophy, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const gameFilters = ['All', 'Valorant', 'Apex Legends', 'League of Legends'];

export function EventSchedule() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const filteredEvents =
    activeFilter === 'All'
      ? events
      : events.filter((event) => event.game === activeFilter);

  const gameImages = PlaceHolderImages.filter((p) =>
    gameFilters.includes(p.id)
  );

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: 'Registration Submitted!',
      description: `Your team has been registered for the ${selectedEvent?.name}.`,
    });
  };

  return (
    <section id="tournaments" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            Upcoming Tournaments
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Filter by game and register your team to compete for glory and prizes.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-2 rounded-lg bg-muted p-1.5">
            {gameFilters.map((game) => (
              <Button
                key={game}
                variant={activeFilter === game ? 'default' : 'ghost'}
                onClick={() => setActiveFilter(game)}
                className={`rounded-md px-4 py-2 transition-colors duration-200 ${
                  activeFilter === game ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10'
                }`}
              >
                {game}
              </Button>
            ))}
          </div>
        </div>

        <div
          id="schedule"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredEvents.map((event) => {
            const gameImage = gameImages.find((img) => img.id === event.game);
            return (
              <Card
                key={event.id}
                className="group flex flex-col bg-card border-border/60 overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2"
              >
                {gameImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={gameImage.imageUrl}
                      alt={event.game}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={gameImage.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="text-primary font-semibold pt-1">{event.game}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-accent" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>{event.prize} Prize Pool</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full font-bold"
                    onClick={() => handleRegisterClick(event)}
                    variant={event.status === 'Open' ? 'default' : 'secondary'}
                    disabled={event.status !== 'Open'}
                  >
                    {event.status === 'Open' ? 'Register Now' : event.status}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <Separator className="my-16 md:my-24" />

        <div
          id="registration"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          <div className="order-2 lg:order-1">
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Registration Form
                </CardTitle>
                <CardDescription>
                  {selectedEvent
                    ? `Enter your details for ${selectedEvent.name}`
                    : 'Select a tournament to get started'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedEvent ? (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="teamName">Team Name</Label>
                      <Input id="teamName" placeholder="e.g., The Dragons" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamLogo">Team Logo</Label>
                      <Input id="teamLogo" type="file" required className="pt-2"/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input id="whatsapp" type="tel" placeholder="+91..." required />
                    </div>

                    {!selectedEvent.free && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="text-lg font-medium">Payment Details</h4>
                          <Alert>
                            <AlertTitle>Application Fee: Rs25</AlertTitle>
                            <AlertDescription>
                              Scan the QR code to complete the payment.
                            </AlertDescription>
                          </Alert>
                           <div className="flex justify-center p-4 bg-muted rounded-md">
                             <Image src="https://picsum.photos/seed/qr/200/200" alt="Payment QR Code" width={200} height={200} data-ai-hint="QR code" />
                           </div>
                          <div className="space-y-2">
                            <Label htmlFor="paymentProof">Screenshot of Payment Proof</Label>
                            <Input id="paymentProof" type="file" required className="pt-2" />
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    
                    <div className="space-y-4">
                       <h4 className="text-lg font-medium">Requirement 1: YouTube</h4>
                        <Alert>
                          <Youtube className="h-4 w-4" />
                          <AlertTitle>Subscribe on YouTube</AlertTitle>
                          <AlertDescription>
                            Please subscribe to our channel and upload 4 screenshots as proof.
                             <Button variant="link" asChild className="p-0 h-auto ml-1">
                              <Link href="https://www.youtube.com/@syndicateesp1" target="_blank">
                                Visit Channel
                              </Link>
                            </Button>
                          </AlertDescription>
                        </Alert>
                       <div className="space-y-2">
                         <Label htmlFor="youtubeProof">Upload 4 Screenshots</Label>
                         <Input id="youtubeProof" type="file" required multiple className="pt-2" />
                       </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full font-bold text-lg py-6"
                    >
                      {selectedEvent.free ? 'Register Team' : 'Submit Application'}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p>Please select a tournament from the list above to begin registration.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="order-1 lg:order-2 text-center lg:text-left sticky top-24">
            <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter">
              Register to Compete
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
              {selectedEvent
                ? `You've selected the ${selectedEvent.name}.`
                : 'Select a tournament above to begin your registration.'}
            </p>
            {selectedEvent && (
              <p className="mt-4 text-base text-accent">
                {selectedEvent.free
                  ? 'This is a free-to-enter event. Complete the form to secure your spot.'
                  : 'An entry fee is required. Please follow the payment instructions in the form.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
