'use client';

import type { Event } from '@/lib/data';
import { Calendar, Trophy, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function EventSchedule() {
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'events') : null),
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Event>(eventsRef);

  const getStatusVariant = (status: Event['status']) => {
    switch (status) {
      case 'Open':
        return 'destructive';
      case 'Coming Soon':
        return 'secondary';
      case 'Live':
        return 'default';
      case 'Closed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'Open':
        return 'Registration Open';
      default:
        return status;
    }
  };
  
  const formatPrize = (prize: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(prize);
  }

  const getGameImage = (gameName: Event['game']) => {
    return PlaceHolderImages.find((p) => p.id === gameName) ?? PlaceHolderImages.find((p) => p.id === 'image-placeholder');
  };

  return (
    <section id="tournaments" className="py-16 md:py-24 bg-background">
      <div className="container max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            Active Tournaments
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Join the competition and prove your skills.
          </p>
        </div>

        <div
          id="schedule"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {isLoading && <div className="col-span-full text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>}
          {events?.map((event) => {
            const gameImage = getGameImage(event.game);
            return (
              <Card
                key={event.id}
                className="group flex flex-col bg-card border-border/60 overflow-hidden"
              >
                <div className="relative aspect-video">
                  {gameImage && (
                     <Image
                      src={gameImage.imageUrl}
                      alt={gameImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={gameImage.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-headline text-2xl text-white drop-shadow-md">{event.game}</h3>
                  </div>
                </div>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="font-headline text-2xl leading-tight">
                            {event.name}
                        </CardTitle>
                        <Badge variant={getStatusVariant(event.status)} className="whitespace-nowrap">
                            {getStatusText(event.status)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4" />
                    <span>{event.registeredTeams}/{event.maxTeams} Teams</span>
                  </div>
                   <div className="flex items-center gap-2.5 font-bold text-foreground">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    <span>{formatPrize(event.prize)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                   <div className="flex items-center gap-2">
                        {event.gameMode && <Badge variant="outline">{event.gameMode}</Badge>}
                        {event.map && <Badge variant="outline">{event.map}</Badge>}
                    </div>
                  <Button
                    asChild
                    className="w-full font-bold text-lg h-12"
                    variant={event.status === 'Open' ? 'destructive' : 'secondary'}
                    disabled={event.status !== 'Open'}
                  >
                    <Link href={`/register-event/${event.id}`}>
                      {event.status === 'Open'
                        ? 'Register Now'
                        : event.status}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
