'use client';

import type { Event } from '@/lib/data';
import { Calendar, Trophy } from 'lucide-react';
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
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

const gameImageIds = [
  'Valorant',
  'Apex Legends',
  'League of Legends',
  'Free Fire',
  'Minecraft',
  'Pubg',
  'Call of Duty',
];


export function EventSchedule() {
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Event>(eventsRef);

  const gameImages = PlaceHolderImages.filter((p) =>
    gameImageIds.includes(p.id)
  );

  return (
    <section id="tournaments" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            Upcoming Tournaments
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Register your team to compete for glory and prizes.
          </p>
        </div>

        <div
          id="schedule"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {isLoading && <div className="col-span-full text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>}
          {events?.map((event) => {
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
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 text-accent" />
                    <span>₹{event.prize} Prize Pool</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full font-bold"
                    variant={event.status === 'Open' ? 'default' : 'secondary'}
                    disabled={event.status !== 'Open'}
                  >
                    <Link href={`/register-event/${event.id}`}>
                      {event.status === 'Open' ? 'Register Now' : event.status}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
