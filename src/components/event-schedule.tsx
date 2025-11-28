'use client';

import { useState } from 'react';
import type { Event } from '@/lib/data';
import { events } from '@/lib/data';
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

const gameFilters = ['All', 'Valorant', 'Apex Legends', 'League of Legends'];

export function EventSchedule() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredEvents =
    activeFilter === 'All'
      ? events
      : events.filter((event) => event.game === activeFilter);

  const gameImages = PlaceHolderImages.filter((p) =>
    gameFilters.includes(p.id)
  );

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
