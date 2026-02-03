'use client';

import type { Event } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useMemo } from 'react';
import { Gamepad2 } from 'lucide-react';

export function EventSchedule() {
  const firestore = useFirestore();

  const eventsRef = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'events'), orderBy('date', 'desc')) : null),
    [firestore]
  );
  const { data: events, isLoading } = useCollection<Event>(eventsRef);

  const gameCategories = useMemo(() => {
    if (!events) return [];
    const games = new Set<Event['game']>();
    events.forEach(event => games.add(event.game));
    return Array.from(games);
  }, [events]);

  const getGameImage = (gameName: Event['game']) => {
    return PlaceHolderImages.find((p) => p.id === gameName) ?? PlaceHolderImages.find((p) => p.id === 'image-placeholder');
  };

  return (
    <section id="tournaments" className="py-16 md:py-24 bg-background w-full overflow-x-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="text-gradient-animate">Browse Tournaments by Game</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Select a game to see all available tournaments.
          </p>
        </div>

        <div
          id="schedule"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {isLoading && <div className="col-span-full text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>}
          
          {gameCategories.map((gameName, idx) => {
            const gameImage = getGameImage(gameName);
            return (
              <div key={gameName} className="pop-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <Link href={`/tournaments/${gameName}`} passHref>
                  <Card className="group flex flex-col bg-card border-border/60 overflow-hidden h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm hover:border-blue-500/50">
                    <div className="relative aspect-square overflow-hidden">
                      {gameImage && (
                          <Image
                          src={gameImage.imageUrl}
                          alt={gameImage.description}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={gameImage.imageHint}
                          />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                      <CardHeader className="absolute bottom-0 left-0 w-full p-4">
                          <CardTitle className="font-headline text-2xl text-white drop-shadow-md group-hover:translate-y-1 transition-transform duration-300">{gameName}</CardTitle>
                      </CardHeader>
                    </div>
                    <CardContent className="p-4 flex-grow flex items-center justify-between group-hover:bg-muted/50 transition-colors duration-300">
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">View Tournaments</p>
                      <Gamepad2 className="h-5 w-5 text-primary group-hover:rotate-12 group-hover:scale-125 transition-transform duration-300" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
